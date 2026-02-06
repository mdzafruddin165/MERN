const express = require("express");
const { TodoModel } = require("../model/todoModel");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const newTodo = new TodoModel(req.body);
    await newTodo.save();
    res.send("Todo Added Successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
