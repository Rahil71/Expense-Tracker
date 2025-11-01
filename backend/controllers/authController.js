import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password, budgetLimit, phoneNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const user = new User({ name, email, password, budgetLimit, phoneNumber });
    await user.save();

    // include budgetLimit and phoneNumber in JWT payload
    const token = jwt.sign(
      { id: user._id, budgetLimit: user.budgetLimit, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        budgetLimit: user.budgetLimit,
        phoneNumber: user.phoneNumber,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // include budgetLimit and phoneNumber in JWT payload
    const token = jwt.sign(
      { id: user._id, budgetLimit: user.budgetLimit, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        budgetLimit: user.budgetLimit,
        phoneNumber: user.phoneNumber,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
