const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/iotDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Schema
const SensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Sensor = mongoose.model("Sensor", SensorSchema);

// Email transporter (PUT YOUR DETAILS HERE)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dmukta175@gmail.com",
    pass: "ahyhjnppjcrzxoow"
  }
});

// Send email function
const sendAlertEmail = async (message) => {
  try {
    await transporter.sendMail({
      from: "dmukta175@gmail.com",
      to: "dmukta175@gmail.com",
      subject: "IoT Alert",
      text: message
    });
    console.log("Alert email sent");
  } catch (err) {
    console.log("Email error:", err);
  }
};

// Cooldown system (avoid spam)
let lastAlertTime = 0;
const ALERT_COOLDOWN = 60000; // 1 min

// POST API
app.post("/sensor-data", async (req, res) => {
  try {
    const data = new Sensor(req.body);
    await data.save();

    const { temperature, humidity } = req.body;
    const now = Date.now();

    // Temperature alert
    if (temperature > 35 && (now - lastAlertTime > ALERT_COOLDOWN)) {
      await sendAlertEmail(`High Temperature Alert: ${temperature}°C`);
      lastAlertTime = now;
    }

    // Humidity alert
    if (humidity > 70 && (now - lastAlertTime > ALERT_COOLDOWN)) {
      await sendAlertEmail(`High Humidity Alert: ${humidity}%`);
      lastAlertTime = now;
    }

    res.send("Data saved");
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET API
app.get("/sensor-data", async (req, res) => {
  const data = await Sensor.find().sort({ timestamp: -1 }).limit(20);
  res.json(data);
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));