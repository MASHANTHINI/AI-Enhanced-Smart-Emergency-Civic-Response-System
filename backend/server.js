const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const complaintRoutes = require("./routes/complaints");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/emergency_ai")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/complaints", complaintRoutes);

app.listen(5001, () => console.log("Server running on 5001"));
