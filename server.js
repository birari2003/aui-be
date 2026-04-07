require("dotenv").config();
const app = require("./src/app");
const db = require("./models");

const PORT = Number(process.env.PORT || 5000);

async function bootstrap() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection established.");

    app.listen(PORT, () => {
      console.log(`AUI backend server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

bootstrap();
