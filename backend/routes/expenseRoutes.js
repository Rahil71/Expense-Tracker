import express from "express";
import { addExpense,getExpense,deleteExpense,updateExpense,analyzeData } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router();

router.post('/',protect,addExpense);
router.get('/',protect,getExpense);
router.delete('/:id',protect,deleteExpense);
router.patch('/:id',protect,updateExpense);
router.post('/analyze',protect,analyzeData);

export default router;