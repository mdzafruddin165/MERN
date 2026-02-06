const express = require("express");
const mongoose = require("mongoose");

const homeRoute = require("./routes/home.route");
const addRoute = require("./routes/add.route");
const updateRoute = require("./routes/update.route");

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/", homeRoute);
app.use("/", addRoute);
app.use("/", updateRoute);

app.listen(PORT, async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/todoApp");
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Error:", error);
  }
  console.log(`Server running at http://localhost:${PORT}`);
});
