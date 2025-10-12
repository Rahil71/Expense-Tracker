import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client=twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN);

export const sendBudgetAlertsWhatsapp=async(phoneNumber,totalSpent,budgetLimit)=>{
    try{
        const message=await client.messages.create({
            from:"whatsapp:+14155238886",
            to:`whatsapp:${phoneNumber}`,
            body: `Hi! You've spent ₹${totalSpent}, your monthly budget limit was of ₹${budgetLimit}. Consider reviewing your expenses.`
        });
        
        // return res.status(201).json({message:"Successfully sent message on whatsapp!!"});
        console.log("Successfully sent message on whatsapp!!");
    }
    catch(err){
        // return res.status(500).json({message:"Whatsapp alert failed",error:err.message});
        console.log(err);
    }
};