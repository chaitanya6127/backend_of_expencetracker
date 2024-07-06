const { DataTypes } = require("sequelize");
const { sequelize } = require("../connections/db.sql.connection");
const User = require("./user.smodel");
const Category = require("./category.smodel");

const Expense = sequelize.define("Expense", {
  expense_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expense_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  expense_description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expense_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});



User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

Category.hasMany(Expense, { foreignKey: "categoryId" });
Expense.belongsTo(Category, { foreignKey: "categoryId" });

// Expense.afterCreate(async (expense) => {
//   const user = await User.findByPk(expense.userId);
//   await user.increment("total_expense_amount", { by: expense.expense_amount });
// });

// Expense.afterDestroy(async (expense) => {
//   const user = await User.findByPk(expense.userId);
//   await user.decrement("total_expense_amount", { by: expense.expense_amount });
// });

// Expense.afterUpdate(async (expense) => {
//   const user = await User.findByPk(expense.userId);
//   const previousAmount = expense.expense_amount;
//   const newAmount = expense.expense_amount;
//   const difference = newAmount - previousAmount;
//   await user.increment("total_expense_amount", { by: difference });
// });

module.exports = Expense;
