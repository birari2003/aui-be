const { PublicInstituteProfile, User, Institute } = require("../../models");

const formatInstituteProfile = (profile) => {
  if (!profile) return null;
  const data = profile.toJSON ? profile.toJSON() : { ...profile };
  
  if (profile.user && profile.user.talentId) {
    data.talentCode = profile.user.talentId.talentCode;
  }

  // Ensure JSON fields are parsed if they come back as strings
  const parseJSON = (val, defaultVal = []) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return defaultVal; }
    }
    return val || defaultVal;
  };

  data.features = parseJSON(data.features);
  data.programs = parseJSON(data.programs);
  data.whyChooseUs = parseJSON(data.whyChooseUs);
  data.industryPartners = parseJSON(data.industryPartners);
  data.testimonials = parseJSON(data.testimonials);
  data.socialLinks = parseJSON(data.socialLinks, {});
  
  return data;
};

const getMyInstitutePublicProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await PublicInstituteProfile.findOne({ 
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          include: [{ model: require("../../models").TalentId, as: 'talentId' }]
        }
      ]
    });
    res.status(200).json({ ok: true, data: formatInstituteProfile(profile) });
  } catch (error) {
    console.error("GetMyInstitutePublicProfile Error:", error);
    res.status(500).json({ ok: false, message: "Server error", detail: error.message });
  }
};

const getInstituteProfileByTalentCode = async (req, res) => {
  try {
    const { talentCode } = req.params;
    const { TalentId } = require("../../models");
    const talent = await TalentId.findOne({ where: { talentCode } });
    
    if (!talent) {
      return res.status(404).json({ ok: false, message: "Institute not found" });
    }

    const profile = await PublicInstituteProfile.findOne({ 
      where: { userId: talent.userId },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            { 
              model: Institute, 
              as: 'institute',
            },
            { model: TalentId, as: 'talentId' }
          ]
        }
      ]
    });

    if (!profile) {
      return res.status(404).json({ ok: false, message: "Institute profile not published" });
    }

    res.status(200).json({ ok: true, data: formatInstituteProfile(profile) });
  } catch (error) {
    console.error("GetInstituteProfileByTalentCode Error:", error);
    res.status(500).json({ ok: false, message: "Server error", detail: error.message });
  }
};

const upsertInstituteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const body = req.body;

    const parseJSON = (val) => typeof val === 'string' ? JSON.parse(val) : (val || []);

    let features = parseJSON(body.features);
    let programs = parseJSON(body.programs);
    let whyChooseUs = parseJSON(body.whyChooseUs);
    let industryPartners = parseJSON(body.industryPartners);
    let testimonials = parseJSON(body.testimonials);
    let socialLinks = typeof body.socialLinks === 'string' ? JSON.parse(body.socialLinks) : (body.socialLinks || {});

    // Handle files
    let logo = body.logo;
    if (req.files && req.files.logoFile) {
      logo = req.files.logoFile[0].path;
    }

    let bannerImage = body.bannerImage;
    if (req.files && req.files.bannerImageFile) {
      bannerImage = req.files.bannerImageFile[0].path;
    }

    // Map program thumbnails
    if (req.files && req.files.programThumbnails) {
      req.files.programThumbnails.forEach(file => {
        programs.forEach(prog => {
          if (prog.thumbnail === `PENDING_UPLOAD:${file.originalname}`) {
            prog.thumbnail = file.path;
          }
        });
      });
    }

    // Map partner logos
    if (req.files && req.files.partnerLogos) {
      req.files.partnerLogos.forEach(file => {
        industryPartners = industryPartners.map(partner => {
          if (partner === `PENDING_UPLOAD:${file.originalname}`) {
            return file.path;
          }
          return partner;
        });
      });
    }

    // Map testimonial photos
    if (req.files && req.files.testimonialPhotos) {
      req.files.testimonialPhotos.forEach(file => {
        testimonials.forEach(t => {
          if (t.photo === `PENDING_UPLOAD:${file.originalname}`) {
            t.photo = file.path;
          }
        });
      });
    }

    const updateData = {
      userId,
      logo,
      bannerImage,
      name: body.name,
      tagline: body.tagline,
      location: body.location,
      website: body.website,
      about: body.about,
      estYear: parseInt(body.estYear) || null,
      studentsTrained: body.studentsTrained,
      industryMentors: body.industryMentors,
      placementRate: body.placementRate,
      partnerStudios: body.partnerStudios,
      alumniWorking: body.alumniWorking,
      workshopsConducted: parseInt(body.workshopsConducted) || 0,
      mentorshipSessions: parseInt(body.mentorshipSessions) || 0,
      portfolioReviews: parseInt(body.portfolioReviews) || 0,
      features,
      showcaseVideoUrl: body.showcaseVideoUrl,
      programs,
      whyChooseUs,
      industryPartners,
      testimonials,
      email: body.email,
      phone: body.phone,
      address: body.address,
      officeHours: body.officeHours,
      socialLinks,
    };

    const [profile, created] = await PublicInstituteProfile.findOrCreate({
      where: { userId },
      defaults: updateData,
    });

    if (!created) {
      await profile.update(updateData);
    }

    res.status(200).json({ ok: true, message: "Institute profile updated", data: formatInstituteProfile(profile) });
  } catch (error) {
    console.error("UpsertInstituteProfile Error:", error);
    res.status(500).json({ ok: false, message: "Server error", detail: error.message });
  }
};

const getAllInstituteProfiles = async (req, res) => {
  try {
    const profiles = await PublicInstituteProfile.findAll({
      include: [
        {
          model: User,
          as: 'user',
          include: [{ model: require("../../models").TalentId, as: 'talentId' }]
        }
      ]
    });
    
    const formatted = profiles.map(formatInstituteProfile);
    res.status(200).json({ ok: true, data: formatted });
  } catch (error) {
    console.error("GetAllInstituteProfiles Error:", error);
    res.status(500).json({ ok: false, message: "Server error", detail: error.message });
  }
};

module.exports = {
  getMyInstitutePublicProfile,
  getInstituteProfileByTalentCode,
  upsertInstituteProfile,
  getAllInstituteProfiles,
};
