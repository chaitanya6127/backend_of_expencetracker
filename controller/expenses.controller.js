const Expense = require("../model/expenses.smodel");
const User = require("../model/user.smodel");
const Category = require("../model/category.smodel");
const { sequelize } = require("../connections/db.sql.connection");
const { Transaction } = require('sequelize');

exports.createExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      userId,
      categoryId,
      expense_amount,
      expense_description,
      expense_date,
    } = req.body;

    const expense = await Expense.create(
      { userId, categoryId, expense_amount, expense_description, expense_date },
      {
        transaction,
      }
    );

    const user = await User.findByPk(userId);
    user.total_expense_amount =
      user.total_expense_amount + expense.expense_amount;

    console.log(user.total_expense_amount);
    await user.save({
      transaction,
    });
    await transaction.commit();
    res.status(201).json(expense);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateExpenseById = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { expense_amount, expense_description, expense_date, categoryId } =
      req.body;

    const expense = await Expense.findByPk(id);
    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    const user = await User.findByPk(expense.userId);

    user.total_expense_amount =
      user.total_expense_amount - expense.expense_amount + expense_amount;
    await user.save({
      transaction,
    });

    expense.expense_amount = expense_amount;
    expense.expense_description = expense_description;
    expense.expense_date = expense_date;
    expense.categoryId = categoryId;

    await expense.save({
      transaction,
    });

    await transaction.commit();
    res.status(200).json(expense);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.updateExpenseById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { expense_amount, expense_description, expense_date, categoryId } = req.body;

//     const expense = await Expense.findByPk(id);
//     if (!expense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }
//     console.log("In Update");
//     console.log(expense);

//     if (expense_amount !== undefined) {
//       expense.expense_amount = expense_amount;
//     }
//     if (expense_description !== undefined) {
//       expense.expense_description = expense_description;
//     }
//     if (expense_date !== undefined) {
//       expense.expense_date = expense_date;
//     }
//     if (categoryId !== undefined) {
//       expense.categoryId = categoryId;
//     }

//     await expense.save();

//     res.status(200).json(expense);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.deleteExpenseById = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    const user = await User.findByPk(expense.userId);

    user.total_expense_amount -= expense.expense_amount;
    await user.save({
      transaction,
    });

    await expense.destroy({
      transaction,
    });

    await transaction.commit();
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
