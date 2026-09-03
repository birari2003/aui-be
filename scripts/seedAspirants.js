"use strict";

/**
 * Demo seeder for the `aspirants` table (~92 entries, deterministically generated).
 *
 * For each generated entry it will:
 *   1. Find-or-create a `users` row (role = "aspirant", status = "approved")
 *   2. Find-or-create the matching `aspirants` row (keyed by userId)
 *
 * If an `educationTitle` matches a row in `Educations`, the aspirant's
 * `educationId` is linked automatically.
 *
 * Generation is deterministic (fixed name pools + index-based rotation), so
 * re-running the script never creates duplicates and never changes existing rows.
 *
 * Usage:
 *   node scripts/seedAspirants.js          # insert demo data
 *   node scripts/seedAspirants.js --undo   # remove the demo data
 */

const db = require("../models");

const COUNT = 92;

const FIRST_NAMES = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna",
  "Ishaan", "Kabir", "Ansh", "Dhruv", "Rohan", "Aryan", "Kiaan", "Rudra",
  "Karan", "Yash", "Neel", "Om", "Parth", "Shaurya", "Veer", "Arnav",
  "Ananya", "Diya", "Aadhya", "Isha", "Sara", "Myra", "Anika", "Navya",
  "Kiara", "Riya", "Meera", "Aarohi", "Prisha", "Ira", "Tara", "Nitya",
  "Saanvi", "Pari", "Avni", "Siya", "Ishita", "Trisha", "Kavya", "Nisha",
];

const LAST_NAMES = [
  "Sharma", "Verma", "Mehta", "Khan", "Nair", "Iyer", "Singh", "Joshi",
  "Gupta", "Reddy", "Patel", "Das", "Bose", "Chopra", "Kapoor", "Malhotra",
  "Rao", "Menon", "Pillai", "Bhat", "Shetty", "Kulkarni", "Deshpande", "Naidu",
  "Ahuja", "Bakshi", "Chauhan", "Dixit", "Ghosh", "Jain", "Kaur", "Lal",
];

const EMAIL_DOMAINS = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "protonmail.com"];

const LOCATIONS = [
  { state: "Maharashtra", district: "Mumbai Suburban", city: "Mumbai" },
  { state: "Maharashtra", district: "Pune", city: "Pune" },
  { state: "Delhi", district: "New Delhi", city: "New Delhi" },
  { state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru" },
  { state: "Telangana", district: "Hyderabad", city: "Hyderabad" },
  { state: "Tamil Nadu", district: "Chennai", city: "Chennai" },
  { state: "West Bengal", district: "Kolkata", city: "Kolkata" },
  { state: "Kerala", district: "Ernakulam", city: "Kochi" },
  { state: "Kerala", district: "Thiruvananthapuram", city: "Thiruvananthapuram" },
  { state: "Gujarat", district: "Ahmedabad", city: "Ahmedabad" },
  { state: "Rajasthan", district: "Jaipur", city: "Jaipur" },
  { state: "Punjab", district: "Ludhiana", city: "Ludhiana" },
  { state: "Uttar Pradesh", district: "Lucknow", city: "Lucknow" },
  { state: "Uttar Pradesh", district: "Gautam Buddha Nagar", city: "Noida" },
  { state: "Madhya Pradesh", district: "Bhopal", city: "Bhopal" },
  { state: "Bihar", district: "Patna", city: "Patna" },
  { state: "Assam", district: "Kamrup Metropolitan", city: "Guwahati" },
  { state: "Chandigarh", district: "Chandigarh", city: "Chandigarh" },
];

const COLLEGES = [
  "Film and Television Institute of India (FTII)",
  "Satyajit Ray Film & Television Institute",
  "Whistling Woods International",
  "L.V. Prasad Film & TV Academy",
  "AJK Mass Communication Research Centre, Jamia Millia Islamia",
  "Annapurna International School of Film and Media",
  "KR Narayanan National Institute of Visual Science and Arts",
  "Srishti Manipal Institute of Art, Design and Technology",
  "Symbiosis Institute of Media and Communication",
  "NID Ahmedabad - Film & Video Communication",
  "Xavier Institute of Communications, Mumbai",
  "MIT School of Film and Television, Pune",
  "Amity School of Communication",
  "Chennai Film School",
  "Digital Academy - The Film School, Mumbai",
];

const EDUCATION_TITLES = [
  "Bachelor of Arts in Filmmaking",
  "Master of Arts in Mass Communication",
  "Diploma in Editing",
  "Bachelor of Science in Sound Design",
  "Bachelor of Arts in Screenwriting",
  "Diploma in Cinematography",
  "Bachelor of Arts in Acting",
  "Master of Design in Film & Video",
  "Diploma in Direction",
  "Bachelor of Arts in Animation",
  "Diploma in VFX and Motion Graphics",
  "Bachelor of Arts in Media Studies",
];

const DEPARTMENTS = [
  "Direction", "Cinematography", "Editing", "Sound", "Writing", "Acting",
  "Art Direction", "Production", "VFX", "Animation", "Costume Design", "Casting",
];

const GENDERS = ["male", "female", "female", "male", "other"];

// Deterministic per-index pick
const pick = (arr, i) => arr[i % arr.length];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function buildEntry(i) {
  const first = pick(FIRST_NAMES, i);
  const last = pick(LAST_NAMES, i * 7 + 3);
  const fullName = `${first} ${last}`;

  // realistic-looking, but clearly non-colliding demo addresses
  const emailUser = `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g, "");
  const emailSuffix = 100 + i; // keeps them unique + stable
  const email = `${emailUser}${emailSuffix}@${pick(EMAIL_DOMAINS, i * 3 + 1)}`;

  const phone = `+91 ${70 + (i % 30)}${pad2(i % 100)}${pad2((i * 3) % 100)} ${pad2((i * 7) % 100)}${pad2((i * 11) % 100)}`;

  const loc = pick(LOCATIONS, i * 5 + 2);
  const gradYear = 2019 + (i % 8); // 2019..2026
  const birthYear = 1997 + (i % 8); // 1997..2004
  const dob = `${birthYear}-${pad2(1 + (i % 12))}-${pad2(1 + (i % 27))}`;

  return {
    fullName,
    email,
    phone,
    dob,
    gender: pick(GENDERS, i),
    country: "India",
    state: loc.state,
    district: loc.district,
    city: loc.city,
    collegeName: pick(COLLEGES, i * 2 + 1),
    educationTitle: pick(EDUCATION_TITLES, i * 4 + 2),
    year: String(gradYear),
    interestedDepartment: pick(DEPARTMENTS, i * 3),
    verificationStatus: i % 3 !== 0, // ~2/3 verified
  };
}

const DEMO_ASPIRANTS = Array.from({ length: COUNT }, (_, i) => buildEntry(i));
const DEMO_EMAILS = DEMO_ASPIRANTS.map((a) => a.email);

async function up() {
  const { User, Aspirant, Education, TalentId, sequelize } = db;

  await sequelize.transaction(async (transaction) => {
    for (const entry of DEMO_ASPIRANTS) {
      const [user, userCreated] = await User.findOrCreate({
        where: { email: entry.email },
        defaults: {
          email: entry.email,
          phone: entry.phone,
          role: "aspirant",
          status: "approved",
        },
        transaction,
      });

      let educationId = null;
      const educationTitle = entry.educationTitle || null;
      if (educationTitle && Education) {
        const edu = await Education.findOne({
          where: { title: educationTitle },
          transaction,
        });
        if (edu) educationId = edu.id;
      }

      const [aspirant, created] = await Aspirant.findOrCreate({
        where: { userId: user.id },
        defaults: {
          userId: user.id,
          fullName: entry.fullName,
          email: entry.email,
          phone: entry.phone || null,
          photoUrl: null,
          dob: entry.dob || null,
          gender: entry.gender || null,
          country: entry.country || null,
          state: entry.state || null,
          district: entry.district || null,
          city: entry.city || null,
          collegeName: entry.collegeName || null,
          educationId,
          educationTitle,
          year: entry.year || null,
          interestedDepartment: entry.interestedDepartment || null,
          verificationStatus: !!entry.verificationStatus,
        },
        transaction,
      });

      // talent_ids  (same format as auth.controller.js)
      const talentCode = `AUI-ASP-${String(user.id).padStart(6, "0")}`;
      await TalentId.findOrCreate({
        where: { userId: user.id },
        defaults: { userId: user.id, talentCode },
        transaction,
      });

      console.log(
        `${created ? "created" : "exists "}  user#${user.id}${userCreated ? "*" : " "}  aspirant#${aspirant.id}  ${talentCode}  ${entry.fullName}`
      );
    }
  });

  console.log(`\nDone. ${DEMO_ASPIRANTS.length} demo aspirants ensured.`);
}

async function down() {
  const { User, Aspirant, TalentId, sequelize } = db;

  await sequelize.transaction(async (transaction) => {
    const users = await User.findAll({
      where: { email: DEMO_EMAILS },
      transaction,
    });
    const userIds = users.map((u) => u.id);

    const removedTalent = await TalentId.destroy({ where: { userId: userIds }, transaction });
    const removedAspirants = await Aspirant.destroy({ where: { userId: userIds }, transaction });
    const removedUsers = await User.destroy({ where: { id: userIds }, transaction });

    console.log(
      `Removed ${removedTalent} talent_ids, ${removedAspirants} aspirants, ${removedUsers} users.`
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
