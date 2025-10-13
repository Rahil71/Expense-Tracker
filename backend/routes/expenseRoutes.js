import express from "express";
import { addExpense,getExpense,deleteExpense,updateExpense,analyzeData,expensePDF } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router=express.Router();

router.post('/',protect,upload.single("receipt"),addExpense);
router.get('/',protect,getExpense);
router.delete('/:id',protect,deleteExpense);
router.patch('/:id',protect,updateExpense);
router.post('/analyze',protect,analyzeData);
router.get('/exportpdf',protect,expensePDF);

export default router;