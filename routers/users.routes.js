const express = require("express");
const { getAllUsers, registerUser, loginUser, logoutUser, getUserExpenses, getUserCategories , getUserExpensesByDateRange } = require("../controller/users.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/logout', isAuthenticated, logoutUser);

router.get("/", getAllUsers);

router.get("/:userId/expenses", getUserExpenses); 

router.get("/expenses/:userId/daterange/", getUserExpensesByDateRange);


module.exports = router;
