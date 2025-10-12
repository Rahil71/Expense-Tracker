import Expense from "../models/Expense.js";
import groq from "../config/groqClient.js";
import User from "../models/User.js";
import { sendBudgetAlertsEmail } from "../config/emailConfig.js";
import { sendBudgetAlertsWhatsapp } from "../config/whatsappConfig.js";

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

        const user=await User.findById(req.user._id);
        if(user.budgetLimit && user.budgetLimit>0){
            const startOfMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
            const endOfMonth=new Date(new Date().getFullYear(), new Date().getMonth()+1,0);

            const monthlyExpenses=await Expense.aggregate([
                {
                    $match:{
                        user:user._id,
                        date:{$gte:startOfMonth,$lte:endOfMonth},
                    },
                },
                {
                    $group:{_id:null,total:{$sum:"$amount"}},
                }
            ]);

            const totalSpent=monthlyExpenses[0]?.total || 0;

            if (totalSpent>=user.budgetLimit){
                await sendBudgetAlertsEmail(user.email,totalSpent,user.budgetLimit);
                if(user.phoneNumber){
                    await sendBudgetAlertsWhatsapp(user.phoneNumber,totalSpent,user.budgetLimit);
                }
            }
        }

        res.status(201).json({message:"Successfully added expense!",expense});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const getExpense=async(req,res)=>{
    try{
        const expenses=await Expense.find({user:req.user._id}).sort({date:-1});
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

export const updateExpense=async(req,res)=>{
    try{
        const expense=await Expense.findById(req.params.id);
        if(!expense){
            return res.status(404).json({message:"No such expense"});
        }

        if(expense.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Not authorized!"});
        }

        const updateExpense=await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );

        return res.status(201).json({message:"Successfully updated the expense!"});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const analyzeData=async(req,res)=>{
    try{
        const {query}=req.body;

        const expenses=await Expense.find({user:req.user._id});

        if(!expenses || expenses.length===0){
            return res.status(400).json({message:"No expense available for processing!"});
        }

        const formattedData=expenses.map(exp=>({
            title: exp.title,
            amount: exp.amount,
            category: exp.category,
            date: exp.date.toISOString().split("T")[0],
            notes: exp.notes || ""
        }));

        const response=await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages:[
                {role:"system",content:"You are an expert financial assistant that analyzes a user's expenses and provides helpful insights and budgeting suggestions for indian rupees."},
                {role:"user",content:`Here is the user's expense data:\n${JSON.stringify(formattedData, null, 2)}\n\nUser's question: ${query}`}
            ],
            temperature: 0.4
        });

        const aiResponse=response.choices[0]?.message?.content || "No response generated!";
        return res.status(201).json({message:aiResponse});
    }
    catch(err){
        res.status(500).json({message:"AI cannot analyze your data at the moment!",error:err.message});
    }
};