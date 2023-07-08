import express from "express";
import { getUserByEamil, insertUser } from "../models/user/UserModel.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.json({
      status: "success",
      message: "Here are the user informations",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { password } = req.body;

    req.body.password = hashPassword(password);

    const user = await insertUser(req.body);
    user?._id
      ? res.json({
          status: "success",
          message: "New user has been created successfully",
        })
      : res.json({
          status: "error",
          message: "Unable to craete user, try again later",
        });
  } catch (error) {
    let msg = error.message;

    if (msg.includes("E11000 duplicate key error")) {
      msg = "This is another user who uses this email in the system";
    }
    res.json({
      status: "error",
      message: msg,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    //get the data

    const { email, password } = req.body;
    //check if user exit with received email and get user from db

    const user = await getUserByEamil(email);

    if (user?._id) {
      // use bcrypt to check if the passowrd is matching

      const isMatch = comparePassword(password, user.password);
      if (isMatch) {
        user.password = undefined;
        return res.json({
          status: "success",
          message: "Logedin successfully",
          user,
        });
      }
    }
    res.json({
      status: "error",
      message: "Invalid credentials",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
