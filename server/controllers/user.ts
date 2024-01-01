import axios from "axios";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Request, Response } from "express";

import User from "../models/userModel";
import isEmailValid from "../helper/authHelper";
import Profile from "../models/ProfileModel";
import { createToken } from "../controllers/token";

dotenv.config();
const SECRET: string | undefined = process.env.SECRET;
const VIDEOSDK_API_KEY: string | undefined = process.env.VIDEOSDK_API_KEY;

async function getProfilePictureByName(name: string): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://ui-avatars.com/api/name=${name}`,
      {
        responseType: "arraybuffer",
      }
    );

    if (response.status === 200) {
      const base64String = Buffer.from(response.data, "binary").toString(
        "base64"
      );
      return base64String;
    } else {
      console.error(`Error: Received status code ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!isEmailValid(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const existingUser = await User.findOne({ email }).populate("profile");

    if (!existingUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(
      existingUser.email,
      existingUser.id,
      existingUser.role,
      "24h",
      SECRET,
      VIDEOSDK_API_KEY
    );
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    res.status(200).json({ token, expiresIn: expirationTime });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Server is not responding", err: String(error) });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    if (Object.keys(req.body).length === 0)
      res.status(400).json({ message: "Request body is empty" });

    const { email, password, confirmPassword, firstName, lastName, role } =
      req.body;

    if (!isEmailValid(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    if (password !== confirmPassword)
      res.status(400).json({ message: "Password does not match" });

    const existingUser = await User.findOne({ email });

    if (existingUser) res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const profilePicture =
      (await getProfilePictureByName(`${firstName}+${lastName}`)) || "";
    const newUser = await new User({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      role: role,
    });
    newUser.profile = await Profile.create({
      user: newUser,
      profilePicture: profilePicture,
    });
    await newUser.save();
    const token = createToken(
      newUser.email,
      newUser.id,
      role,
      "24h",
      SECRET,
      VIDEOSDK_API_KEY
    );
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    res.status(201).json({
      token: token,
      expirationTime: expirationTime,
      message: "User Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password Changed Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
