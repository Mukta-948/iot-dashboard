import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [unit, setUnit] = useState("C");

  const convertTemp = (temp) => {
    return unit === "C" ? temp : (temp * 9 / 5) + 32;
  };

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/sensor-data");
    const json = await res.json();

    const formatted = json.map(item => ({
      ...item,
      temperature: unit === "C"
        ? item.temperature
        : (item.temperature * 9 / 5) + 32,
      time: new Date(item.timestamp).toLocaleTimeString()
    }));

    setData(formatted.reverse());
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [unit]);

  const latest = data[data.length - 1];

  //  ALERT LOGIC
  const getAlert = () => {
    if (!latest) return null;

    if (latest.temperature > (unit === "C" ? 35 : 95)) {
      return { msg: " High Temperature!", color: "#642a2a" };
    }

    if (latest.humidity > 70) {
      return { msg: " High Humidity!", color: "#1b3b55" };
    }

    return { msg: " All Normal", color: "#2c5339" };
  };

  const alert = getAlert();

  return (
    <div style={{
      backgroundColor: "#000000",
      minHeight: "100vh",
      color: "white",
      padding: "20px",
      fontFamily: "Poppins, sans-serif"
    }}>

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        IoT Dashboard
      </h1>

      {/* Toggle */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setUnit(unit === "C" ? "F" : "C")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#1f0347",
            color: "white",
            cursor: "pointer"
          }}
        >
          Switch to °{unit === "C" ? "F" : "C"}
        </button>
      </div>

      {/*  ALERT BOX */}
      {alert && (
        <div style={{
          background: alert.color,
          padding: "15px",
          borderRadius: "10px",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "20px"
        }}>
          {alert.msg}
        </div>
      )}

      {/* Cards */}
      {latest && (
        <div style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          justifyContent: "center"
        }}>
          <div style={{
            background: "#000000",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "150px"
          }}>
             Temp: {latest.temperature.toFixed(1)} °{unit}
          </div>

          <div style={{
            background: "#000000",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "150px"
          }}>
             Humidity: {latest.humidity} %
          </div>
        </div>
      )}

      {/* Temperature Graph */}
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
        <div>
          <h2 style={{ textAlign: "center" }}>🌡 Temperature</h2>
          <LineChart width={700} height={300} data={data}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" stroke="#22c55e" />
          </LineChart>
        </div>
      </div>

      {/* Humidity Graph */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <h2 style={{ textAlign: "center" }}> Humidity</h2>
          <LineChart width={700} height={300} data={data}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="humidity" stroke="#3b82f6" />
          </LineChart>
        </div>
      </div>

    </div>
  );
}

export default App;