import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// app.use((req, res, next) => {
//   const apiKey = req.headers["x-api-key"];
//   if (apiKey !== process.env.API_KEY) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   next();
// });

app.post("/send-email", async (req, res) => {
  try {
    const { email, totalSpent, budgetLimit } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Budget Limit Reached!!!",
      text: `Hi! You've spent ₹${totalSpent}, your monthly budget limit was ₹${budgetLimit}. Consider reviewing your expenses.`,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Email microservice running on port ${PORT}`));
