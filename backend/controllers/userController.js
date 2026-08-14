import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        token = req.headers.authorization;
      }
    }

    if (!token) {
      return res.status(200).json(null);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId || decoded.id;
      const user = await User.findById(userId).select("-password").populate("enrolledCourses");

      if (!user) {
        return res.status(200).json(null);
      }

      return res.status(200).json(user);
    } catch (jwtError) {
      res.clearCookie("token");
      return res.status(200).json(null);
    }
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(200).json(null);
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description, photoUrl } = req.body;
    const updateData = { name, description };
    if (photoUrl) {
      updateData.photoUrl = photoUrl;
    }
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("UpdateProfile error:", error);
    return res.status(500).json({ message: `Update Profile Error: ${error.message}` });
  }
};
