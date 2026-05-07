const { PublicProfessionalProfile, User, TalentId, Professional } = require("../../models");

const formatProfile = (profile) => {
  if (!profile) return null;
  const p = profile.toJSON ? profile.toJSON() : profile;
  
  // Ensure JSON fields are parsed if they come back as strings
  const parseJSON = (val) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return []; }
    }
    return val || [];
  };

  return {
    ...p,
    experienceTimeline: parseJSON(p.experienceTimeline),
    workLedger: parseJSON(p.workLedger),
    showreel: {
      type: p.showreelType,
      url: p.showreelUrl,
      title: p.showreelTitle,
      duration: p.showreelDuration,
    },
    profileImage: p.profileImage,
    workLedgerImage: p.workLedgerImage,
  };
};

const getPublicProfile = async (req, res) => {
  try {
    const { talentCode } = req.params;
    
    const user = await User.findOne({
      include: [
        {
          model: TalentId,
          as: "talentId",
          where: { talentCode }
        },
        { model: Professional, as: "professional" },
        { model: PublicProfessionalProfile, as: "publicProfile" }
      ]
    });

    if (!user) {
      return res.status(404).json({ ok: false, message: "Profile not found" });
    }

    const userData = user.toJSON();
    if (userData.publicProfile) {
      userData.publicProfile = formatProfile(userData.publicProfile);
    }

    res.status(200).json({ ok: true, data: userData });
  } catch (error) {
    console.error("GetPublicProfile Error:", error);
    res.status(500).json({ ok: false, message: "Server error (Public)", detail: error.message });
  }
};

const getMyPublicProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = await PublicProfessionalProfile.findOne({ where: { userId } });
      res.status(200).json({ ok: true, data: formatProfile(profile) });
    } catch (error) {
      console.error("GetMyPublicProfile Error:", error);
      res.status(500).json({ ok: false, message: "Server error (GetMy)", detail: error.message });
    }
};

const upsertPublicProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Upsert Request for User:", userId);
    console.log("Upsert Request Body:", req.body);

    const { 
      auiInsight, 
      experienceTimeline, 
      showreelType, 
      showreelUrl, 
      showreelTitle, 
      showreelDuration, 
      workLedger,
      profileImage,
      workLedgerImage
    } = req.body;

    // Handle files if any
    let updatedShowreelUrl = showreelUrl;
    if (req.files && req.files.showreelVideo) {
      updatedShowreelUrl = req.files.showreelVideo[0].path;
      console.log("Updated showreel video path:", updatedShowreelUrl);
    }

    let updatedProfileImage = profileImage;
    if (req.files && req.files.profileImageFile) {
      updatedProfileImage = req.files.profileImageFile[0].path;
      console.log("Updated profile image path:", updatedProfileImage);
    }

    let updatedWorkLedgerImage = workLedgerImage;
    if (req.files && req.files.workLedgerImageFile) {
      updatedWorkLedgerImage = req.files.workLedgerImageFile[0].path;
      console.log("Updated work ledger image path:", updatedWorkLedgerImage);
    }

    // parsing
    let parsedWorkLedger = [];
    let parsedTimeline = [];
    
    try {
      parsedWorkLedger = typeof workLedger === 'string' ? JSON.parse(workLedger) : (workLedger || []);
      parsedTimeline = typeof experienceTimeline === 'string' ? JSON.parse(experienceTimeline) : (experienceTimeline || []);
      
      console.log("WorkLedger before mapping:", JSON.stringify(parsedWorkLedger));

      // Handle project images mapping
      if (req.files && req.files.projectImages) {
        console.log("Received projectImages:", req.files.projectImages.length);
        req.files.projectImages.forEach(file => {
          console.log(`Mapping file: ${file.originalname} -> ${file.path}`);
          parsedWorkLedger.forEach((project, pIdx) => {
            if (!project.shotSamples) project.shotSamples = [];
            if (!Array.isArray(project.shotSamples)) {
                project.shotSamples = typeof project.shotSamples === 'string' ? [project.shotSamples] : [];
            }
            
            project.shotSamples = project.shotSamples.map(sample => {
              if (typeof sample === 'string' && sample === `PENDING_UPLOAD:${file.originalname}`) {
                console.log(`[Project ${pIdx}] Match found for ${file.originalname}!`);
                return file.path;
              }
              return sample;
            });
          });
        });
      }
      
      console.log("WorkLedger final state:", JSON.stringify(parsedWorkLedger, null, 2));
      console.log("Parsed JSON data and mapped images successfully");
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return res.status(400).json({ ok: false, message: "Invalid JSON format for workLedger or experienceTimeline" });
    }

    console.log("Saving profile for userId:", userId);
    const [profile, created] = await PublicProfessionalProfile.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        auiInsight,
        experienceTimeline: parsedTimeline,
        showreelType: showreelType || "youtube",
        showreelUrl: updatedShowreelUrl,
        showreelTitle,
        showreelDuration,
        workLedger: parsedWorkLedger,
        profileImage: updatedProfileImage,
        workLedgerImage: updatedWorkLedgerImage,
      },
    });

    if (!created) {
      console.log("Updating existing profile for userId:", userId);
      await profile.update({
        auiInsight: auiInsight || profile.auiInsight,
        experienceTimeline: parsedTimeline,
        showreelType: showreelType || profile.showreelType,
        showreelUrl: updatedShowreelUrl || profile.showreelUrl,
        showreelTitle: showreelTitle || profile.showreelTitle,
        showreelDuration: showreelDuration || profile.showreelDuration,
        workLedger: parsedWorkLedger,
        profileImage: updatedProfileImage || profile.profileImage,
        workLedgerImage: updatedWorkLedgerImage || profile.workLedgerImage,
      });
    }

    const finalProfile = await PublicProfessionalProfile.findOne({ where: { userId } });
    res.status(200).json({ 
      ok: true, 
      message: "Profile updated successfully", 
      data: formatProfile(finalProfile) 
    });
  } catch (error) {
    console.error("UpsertPublicProfile Error Detail:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Server error (Upsert)", 
      detail: error.message,
      stack: error.stack
    });
  }
};

module.exports = {
  getPublicProfile,
  getMyPublicProfile,
  upsertPublicProfile,
};
