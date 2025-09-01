import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listExpenses, createExpense, updateExpense, deleteExpense } from "../controllers/expenses.controller.js";

const router = Router();

router.use(auth);
router.get("/", listExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
