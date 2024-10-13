import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: "User already exist, Please login" });
    }

    // Hash password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      role,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT Token
      const token = generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        success: true,
        message: "Signup Successfully",
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role || '',
          profilePic: newUser.profilePic,
        },
        token,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateTokenAndSetCookie(user?._id, res);

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || '',
        profilePic: user.profilePic,
      },
      token,
    });
  } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const logoutUser = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logout successfully" });
  } catch (error) {
    console.log("Error in Logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { signupUser, loginUser, logoutUser };
