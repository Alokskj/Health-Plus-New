import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: "10d",
  });

  res.cookie("token", token, {
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS attacks crosssite scripting attacks
    sameSite: "strict", // CSRF attacks or cross site forgery attacks
    secure: process.env.NODE_ENV === "development" ? false : true,
  });

  return token;
};

export default generateTokenAndSetCookie;
