"use strict";

/**
 * Demo seeder for the `institutes` table (7 entries).
 *
 * Mirrors the real registration flow in src/controllers/auth.controller.js,
 * so for each institute it creates rows in THREE tables:
 *
 *   1. users       -> role = "institute", status = "approved"
 *   2. institutes  -> the profile itself (userId -> users.id)
 *   3. talent_ids  -> talentCode = `AUI-INST-<userId padded to 6>`
 *
 * All three use find-or-create inside one transaction, so re-running the
 * script is safe (no duplicates, no overwrites).
 *
 * Usage:
 *   node scripts/seedInstitutes.js          # insert demo data
 *   node scripts/seedInstitutes.js --undo   # remove the demo data
 */

const db = require("../models");

const INSTITUTES = [
  {
    instituteName: "Horizon School of Film & Media",
    email: "admissions@horizonfilmschool.in",
    website: "https://horizonfilmschool.in",
    location: "Mumbai, Maharashtra",
    contactPerson: "Dr. Anjali Rao",
    designation: "Dean of Academics",
    studentCount: 1200,
    branchCount: 2,
    coursesOffered: "Direction, Cinematography, Editing, Sound Design, Screenwriting",
    conductsWorkshops: true,
    industryExposure: "regularly",
    yearsInEducation: 18,
    supportNeeded: "Guest lectures, internship placements",
    activeServices: "Placement cell, Industry mentorship",
    verificationUrl: "https://horizonfilmschool.in/accreditation",
    servicesRequired: "Masterclasses, equipment sponsorship",
    officialLinks: "https://linkedin.com/school/horizon-film",
    requirements: "Visiting faculty from active professionals",
    description: "A leading film school offering hands-on training across all core departments.",
    establishedYear: 2007,
    verificationStatus: true,
  },
  {
    instituteName: "National Academy of Performing Arts",
    email: "office@napa.edu.in",
    website: "https://napa.edu.in",
    location: "New Delhi, Delhi",
    contactPerson: "Prof. Rakesh Khanna",
    designation: "Registrar",
    studentCount: 800,
    branchCount: 1,
    coursesOffered: "Acting, Theatre, Voice & Speech, Movement",
    conductsWorkshops: true,
    industryExposure: "occasionally",
    yearsInEducation: 25,
    supportNeeded: "Casting exposure for graduates",
    activeServices: "Repertory company, Annual showcase",
    verificationUrl: "https://napa.edu.in/about/recognition",
    servicesRequired: "Industry auditions, showreel support",
    officialLinks: "https://linkedin.com/school/napa-delhi",
    requirements: "Panel of casting directors for final year reviews",
    description: "Premier performing arts academy with a strong theatre and acting tradition.",
    establishedYear: 1999,
    verificationStatus: true,
  },
  {
    instituteName: "Southern Institute of Visual Effects",
    email: "info@sive.ac.in",
    website: "https://sive.ac.in",
    location: "Hyderabad, Telangana",
    contactPerson: "Ms. Divya Prakash",
    designation: "Head of Placements",
    studentCount: 950,
    branchCount: 3,
    coursesOffered: "VFX, 3D Animation, Compositing, Motion Graphics, Game Art",
    conductsWorkshops: true,
    industryExposure: "regularly",
    yearsInEducation: 12,
    supportNeeded: "Studio pipeline training, live projects",
    activeServices: "Campus recruitment, Software labs",
    verificationUrl: "https://sive.ac.in/accreditation",
    servicesRequired: "Industry-standard render farm access",
    officialLinks: "https://linkedin.com/school/sive-hyderabad",
    requirements: "Mentors from VFX studios",
    description: "Specialised VFX and animation institute feeding talent to major post houses.",
    establishedYear: 2013,
    verificationStatus: true,
  },
  {
    instituteName: "Coastal Media Arts College",
    email: "contact@coastalmediaarts.in",
    website: "https://coastalmediaarts.in",
    location: "Kochi, Kerala",
    contactPerson: "Mr. Thomas Varghese",
    designation: "Principal",
    studentCount: 420,
    branchCount: 1,
    coursesOffered: "Filmmaking, Documentary, Photography, Editing",
    conductsWorkshops: false,
    industryExposure: "occasionally",
    yearsInEducation: 9,
    supportNeeded: "Festival tie-ups, equipment grants",
    activeServices: "Student film fund",
    verificationUrl: "https://coastalmediaarts.in/recognition",
    servicesRequired: "Distribution guidance for student films",
    officialLinks: "https://linkedin.com/school/coastal-media-arts",
    requirements: "Workshop facilitators",
    description: "Independent media arts college focused on documentary and regional cinema.",
    establishedYear: 2016,
    verificationStatus: false,
  },
  {
    instituteName: "Deccan Institute of Sound & Music Technology",
    email: "admissions@deccansound.in",
    website: "https://deccansound.in",
    location: "Pune, Maharashtra",
    contactPerson: "Ms. Farah Sheikh",
    designation: "Programme Director",
    studentCount: 300,
    branchCount: 1,
    coursesOffered: "Sound Design, Music Production, Live Sound, Audio Post",
    conductsWorkshops: true,
    industryExposure: "regularly",
    yearsInEducation: 7,
    supportNeeded: "Studio internships, mixing mentorship",
    activeServices: "Recording studio access, Alumni network",
    verificationUrl: "https://deccansound.in/about/accreditation",
    servicesRequired: "Dolby Atmos certification support",
    officialLinks: "https://linkedin.com/school/deccan-sound",
    requirements: "Working re-recording mixers as guest faculty",
    description: "Audio-focused institute training sound designers and music producers.",
    establishedYear: 2018,
    verificationStatus: true,
  },
  {
    instituteName: "Eastern Film & Television Academy",
    email: "office@efta.edu.in",
    website: "https://efta.edu.in",
    location: "Kolkata, West Bengal",
    contactPerson: "Dr. Subhankar Ghosh",
    designation: "Director",
    studentCount: 640,
    branchCount: 2,
    coursesOffered: "Direction, Cinematography, Editing, Production Design, Acting",
    conductsWorkshops: true,
    industryExposure: "occasionally",
    yearsInEducation: 21,
    supportNeeded: "Regional industry linkage, placement drives",
    activeServices: "Annual film festival, Equipment library",
    verificationUrl: "https://efta.edu.in/recognition",
    servicesRequired: "Cross-regional collaboration projects",
    officialLinks: "https://linkedin.com/school/efta-kolkata",
    requirements: "Visiting directors and DoPs",
    description: "Long-standing academy with strong roots in Bengali and eastern cinema.",
    establishedYear: 2004,
    verificationStatus: true,
  },
  {
    instituteName: "Skyward Institute of Media Studies",
    email: "info@skywardmedia.in",
    website: "https://skywardmedia.in",
    location: "Bengaluru, Karnataka",
    contactPerson: "Ms. Reema Nambiar",
    designation: "Academic Coordinator",
    studentCount: 510,
    branchCount: 1,
    coursesOffered: "Media Studies, Content Creation, Advertising, Digital Filmmaking",
    conductsWorkshops: true,
    industryExposure: "regularly",
    yearsInEducation: 6,
    supportNeeded: "Brand collaborations, live client briefs",
    activeServices: "In-house production agency, Internship portal",
    verificationUrl: "https://skywardmedia.in/accreditation",
    servicesRequired: "Guest sessions from ad agencies and OTT teams",
    officialLinks: "https://linkedin.com/school/skyward-media",
    requirements: "Industry jury for capstone projects",
    description: "Contemporary media school bridging advertising, OTT and digital content.",
    establishedYear: 2019,
    verificationStatus: false,
  },
];

const INSTITUTE_EMAILS = INSTITUTES.map((i) => i.email);

async function up() {
  const { User, Institute, TalentId, sequelize } = db;

  await sequelize.transaction(async (transaction) => {
    for (const entry of INSTITUTES) {
      // 1. users
      const [user, userCreated] = await User.findOrCreate({
        where: { email: entry.email },
        defaults: {
          email: entry.email,
          phone: null,
          role: "institute",
          status: "approved",
        },
        transaction,
      });

      // 2. institutes
      const [institute, instituteCreated] = await Institute.findOrCreate({
        where: { userId: user.id },
        defaults: {
          userId: user.id,
          instituteName: entry.instituteName,
          email: entry.email,
          website: entry.website || null,
          location: entry.location || null,
          contactPerson: entry.contactPerson,
          designation: entry.designation || null,
          studentCount: entry.studentCount ?? null,
          branchCount: entry.branchCount ?? null,
          coursesOffered: entry.coursesOffered || null,
          conductsWorkshops: !!entry.conductsWorkshops,
          industryExposure: entry.industryExposure || null,
          yearsInEducation: entry.yearsInEducation ?? null,
          supportNeeded: entry.supportNeeded || null,
          activeServices: entry.activeServices || null,
          verificationUrl: entry.verificationUrl || null,
          servicesRequired: entry.servicesRequired || null,
          officialLinks: entry.officialLinks || null,
          requirements: entry.requirements || null,
          verificationStatus: !!entry.verificationStatus,
          avatarUrl: null,
          bannerUrl: null,
          description: entry.description || null,
          establishedYear: entry.establishedYear ?? null,
        },
        transaction,
      });

      // 3. talent_ids  (same format as auth.controller.js)
      const talentCode = `AUI-INST-${String(user.id).padStart(6, "0")}`;
      const [talent, talentCreated] = await TalentId.findOrCreate({
        where: { userId: user.id },
        defaults: { userId: user.id, talentCode },
        transaction,
      });

      console.log(
        `user#${user.id}${userCreated ? "*" : " "}  institute#${institute.id}${instituteCreated ? "*" : " "}  ${talent.talentCode}${talentCreated ? "*" : " "}  ${entry.instituteName}`
      );
    }
  });

  console.log(`\nDone. ${INSTITUTES.length} demo institutes ensured (users + institutes + talent_ids).`);
}

async function down() {
  const { User, Institute, TalentId, sequelize } = db;

  await sequelize.transaction(async (transaction) => {
    const users = await User.findAll({
      where: { email: INSTITUTE_EMAILS },
      transaction,
    });
    const userIds = users.map((u) => u.id);

    const removedTalent = await TalentId.destroy({ where: { userId: userIds }, transaction });
    const removedInstitutes = await Institute.destroy({ where: { userId: userIds }, transaction });
    const removedUsers = await User.destroy({ where: { id: userIds }, transaction });

    console.log(
      `Removed ${removedTalent} talent_ids, ${removedInstitutes} institutes, ${removedUsers} users.`
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
