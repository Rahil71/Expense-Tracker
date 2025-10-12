import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendBudgetAlertsEmail=async(email,totalSpent,budgetLimit)=>{
    try{
        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:"Budget Limit Reached!!!",
            text:`Hi! You've spent ₹${totalSpent}, your monthly budget limit was of ₹${budgetLimit}. Consider reviewing your expenses.`
        };

        await transporter.sendMail(mailOptions);
        // return res.status(201).json({message:"Email sent successfully!!"});
        console.log("Email sent successfully!!")
    }
    catch(err){
        // return res.status(500).json({message:"Email alert failed!",error:err.message});
        console.log(err);
    }
};