"use strict";

/**
 * Demo seeder for the `studios` table (10 entries).
 *
 * This mirrors the real registration flow in
 * src/controllers/auth.controller.js, so for each studio it creates rows in
 * THREE tables:
 *
 *   1. users       -> role = "studio", status = "approved"
 *   2. studios     -> the profile itself (userId -> users.id)
 *   3. talent_ids  -> talentCode = `AUI-STU-<userId padded to 6>`
 *
 * All three use find-or-create and run inside one transaction, so re-running
 * the script is safe (no duplicates, no overwrites).
 *
 * Usage:
 *   node scripts/seedStudios.js          # insert demo data
 *   node scripts/seedStudios.js --undo   # remove the demo data
 */

const db = require("../models");

const STUDIOS = [
  {
    studioName: "Nucleus Post Studios",
    email: "contact@nucleuspost.in",
    website: "https://nucleuspost.in",
    location: "Mumbai, Maharashtra",
    contactPerson: "Rahul Deshmukh",
    designation: "Head of Production",
    teamSize: 45,
    yearsInOperation: 12,
    workType: "film",
    hiringFrequency: "frequent",
    projectType: "both",
    annualProjects: 18,
    hiringTiers: "Junior, Mid, Senior",
    linkedinProfile: "https://linkedin.com/company/nucleus-post",
    phone: "+91 22 4004 1200",
    verificationStatus: true,
  },
  {
    studioName: "Redshift VFX",
    email: "hello@redshiftvfx.com",
    website: "https://redshiftvfx.com",
    location: "Hyderabad, Telangana",
    contactPerson: "Sneha Reddy",
    designation: "Studio Manager",
    teamSize: 120,
    yearsInOperation: 8,
    workType: "series",
    hiringFrequency: "frequent",
    projectType: "international",
    annualProjects: 25,
    hiringTiers: "Mid, Senior, Lead",
    linkedinProfile: "https://linkedin.com/company/redshift-vfx",
    phone: "+91 40 2355 8890",
    verificationStatus: true,
  },
  {
    studioName: "Frame by Frame Animation",
    email: "studio@framebyframe.co.in",
    website: "https://framebyframe.co.in",
    location: "Pune, Maharashtra",
    contactPerson: "Aditya Kulkarni",
    designation: "Creative Director",
    teamSize: 30,
    yearsInOperation: 6,
    workType: "gaming",
    hiringFrequency: "occasional",
    projectType: "domestic",
    annualProjects: 10,
    hiringTiers: "Junior, Mid",
    linkedinProfile: "https://linkedin.com/company/framebyframe-anim",
    phone: "+91 20 6721 4455",
    verificationStatus: true,
  },
  {
    studioName: "Silver Reel Productions",
    email: "info@silverreel.in",
    website: "https://silverreel.in",
    location: "New Delhi, Delhi",
    contactPerson: "Priya Malhotra",
    designation: "Executive Producer",
    teamSize: 22,
    yearsInOperation: 15,
    workType: "ads",
    hiringFrequency: "occasional",
    projectType: "domestic",
    annualProjects: 40,
    hiringTiers: "Mid, Senior",
    linkedinProfile: "https://linkedin.com/company/silver-reel",
    phone: "+91 11 4155 7788",
    verificationStatus: true,
  },
  {
    studioName: "Coastline Sound Labs",
    email: "bookings@coastlinesound.in",
    website: "https://coastlinesound.in",
    location: "Kochi, Kerala",
    contactPerson: "Nikhil Menon",
    designation: "Chief Sound Engineer",
    teamSize: 14,
    yearsInOperation: 9,
    workType: "film",
    hiringFrequency: "rare",
    projectType: "domestic",
    annualProjects: 12,
    hiringTiers: "Mid, Senior",
    linkedinProfile: "https://linkedin.com/company/coastline-sound",
    phone: "+91 484 405 3321",
    verificationStatus: false,
  },
  {
    studioName: "Meridian Motion Pictures",
    email: "office@meridianmp.com",
    website: "https://meridianmp.com",
    location: "Chennai, Tamil Nadu",
    contactPerson: "Lakshmi Narayanan",
    designation: "Line Producer",
    teamSize: 60,
    yearsInOperation: 20,
    workType: "film",
    hiringFrequency: "frequent",
    projectType: "both",
    annualProjects: 8,
    hiringTiers: "Junior, Mid, Senior, Lead",
    linkedinProfile: "https://linkedin.com/company/meridian-mp",
    phone: "+91 44 2841 9900",
    verificationStatus: true,
  },
  {
    studioName: "Pixel Forge Studios",
    email: "team@pixelforge.co",
    website: "https://pixelforge.co",
    location: "Bengaluru, Karnataka",
    contactPerson: "Kabir Shetty",
    designation: "Co-founder",
    teamSize: 85,
    yearsInOperation: 5,
    workType: "gaming",
    hiringFrequency: "frequent",
    projectType: "international",
    annualProjects: 15,
    hiringTiers: "Mid, Senior, Lead",
    linkedinProfile: "https://linkedin.com/company/pixel-forge",
    phone: "+91 80 4090 6677",
    verificationStatus: true,
  },
  {
    studioName: "Blue Yonder Films",
    email: "contact@blueyonderfilms.in",
    website: "https://blueyonderfilms.in",
    location: "Ahmedabad, Gujarat",
    contactPerson: "Meera Patel",
    designation: "Production Head",
    teamSize: 18,
    yearsInOperation: 7,
    workType: "series",
    hiringFrequency: "occasional",
    projectType: "domestic",
    annualProjects: 6,
    hiringTiers: "Junior, Mid",
    linkedinProfile: "https://linkedin.com/company/blue-yonder-films",
    phone: "+91 79 4800 2211",
    verificationStatus: false,
  },
  {
    studioName: "Northlight Post",
    email: "hello@northlightpost.com",
    website: "https://northlightpost.com",
    location: "Kolkata, West Bengal",
    contactPerson: "Arjun Bose",
    designation: "Post Supervisor",
    teamSize: 26,
    yearsInOperation: 11,
    workType: "film",
    hiringFrequency: "occasional",
    projectType: "both",
    annualProjects: 14,
    hiringTiers: "Mid, Senior",
    linkedinProfile: "https://linkedin.com/company/northlight-post",
    phone: "+91 33 4602 8845",
    verificationStatus: true,
  },
  {
    studioName: "Skyline Ad Works",
    email: "studio@skylineadworks.in",
    website: "https://skylineadworks.in",
    location: "Jaipur, Rajasthan",
    contactPerson: "Ananya Ahuja",
    designation: "Business Head",
    teamSize: 12,
    yearsInOperation: 4,
    workType: "ads",
    hiringFrequency: "frequent",
    projectType: "domestic",
    annualProjects: 55,
    hiringTiers: "Junior, Mid",
    linkedinProfile: "https://linkedin.com/company/skyline-ad-works",
    phone: "+91 141 405 1177",
    verificationStatus: false,
  },
];

const STUDIO_EMAILS = STUDIOS.map((s) => s.email);

async function up() {
  const { User, Studio, TalentId, sequelize } = db;

  await sequelize.transaction(async (transaction) => {
    for (const entry of STUDIOS) {
      // 1. users
      const [user, userCreated] = await User.findOrCreate({
        where: { email: entry.email },
        defaults: {
          email: entry.email,
          phone: entry.phone,
          role: "studio",
          status: "approved",
        },
        transaction,
      });

      // 2. studios
      const [studio, studioCreated] = await Studio.findOrCreate({
        where: { userId: user.id },
        defaults: {
          userId: user.id,
          studioName: entry.studioName,
          email: entry.email,
          website: entry.website || null,
          location: entry.location || null,
          contactPerson: entry.contactPerson,
          designation: entry.designation || null,
          teamSize: entry.teamSize ?? null,
          yearsInOperation: entry.yearsInOperation ?? null,
          workType: entry.workType || null,
          hiringFrequency: entry.hiringFrequency || null,
          projectType: entry.projectType || null,
          annualProjects: entry.annualProjects ?? null,
          hiringTiers: entry.hiringTiers || null,
          linkedinProfile: entry.linkedinProfile || null,
          phone: entry.phone || null,
          verificationStatus: !!entry.verificationStatus,
        },
        transaction,
      });

      // 3. talent_ids  (same format as auth.controller.js)
      const talentCode = `AUI-STU-${String(user.id).padStart(6, "0")}`;
      const [talent, talentCreated] = await TalentId.findOrCreate({
        where: { userId: user.id },
        defaults: { userId: user.id, talentCode },
        transaction,
      });

      console.log(
        `user#${user.id}${userCreated ? "*" : " "}  studio#${studio.id}${studioCreated ? "*" : " "}  ${talent.talentCode}${talentCreated ? "*" : " "}  ${entry.studioName}`
      );
    }
  });

  console.log(`\nDone. ${STUDIOS.length} demo studios ensured (users + studios + talent_ids).`);
}

async function down() {
  const { User, Studio, TalentId, sequelize } = db;

  await sequelize.transaction(async (transaction) => {
    const users = await User.findAll({
      where: { email: STUDIO_EMAILS },
      transaction,
    });
    const userIds = users.map((u) => u.id);

    const removedTalent = await TalentId.destroy({ where: { userId: userIds }, transaction });
    const removedStudios = await Studio.destroy({ where: { userId: userIds }, transaction });
    const removedUsers = await User.destroy({ where: { id: userIds }, transaction });

    console.log(
      `Removed ${removedTalent} talent_ids, ${removedStudios} studios, ${removedUsers} users.`
    );
  });
}

(async () => {
  const undo = process.argv.includes("--undo");
  try {
    await (undo ? down() : up());
    await db.sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    await db.sequelize.close();
    process.exit(1);
  }
})();
