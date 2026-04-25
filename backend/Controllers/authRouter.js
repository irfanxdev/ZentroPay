import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function userSignUp(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const isMatch = await User.findOne({ email });
    if (isMatch)
      return res
        .status(400)
        .json({ msg: "user is already present please login" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    const user=await User.create(newUser);
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({
      msg: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ error: "server error in Signup" });
  }
}

export async function userLogIn(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Both fields are required" });
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ error: "Email is not exist please login " });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "password is incorrect" });
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ msg: "login successful", user });
  } catch (error) {
    res.status(500).json({ error: "Server error to login" });
  }
}
export function checkHealth(req, res) {
  return res.status(200).json({ msg: "its health is good" });
}

export function userLogout(req, res) {
  res.clearCookie("token");
  return res.status(200).json({ msg: "Logged out successfully" });
}
