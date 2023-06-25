import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

const PORT = process.env.PORT || 8000;

app.use("/", (req, res) => {
  res.json({
    status: "success",
    message: "Server running well",
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server running at http://localhost:${PORT}`);
});
