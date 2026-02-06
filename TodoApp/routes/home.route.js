const express = require("express");
const { TodoModel } = require("../model/todoModel");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.send(todos);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
