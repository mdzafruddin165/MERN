const express = require("express");
const { TodoModel } = require("../model/todoModel");

const router = express.Router();

router.post("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await TodoModel.findByIdAndUpdate(id, req.body);
    res.send("Todo Updated Successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
