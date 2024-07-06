const Category = require('../model/category.smodel');

exports.createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    const newCategory = await Category.create({ category_name });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategoryById = async (req, res) => {
  try {
    const { category_name } = req.body;

    const category = await Category.findByPk(req.params.id);
    if (category) {
      category.category_name = category_name || category.category_name;

      await category.save();

      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      res.status(200).json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCategoryExpenses = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findByPk(categoryId, {
        include: [Expense]
      });
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.status(200).json(category.Expenses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };