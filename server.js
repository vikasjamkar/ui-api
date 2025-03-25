const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 4000;
// mongodb://localhost:27017
const DBCONNECT = process.env.MONGO_URI;

let db;
const connectDB = async () => {
  try {
    const client = new MongoClient(DBCONNECT);
    await client.connect();
    db = client.db("student");
    console.log("Database Connect Successfully");
  } catch (error) {
    console.error("Database Connection Error:", error);
    process.exit(1);
  }
};

const app = express();
// CORS configuration
app.use(
  cors()
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Get the student list
 * 
 */
app.get("/getstudent", async (req, res) => {
  try {
    const result = await db.collection("students").find({}).toArray();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

/**
 * fill the data in student
 * 
 */
app.post("/add", async (req, res) => {
  try {
    await db.collection("students").insertOne(req.body);
    res.status(201).json({ message: "Student Insert Successfully" });
  } catch (error) {
    console.log("error occur insert student data", error``);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Update the student resource
 * 
 */
app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, roll, mobile, degree, year } = req.body;
    const result = await db
      .collection("students")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, email, roll, mobile, degree, year } }
      );
    res.status(200).json({ message: "update student successfully", result });
  } catch (error) {
    console.log("error occur update student data", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Delete the student resource
 * 
 */
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db
      .collection("students")
      .deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Delete student successfully", result });
  } catch (error) {
    console.log("error occur update student data", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * check the server is running or not
 * 
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
