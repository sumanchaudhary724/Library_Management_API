import express from "express";
import {
  addBurrow,
  getBurrowbyUserId,
  getBurrows,
  updateBurrow,
} from "../models/burrow/BurrowModel.js";
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
    const { role, _id } = req.userInfo;

    const burrowHistory =
      role === "admin" ? await getBurrows() : await getBurrowbyUserId(_id);

    res.json({
      status: "success",
      message: "burrow list",
      burrowHistory,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const { bookId, burrowId } = req.body;

    // update burrow table

    const updatebrw = await updateBurrow(burrowId, {
      dueDate: null,
      isRetured: true,
      returnDate: Date(),
    });

    if (updatebrw?._id) {
      // update book
      const updtbook = await updateBooks(bookId, {
        dueDate: null,
        isAvailable: true,
      });

      if (updtbook?._id) {
        return res.json({
          status: "success",
          message: "You have returned the book successfully",
        });
      }
    }

    res.json({
      status: "error",
      message: "Unable to update the system, please contact administration",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
