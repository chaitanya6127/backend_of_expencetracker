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


  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Expense, { foreignKey: 'categoryId' });
Expense.belongsTo(Category, { foreignKey: 'categoryId' });

// Expense.afterSave(async (expense) => {
//   const userId = expense.UserUserId;
//   console.log(userId);

//   const totalAmount = await Expense.sum("expense_amount", {
//     where: { userId },
//   });
//   await User.update(
//     { total_expense_amount: totalAmount },
//     {
//       where: { userId },
//     }
//   );
// });

module.exports = Expense;
