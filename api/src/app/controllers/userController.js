import { errorHandler } from "../../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

const getUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(400, "User not found!"));
    }
    const { password } = user;
    res.status(201).json(password);
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

const updateUser = async (req, res, next) => {
  const { old_password, new_password, new_password_2 } = req.body;
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (new_password.length > 0) {
    if (new_password !== new_password_2) {
      return next(errorHandler(400, "Passwords do not match!"));
    }
    if (req.body.new_password.length < 6) {
      return next(errorHandler(411, "Password must be at least 6 characters"));
    }
    req.body.new_password = bcryptjs.hashSync(req.body.new_password, 10);
    console.log(new_password);
    console.log(old_password === new_password);
    if (old_password === new_password) {
      return next(
        errorHandler(
          400,
          "The new password must not be the same as the old password"
        )
      );
    }
  }

  if (req.body.username) {
    if (req.body.username.length < 6 || req.body.username.length > 20) {
      return next(
        errorHandler(411, "Username must be between 7band 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username cannot only contain letters and numbers")
      );
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.new_password
            ? req.body.new_password
            : req.body.old_password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json(`User has been deleted`);
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("Sign Out successfully");
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};

const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }
    const { password, ...rest } = user._doc;

    res.status(201).json(rest);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export { getUser, updateUser, deleteUser, signOut, getUsers, getUserById };
