# IoT Monitoring Dashboard

A full-stack IoT monitoring system that simulates real-time sensor data, visualizes it through an interactive dashboard, and triggers automated alerts.

## Features

* Real-time temperature and humidity monitoring
* Celsius to Fahrenheit conversion
* Threshold-based alert system
* Automated email notifications
* Interactive charts using Recharts
* MongoDB data storage

## Tech Stack

* Frontend: React.js
* Backend: Node.js + Express
* Database: MongoDB
* Charts: Recharts
* Notifications: Nodemailer

## Project Structure

backend/   → Express server + sensor simulation
frontend/  → React dashboard

## How to Run

### Backend

cd backend
npm install
node server.js

### Frontend

cd frontend
npm install
npm start

## Environment Variables

Create a `.env` file in backend:

EMAIL_USER=your_email
EMAIL_PASS=your_app_password

## Future Improvements

* WebSocket-based real-time updates
* Multi-device simulation
* Alert history logging
* Anomaly detection

## Author

Mukta Deshpande
