const mongoose = require("mongoose");

// 1️⃣ Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: String,
});

// 2️⃣ Student Model
const studentModel = mongoose.model("Teacher", studentSchema);

// 3️⃣ MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(async () => {
    console.log(" MongoDB connected successfully");

    // 4️⃣ Insert Student Data
    await studentModel.create({
      name: "Md Faisal",
      age: 20,
      city: "Mumbai",
    });

    console.log(" Student Added Successfully");
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
  });

// 5️⃣ Export
module.exports = mongoose;
