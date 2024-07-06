const Expense = require("../model/expenses.smodel");

exports.createExpense = async (req, res) => {
  const {
    expense_amount,
    expense_description,
    expense_date,
    userId,
    categoryId,
  } = req.body;
  try {
    const expense = await Expense.create({
      expense_amount,
      expense_description,
      expense_date,
      userId,
      categoryId,
    });
    res.status(201).json(expense);
  } catch (error) {
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

exports.updateExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { expense_amount, expense_description, expense_date, categoryId } = req.body;

    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    console.log("In Update");
    console.log(expense);

    if (expense_amount !== undefined) {
      expense.expense_amount = expense_amount;
    }
    if (expense_description !== undefined) {
      expense.expense_description = expense_description;
    }
    if (expense_date !== undefined) {
      expense.expense_date = expense_date;
    }
    if (categoryId !== undefined) {
      expense.categoryId = categoryId;
    }

    await expense.save();

    res.status(200).json(expense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (expense) {
      await expense.destroy();
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
