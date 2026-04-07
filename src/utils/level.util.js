function getProfessionalLevel(experienceYears) {
  const years = Number(experienceYears || 0);

  if (years <= 0) return "fresher";
  if (years >= 1 && years <= 2) return "junior";
  if (years >= 3 && years <= 6) return "mid";
  return "senior";
}

module.exports = {
  getProfessionalLevel,
};
