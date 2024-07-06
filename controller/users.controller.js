const User = require("../model/user.smodel");
const Expense = require("../model/expenses.smodel");
const Category = require("../model/category.smodel");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.user_id }, "crt_k", {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutUser = (res) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserCategories = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      include: [Category],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.Categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserExpensesByDateRange = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    const expenses = await Expense.findAll({
      where: {
        UserUserId: userId,
        expense_date: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      include: [Category],
    });

    if (!expenses.length) {
      return res.status(404).json({
        userId,
        message: "No expenses found for the given date range",
      });
    }
    res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};



exports.getUserExpenses = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Expense,
          include: [Category],
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalExpensesOfUser= await Expense.count({
      where: { userId },
    });

    const totalPages = Math.ceil(totalExpensesOfUser / limit);

    const cpage = parseInt(page);

    const nextPage = cpage < totalPages ? cpage + 1 : null;

    const prevPage = cpage > 1 ? cpage - 1 : null;

    res.status(200).json({
      totalPages: totalPages,
      currentPage: cpage,
      totalExpensesOfUser: totalExpensesOfUser,
      totalAmount: user.total_expense_amount,
      expenses: user.Expenses,
      nextPage: nextPage,
      prevPage: prevPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
