import { genToken } from "../configs/token.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import sendMail from "../configs/Mail.js";

const isProduction = process.env.NODE_ENV === "production";
const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

export const signUp = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "email already exist" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter valid Email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Please enter a Strong Password" });
    }

    let hashPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      password: hashPassword,
      role: role || "student"
    });

    let token = await genToken(user._id);
    res.cookie("token", token, getCookieOptions());
    return res.status(201).json(user);
  } catch (error) {
    console.log("signUp error", error);
    return res.status(500).json({ message: `signUp Error ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect Password" });
    }

    let token = await genToken(user._id);
    res.cookie("token", token, getCookieOptions());
    return res.status(200).json(user);
  } catch (error) {
    console.log("login error", error);
    return res.status(500).json({ message: `login Error ${error.message}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", getCookieOptions());
    return res.status(200).json({ message: "logOut Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `logout Error ${error.message}` });
  }
};

export const googleSignup = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required for Google Sign Up" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || "User",
        email,
        role: role || "student"
      });
    }

    let token = await genToken(user._id);
    res.cookie("token", token, getCookieOptions());
    return res.status(200).json(user);
  } catch (error) {
    console.error("googleSignup Error:", error);
    return res.status(500).json({ message: `googleSignup Error: ${error.message}` });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerifed = false;

    await user.save();
    await sendMail(email, otp);
    return res.status(200).json({ message: "Email Successfully send" });
  } catch (error) {
    return res.status(500).json({ message: `send otp error ${error.message}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isOtpVerifed = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ message: `Verify otp error ${error.message}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerifed) {
      return res.status(404).json({ message: "OTP verification required" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.isOtpVerifed = false;
    await user.save();
    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Reset Password error ${error.message}` });
  }
};