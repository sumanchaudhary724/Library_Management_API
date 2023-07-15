import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import {
  addReview,
  getReviews,
  updateReview,
} from "../models/review/ReviewModel.js";
import { updateBurrow } from "../models/burrow/BurrowModel.js";
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const result = await addReview(req.body);

    if (result?._id) {
      //update burrow history
      await updateBurrow(req.body.burrowHistoryId, {
        reviewGiven: result?._id,
      });

      return res.json({
        status: "success",
        message: "Your review has been recieved.",
      });
    }

    res.json({
      status: "error",
      message: "Unable to receive your review, try again later.",
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
    const reviews = await getReviews();
    res.json({
      status: "success",
      message: "here are the list",
      reviews,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.patch("/", auth, async (req, res) => {
  try {
    const { _id, status } = req.body;
    const reviews = await updateReview(_id, { status });

    reviews?._id
      ? res.json({
          status: "success",
          message: "Updated successfully",
        })
      : res.json({
          status: "error",
          message: "Unabel to Update status",
        });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
