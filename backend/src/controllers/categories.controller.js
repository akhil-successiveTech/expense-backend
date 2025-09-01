import Category from "../models/Category.js";

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createCategory = async (req, res) => {
  const { name, limit } = req.body || {};
  if (!name) return res.status(400).json({ message: "Category name required" });

  try {
    const category = await Category.create({
      user: req.user.id,
      name: name.trim(),
      limit: limit || 0
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(409).json({ message: "Category already exists" });
  }
};


export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await Category.deleteOne({ _id: id, user: req.user.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, limit } = req.body || {};

  try {
    const category = await Category.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: { name, limit } },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};