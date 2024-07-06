

exports.createExpense = async (req, res) => {
  try {
    const { userId, categoryId, expense_amount, expense_description, expense_date } = req.body;
    
    const expense = await Expense.create({ userId, categoryId, expense_amount, expense_description, expense_date });
    
    // Update user's total_expense_amount
    const user = await User.findByPk(userId);
    user.total_expense_amount += expense.expense_amount;
    await user.save();
    
    res.status(201).json(expense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { expense_amount, expense_description, expense_date } = req.body;
    
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const user = await User.findByPk(expense.userId);
    
    // Update user's total_expense_amount
    user.total_expense_amount = user.total_expense_amount - expense.expense_amount + expense_amount;
    await user.save();

    expense.expense_amount = expense_amount;
    expense.expense_description = expense_description;
    expense.expense_date = expense_date;

    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const user = await User.findByPk(expense.userId);
    
    // Update user's total_expense_amount
    user.total_expense_amount -= expense.expense_amount;
    await user.save();

    await expense.destroy();
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// transaction

const Expense = require('../models/expenses.smodel');
const User = require('../models/user.smodel');
const Category = require('../models/category.smodel');
const { sequelize } = require("../connections/db.sql.connection");

exports.createExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, categoryId, expense_amount, expense_description, expense_date } = req.body;
    
    const expense = await Expense.create({ userId, categoryId, expense_amount, expense_description, expense_date }, { transaction });
    
    const user = await User.findByPk(userId);
    user.total_expense_amount += expense.expense_amount;
    await user.save({ transaction });
    
    await transaction.commit();
    res.status(201).json(expense);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { expense_amount, expense_description, expense_date } = req.body;
    
    const expense = await Expense.findByPk(id);
    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    const user = await User.findByPk(expense.userId);
    
    // Update user's total_expense_amount
    user.total_expense_amount = user.total_expense_amount - expense.expense_amount + expense_amount;
    await user.save(
      { transaction }
    );

    expense.expense_amount = expense_amount;
    expense.expense_description = expense_description;
    expense.expense_date = expense_date;

    await expense.save(
      { transaction }
    );
    
    await transaction.commit();
    res.status(200).json(expense);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    const user = await User.findByPk(expense.userId);
    
    // Update user's total_expense_amount
    user.total_expense_amount -= expense.expense_amount;
    await user.save({ transaction });

    await expense.destroy({ transaction });

    await transaction.commit();
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

