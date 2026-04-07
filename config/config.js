require("dotenv").config();

const common = {
  dialect: "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  logging: false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
};

module.exports = {
  development: {
    ...common,
    database: process.env.DB_NAME || "aui",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  },
  test: {
    ...common,
    database: process.env.DB_NAME_TEST || "aui_test",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  },
  production: {
    ...common,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};