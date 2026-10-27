
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.get("/test", (req, res) => {
    res.json({ message: "API is working!" });
});
