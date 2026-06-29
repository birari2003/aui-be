const { Showreel } = require("../../models");
const asyncHandler = require("../utils/async-handler");

// Admin: Create Showreel (handles video link or file upload)
const createShowreel = asyncHandler(async (req, res) => {
  const { artistName, description, publicUrl, videoUrl, category, longMovieUrl, title, topic } = req.body;

  let finalVideoUrl = videoUrl;
  
  // If a file is uploaded, use its path
  if (req.file) {
    finalVideoUrl = req.file.path;
  }

  if (!finalVideoUrl) {
    return res.status(400).json({ success: false, message: "Video (file or link) is required." });
  }

  if (!artistName) {
    return res.status(400).json({ success: false, message: "Artist/Studio/Professional name is required." });
  }

  if (!category) {
    return res.status(400).json({ success: false, message: "Category is required." });
  }

  const showreel = await Showreel.create({
    videoUrl: finalVideoUrl,
    artistName,
    description,
    publicUrl,
    category,
    longMovieUrl,
    title,
    topic
  });

  return res.status(201).json({
    success: true,
    message: "Showreel added successfully",
    data: showreel
  });
});

// Public / Admin: List all showreels
const listShowreels = asyncHandler(async (req, res) => {
  const showreels = await Showreel.findAll({
    order: [["created_at", "DESC"]]
  });

  return res.status(200).json({
    success: true,
    data: showreels
  });
});

// Public: Get single showreel by ID
const getShowreel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const showreel = await Showreel.findByPk(id);
  if (!showreel) {
    return res.status(404).json({ success: false, message: "Showreel not found" });
  }

  return res.status(200).json({
    success: true,
    data: showreel
  });
});

// Admin: Delete showreel
const deleteShowreel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const showreel = await Showreel.findByPk(id);
  if (!showreel) {
    return res.status(404).json({ success: false, message: "Showreel not found" });
  }

  await showreel.destroy();

  return res.status(200).json({
    success: true,
    message: "Showreel deleted successfully"
  });
});

// Admin: Update showreel
const updateShowreel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { artistName, description, publicUrl, videoUrl, category, longMovieUrl, title, topic } = req.body;

  const showreel = await Showreel.findByPk(id);
  if (!showreel) {
    return res.status(404).json({ success: false, message: "Showreel not found" });
  }

  let finalVideoUrl = videoUrl;
  
  // If a new file is uploaded, use its path
  if (req.file) {
    finalVideoUrl = req.file.path;
  }

  if (!finalVideoUrl) {
    return res.status(400).json({ success: false, message: "Video (file or link) is required." });
  }

  if (!artistName) {
    return res.status(400).json({ success: false, message: "Artist/Studio/Professional name is required." });
  }

  if (!category) {
    return res.status(400).json({ success: false, message: "Category is required." });
  }

  await showreel.update({
    videoUrl: finalVideoUrl,
    artistName,
    description,
    publicUrl,
    category,
    longMovieUrl,
    title,
    topic
  });

  return res.status(200).json({
    success: true,
    message: "Showreel updated successfully",
    data: showreel
  });
});

module.exports = {
  createShowreel,
  listShowreels,
  getShowreel,
  deleteShowreel,
  updateShowreel
};
