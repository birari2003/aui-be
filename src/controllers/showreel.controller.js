const { Showreel } = require("../../models");
const asyncHandler = require("../utils/async-handler");

const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start of text
    .replace(/-+$/, "");            // Trim - from end of text
};

const generateUniqueSlug = async (title, artistName) => {
  const base = slugify(title || artistName || "showcase");
  let slug = base;
  let counter = 1;
  while (await Showreel.findOne({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
};

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

  const slug = await generateUniqueSlug(title, artistName);

  const showreel = await Showreel.create({
    videoUrl: finalVideoUrl,
    artistName,
    description,
    publicUrl,
    category,
    longMovieUrl,
    title,
    topic,
    slug
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

// Public: Get single showreel by ID or Slug
const getShowreel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let showreel;
  
  // 1. Try finding by PK if it's an integer
  if (/^\d+$/.test(id)) {
    showreel = await Showreel.findByPk(id);
  }

  // 2. Try finding by slug
  if (!showreel) {
    showreel = await Showreel.findOne({ where: { slug: id } });
  }

  // 3. Fallback: Search all showreels by slugifying their title/artistName
  if (!showreel) {
    const all = await Showreel.findAll();
    showreel = all.find(r => slugify(r.title || r.artistName || '') === id);
    if (showreel) {
      // Self-heal: populate slug field for existing database records!
      showreel.slug = id;
      await showreel.save();
    }
  }

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

  let slug = showreel.slug;
  if (title && title !== showreel.title) {
    slug = await generateUniqueSlug(title, artistName);
  }

  await showreel.update({
    videoUrl: finalVideoUrl,
    artistName,
    description,
    publicUrl,
    category,
    longMovieUrl,
    title,
    topic,
    slug
  });

  return res.status(200).json({
    success: true,
    message: "Showreel updated successfully",
    data: showreel
  });
});

// Serve dynamic HTML with Open Graph meta tags for crawlers / showcase sharing
const serveShowcaseHtml = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let showreel;
  if (/^\d+$/.test(id)) {
    showreel = await Showreel.findByPk(id);
  }
  if (!showreel) {
    showreel = await Showreel.findOne({ where: { slug: id } });
  }
  if (!showreel) {
    const all = await Showreel.findAll();
    showreel = all.find(r => slugify(r.title || r.artistName || "") === id);
    if (showreel) {
      showreel.slug = id;
      await showreel.save();
    }
  }

  const path = require("path");
  const fs = require("fs");

  // Path to the frontend's build index.html
  const indexPath = path.join(__dirname, "../../../aui-fe/dist/index.html");
  let html;
  
  try {
    html = fs.readFileSync(indexPath, "utf8");
  } catch (err) {
    try {
      const srcIndexPath = path.join(__dirname, "../../../aui-fe/index.html");
      html = fs.readFileSync(srcIndexPath, "utf8");
    } catch (e) {
      return res.status(500).send("Index template not found");
    }
  }

  if (showreel) {
    const title = showreel.title || `${showreel.artistName}'s Showcase`;
    const description = showreel.description || `Watch ${showreel.artistName}'s showcase on AUI.`;
    const url = `https://auitalent.com/showcase/${showreel.slug || id}`;
    
    // Resolve thumbnail
    let image = "https://auitalent.com/assets/logo_blck.png";
    if (showreel.videoUrl) {
      const getYouTubeId = (url) => {
        const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]{11}).*/;
        const match = url.match(regExp);
        return (match && match[1].length === 11) ? match[1] : '';
      };
      const getVimeoId = (url) => {
        const standardMatch = url.match(
          /(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|ondemand\/[^/]+\/|showcase\/\d+\/video\/)(\d+)(?:$|\/|\?)/
        );
        if (standardMatch) return standardMatch[1];
        const simpleMatch = url.match(/vimeo\.com\/(\d+)(?:$|\/|\?)/);
        if (simpleMatch) return simpleMatch[1];
        return '';
      };

      const ytId = getYouTubeId(showreel.videoUrl);
      if (ytId) {
        image = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      } else {
        const vimeoId = getVimeoId(showreel.videoUrl);
        if (vimeoId) {
          try {
            const response = await fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`);
            const data = await response.json();
            if (data && data[0] && data[0].thumbnail_large) {
              image = data[0].thumbnail_large;
            }
          } catch (e) {
            console.error("Failed to fetch Vimeo thumbnail on server:", e.message);
          }
        }
      }
    }

    // Replace default index.html metadata tags
    html = html
      .replace(
        /<title>.*?<\/title>/g,
        `<title>${title} | AUI</title>`
      )
      .replace(
        /<meta name="description" content=".*?" \/>/g,
        `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`
      )
      .replace(
        /<meta property="og:title" content=".*?" \/>/g,
        `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`
      )
      .replace(
        /<meta property="og:description" content=".*?" \/>/g,
        `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`
      )
      .replace(
        /<meta property="og:url" content=".*?" \/>/g,
        `<meta property="og:url" content="${url}" />`
      )
      .replace(
        /<meta property="og:type" content=".*?" \/>/g,
        `<meta property="og:type" content="video.other" />`
      )
      .replace(
        /<meta name="twitter:title" content=".*?" \/>/g,
        `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />`
      )
      .replace(
        /<meta name="twitter:description" content=".*?" \/>/g,
        `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />`
      );

    // Inject Image tags if resolved
    if (image) {
      const imageTags = `\n    <meta property="og:image" content="${image}" />\n    <meta name="twitter:image" content="${image}" />`;
      html = html.replace('</head>', `${imageTags}\n  </head>`);
    }
  }

  res.send(html);
});

module.exports = {
  createShowreel,
  listShowreels,
  getShowreel,
  deleteShowreel,
  updateShowreel,
  serveShowcaseHtml
};
