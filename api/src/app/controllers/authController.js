import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

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
    res.status(500).json({ message: error.message });
  }
};

export { signUpFunc };
