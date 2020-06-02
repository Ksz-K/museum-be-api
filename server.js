const express = require("express");
const dotenv = require("dotenv");

//Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

app.get("/api/v1/museums", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all museums" });
});

app.post("/api/v1/museums", (req, res) => {
  res.status(200).json({ success: true, msg: "Create a new museum" });
});

app.get("/api/v1/museums/:id", (req, res) => {
  res.status(200).json({ success: true, msg: `Get museum ${req.params.id}` });
});

app.put("/api/v1/museums/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update museum ${req.params.id}` });
});

app.delete("/api/v1/museums/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete museum ${req.params.id}` });
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`)
);
