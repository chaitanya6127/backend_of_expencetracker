const { DataTypes } = require("sequelize");
const { sequelize } = require("../connections/db.sql.connection");
const User = require("./user.smodel");

const Category = sequelize.define("Category", {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});


module.exports = Category;
