const express = require("express");
const { getAllExpenses, createExpense, getExpenseById, updateExpenseById, deleteExpenseById } = require("../controller/expenses.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getAllExpenses);
router.post("/", createExpense);
router.get("/:id", getExpenseById);
router.put("/:id", isAuthenticated, updateExpenseById);
router.delete("/:id", isAuthenticated, deleteExpenseById);

module.exports = router;
