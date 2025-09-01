import Expense from "../models/Expense.js";
import Category from "../models/Category.js";
import { pubsub, EVENTS } from "../../graphql/resolvers.js";

export const listExpenses = async (req, res) => {
  const { from, to, categoryId } = req.query;
  const query = { user: req.user.id };

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  if (categoryId) query.category = categoryId;

  try {
    const expenses = await Expense.find(query)
      .populate("category", "name")
      .sort({ date: -1 });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.json({ items: expenses, total });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createExpense = async (req, res) => {
  const { amount, date, categoryId, note } = req.body || {};
  if (amount == null || !categoryId) return res.status(400).json({ message: "Amount and categoryId required" });

  try {
    const category = await Category.findOne({ _id: categoryId, user: req.user.id });
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Calculate total spent in this category
    const totalSpent = await Expense.aggregate([
      { $match: { user: req.user.id, category: category._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const spentSoFar = totalSpent[0]?.total || 0;

    if (category.limit > 0 && spentSoFar + amount > category.limit) {
      return res.status(400).json({
        message: `Spending limit exceeded for category "${category.name}". Limit: ${category.limit}`
      });
    }

    const expense = await Expense.create({
      user: req.user.id,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      category: category._id,
      note: note || ""
    });

    const populated = await expense.populate("category", "name");

    // Publish subscription event
    pubsub.publish(EVENTS.EXPENSE_CREATED, {
      expenseCreated: populated,
      userId: String(req.user.id)
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, date, categoryId, note } = req.body || {};
  const update = {};

  if (amount != null) update.amount = Number(amount);
  if (date) update.date = new Date(date);
  if (note != null) update.note = note;
  if (categoryId) update.category = categoryId;

  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: update },
      { new: true }
    ).populate("category", "name");

    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    await Expense.deleteOne({ _id: id, user: req.user.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
