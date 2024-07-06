const express = require("express");
const { getAllCategories, createCategory, getCategoryById, updateCategoryById, deleteCategoryById, getCategoryExpenses } = require("../controller/catagory.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getAllCategories);
router.post("/",  createCategory);
router.get("/:id", getCategoryById);
router.put("/:id", isAuthenticated, updateCategoryById);
router.delete("/:id", isAuthenticated, deleteCategoryById);
router.get("/:categoryId/expenses", getCategoryExpenses); 

module.exports = router;
