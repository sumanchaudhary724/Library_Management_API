import express from "express";

import { addBurrow, getBurrows } from "../models/burrow/BurrowModel.js";
import { updateBooks } from "../models/book/BookModel.js";
const router = express.Router();
const twoWeeks = 14;
router.post("/", async (req, res) => {
  try {
    const dueDate = new Date();
    console.log(dueDate);
    dueDate.setDate(dueDate.getDate() + twoWeeks);
    req.body.dueDate = dueDate;

    // create new burrow details in db
    const result = await addBurrow(req.body);

    if (result?._id) {
      // make book not availe and give the dueDate
      const update = await updateBooks(req.body.bookId, {
        isAvailable: false,
        dueDate,
        returnDate: null,
      });

      if (update?._id) {
        return res.json({
          status: "success",
          message: "You book has been burrowed and updated in the system",
        });
      }
    }
    res.json({
      status: "error",
      message: "unable to burrow the book now, Please try gain later",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const burrows = await getBurrows();
    res.json({
      status: "success",
      message: "Burrowlist",
      burrows,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});
export default router;
