import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listCategories, createCategory, deleteCategory, updateCategory} from "../controllers/categories.controller.js";

const router = Router();

// All category routes require authentication
router.use(auth);

router.get("/", listCategories);       // Get all categories
router.post("/", createCategory);      // Create new category
router.delete("/:id", deleteCategory); // Delete category by ID
router.put("/:id", updateCategory);

export default router;
