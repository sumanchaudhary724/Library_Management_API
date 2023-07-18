import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import path from "path";
const app = express();

const PORT = process.env.PORT || 8000;

// connect database
import connectMongoDB from "./src/config/mongoConfig.js";
connectMongoDB();

const __dirname = path.resolve();

//middlewares

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + "/build"));

// apis
import useRouter from "./src/routers/userRouter.js";
import bookRouter from "./src/routers/bookRouter.js";
import burrowRouter from "./src/routers/burrowRouter.js";
import reviewRouter from "./src/routers/reviewRouter.js";
import { auth } from "./src/middleware/authMiddleware.js";
app.use("/api/v1/user", useRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/burrow", auth, burrowRouter);
app.use("/api/v1/review", reviewRouter);

app.use("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

////////

const dbLink =
  process.env.NODE_ENV !== "production"
    ? process.env.MONGO_CLIENT
    : "mongodb://127.0.0.1:27017/library_system_march";
console.log(process.env.MONGO_CLIENT);
mongoose
  .connect(process.env.MONGO_CLIENT)
  .then(() => {
    console.log("Mongo conneted");
    app.listen(PORT, (err) => {
      err
        ? console.log(err.message)
        : console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
