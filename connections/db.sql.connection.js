const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("expenses", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

async function connectToMysql() {
  try {
    await sequelize.authenticate();
    console.log("Connected to Mysql successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
async function syncToDb() {
  try {
    await sequelize.sync({});

    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = { connectToMysql, sequelize , syncToDb };
