import mongoose from "mongoose";

const expenseSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    notes:{
        type:String
    }
},{timestamps:true});

const Expense=mongoose.model("Expense",expenseSchema);
export default Expense;