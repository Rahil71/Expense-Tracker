import express from "express";
import { addExpense,getExpense,deleteExpense,updateExpense,analyzeData,expensePDF,deleteAllExpenses,updateBudgetLimit } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router=express.Router();

router.post('/',protect,upload.single("receipt"),addExpense);
router.get('/',protect,getExpense);
router.post('/analyze',protect,analyzeData);
router.get('/exportpdf',protect,expensePDF);
router.delete("/delete-all", protect, deleteAllExpenses);
router.put("/update-budget-limit", protect, updateBudgetLimit);
router.delete('/:id',protect,deleteExpense);
router.patch('/:id',protect,updateExpense);

export default router;