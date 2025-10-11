import Expense from "../models/Expense.js";
import User from "../models/User.js";

export const addExpense=async(req,res)=>{
    try{
        const {title,amount,category,date,notes}=req.body;
        const expense=new Expense({
            user:req.user._id,
            title,
            amount,
            category,
            date,
            notes
        });
        await expense.save();
        res.status(201).json({message:"Successfully added expense!",expense});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const getExpense=async(req,res)=>{
    try{
        const expenses=await Expense.findById({user:req.user._id}).sort({date:-1});
        res.json(expenses);
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
};

export const deleteExpense=async(req,res)=>{
    try{
        const expense=await Expense.findById(req.params.id);
        if(!expense) return res.status(404).json({message:"No such expense"});

        if(expense.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Not authorized!"});
        }

        await Expense.deleteOne();
        return res.status(200).json({message:"Expense deleted!"});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
};