const jwt = require("jsonwebtoken");
const { User } = require("../../models");

async function protect(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      include: [{ model: require("../../models").TalentId, as: 'talentId' }]
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: invalid user" });
    }

    if (user.status !== "approved" && user.role !== "admin") {
      return res.status(403).json({ message: "Access blocked until admin approval" });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
}

async function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (user && user.status === "approved") {
      req.user = user;
    } else {
      req.user = null;
    }
  } catch (_error) {
    req.user = null;
  }

  return next();
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role access" });
    }
    return next();
  };
}

function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
}

module.exports = {
  protect,
  optionalAuth,
  authorizeRoles,
  authorizeAdmin,
};
