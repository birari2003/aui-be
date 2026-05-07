require("dotenv").config();
const app = require("./src/app");
const db = require("./models");

const PORT = Number(process.env.PORT || 5000);

db.sequelize.authenticate()
  .then(() => {
    console.log("Database connection established.");
    app.listen(PORT, () => {
      console.log(`AUI backend server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Keep event loop alive
setInterval(() => {}, 1000 * 60 * 60);
