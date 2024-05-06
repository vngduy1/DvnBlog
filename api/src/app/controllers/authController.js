import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const signUpFunc = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || username === "") {
    return res.status(400).json({ message: "username are required" });
  }
  if (!email || email === "") {
    return res.status(400).json({ message: "email are required" });
  }
  if (!password || password === "") {
    return res.status(400).json({ message: "password are required" });
  }
  if (password.length < 6)
    return res.status(501).json({ message: "Password length is not enough" });

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.json("Signup successful!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signInFunc = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email === "") {
    return res.status(400).json({ message: "email are required" });
  }
  if (!password || password === "") {
    return res.status(400).json({ message: "password are required" });
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(400).json({ message: "User nod found!" });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({ message: "Sign In Successfully", rest });
  } catch (error) {
    next(error);
    res.status(500).json({ error: error.message });
  }
};

export { signUpFunc, signInFunc };
