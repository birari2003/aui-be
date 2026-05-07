const { PublicStudioProfile, User, Studio } = require("../../models");

const formatStudioProfile = (profile) => {
  if (!profile) return null;
  const data = profile.toJSON ? profile.toJSON() : { ...profile };
  
  // Flatten talentCode if user association is included
  if (profile.user && profile.user.talentId) {
    data.talentCode = profile.user.talentId.talentCode;
  }
  
  return data;
};

const getMyStudioPublicProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await PublicStudioProfile.findOne({ 
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          include: [{ model: require("../../models").TalentId, as: 'talentId' }]
        }
      ]
    });
    res.status(200).json({ ok: true, data: formatStudioProfile(profile) });
  } catch (error) {
    console.error("GetMyStudioPublicProfile Error:", error);
    res.status(500).json({ ok: false, message: "Server error", detail: error.message });
  }
};

const getStudioProfileByTalentCode = async (req, res) => {
  try {
    const { talentCode } = req.params;
    
    // Find the talent record to get the userId
    const { TalentId } = require("../../models");
    const talent = await TalentId.findOne({ where: { talentCode } });
    
    if (!talent) {
      return res.status(404).json({ ok: false, message: "Studio not found" });
    }

    const profile = await PublicStudioProfile.findOne({ 
      where: { userId: talent.userId },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            { 
              model: Studio, 
              as: 'studio',
              include: [{
                model: require("../../models").StudioJobPosting,
                as: 'jobPostings',
                where: { status: 'open' },
                required: false
              }]
            },
            { model: TalentId, as: 'talentId' }
          ]
        }
      ]
    });

    if (!profile) {
      return res.status(404).json({ ok: false, message: "Studio profile not published" });
    }

    res.status(200).json({ ok: true, data: formatStudioProfile(profile) });
  } catch (error) {
    console.error("GetStudioProfileByTalentCode Error:", error);
    res.status(500).json({ ok: false, message: "Server error", detail: error.message });
  }
};

const upsertStudioProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const body = req.body;

    // Parse JSON fields
    let whatWeDo = typeof body.whatWeDo === 'string' ? JSON.parse(body.whatWeDo) : (body.whatWeDo || []);
    let whyWorkWithUs = typeof body.whyWorkWithUs === 'string' ? JSON.parse(body.whyWorkWithUs) : (body.whyWorkWithUs || []);
    let extraVideos = typeof body.extraVideos === 'string' ? JSON.parse(body.extraVideos) : (body.extraVideos || []);
    let projects = typeof body.projects === 'string' ? JSON.parse(body.projects) : (body.projects || []);
    let clients = typeof body.clients === 'string' ? JSON.parse(body.clients) : (body.clients || []);
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

    // Map project thumbnails
    if (req.files && req.files.projectThumbnails) {
      req.files.projectThumbnails.forEach(file => {
        projects.forEach(project => {
          if (project.thumbnail === `PENDING_UPLOAD:${file.originalname}`) {
            project.thumbnail = file.path;
          }
        });
      });
    }

    // Map client logos
    if (req.files && req.files.clientLogos) {
      req.files.clientLogos.forEach(file => {
        clients = clients.map(client => {
          if (client === `PENDING_UPLOAD:${file.originalname}`) {
            return file.path;
          }
          return client;
        });
      });
    }

    const updateData = {
      userId,
      logo,
      bannerImage,
      name: body.name,
      specialty: body.specialty,
      location: body.location,
      email: body.email,
      phone: body.phone,
      website: body.website,
      about: body.about,
      projectsCompleted: parseInt(body.projectsCompleted) || 0,
      artistsHired: parseInt(body.artistsHired) || 0,
      yearsActive: parseInt(body.yearsActive) || 0,
      awardsWon: parseInt(body.awardsWon) || 0,
      whatWeDo,
      whyWorkWithUs,
      studioReelUrl: body.studioReelUrl,
      extraVideos,
      projects,
      clients,
      socialLinks,
    };

    const [profile, created] = await PublicStudioProfile.findOrCreate({
      where: { userId },
      defaults: updateData,
    });

    if (!created) {
      await profile.update(updateData);
    }

    res.status(200).json({ ok: true, message: "Studio profile updated", data: formatStudioProfile(profile) });
  } catch (error) {
    console.error("UpsertStudioProfile Error:", error);
    res.status(500).json({ ok: false, message: "Server error", detail: error.message });
  }
};

const getAllStudioProfiles = async (req, res) => {
  try {
    const profiles = await PublicStudioProfile.findAll({
      include: [
        {
          model: User,
          as: 'user',
          include: [
            { model: require("../../models").TalentId, as: 'talentId' }
          ]
        }
      ]
    });
    
    const formatted = profiles.map(formatStudioProfile);
    res.status(200).json({ ok: true, data: formatted });
  } catch (error) {
    console.error("GetAllStudioProfiles Error:", error);
    res.status(500).json({ ok: false, message: "Server error", detail: error.message });
  }
};

module.exports = {
  getMyStudioPublicProfile,
  getStudioProfileByTalentCode,
  upsertStudioProfile,
  getAllStudioProfiles,
};
