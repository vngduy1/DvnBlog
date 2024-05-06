import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { errorHandler } from "../../utils/error.js";

const signUpFunc = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username === "") {
    return next(errorHandler(400, "username are required"));
  }
  if (!email || email === "") {
    return next(errorHandler(400, "email are required"));
  }
  if (!password || password === "") {
    return next(errorHandler(400, "password are required"));
  }
  if (password.length < 6)
    return next(errorHandler(400, "Password length is not enough"));

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
    next(error);
    console.log(error);
  }
};

const signInFunc = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email === "") {
    return next(errorHandler(400, "email are required"));
  }
  if (!password || password === "") {
    return next(errorHandler(400, "password are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User nod found!"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
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
      .json(rest);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export { signUpFunc, signInFunc };
