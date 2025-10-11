import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/expenses",expenseRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDB connected!"))
    .catch(e=>console.log(e));

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log("Server started!!");
});