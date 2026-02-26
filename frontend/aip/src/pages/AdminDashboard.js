import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import LocationPicker from "../Components/LocationPicker";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showDriverForm, setShowDriverForm] = useState(false);

  const [driverForm, setDriverForm] = useState({
    name: "",
    phone: "",
    telegramChatId: "",
    lat: "",
    lng: "",
    serviceType: "Ambulance",
  });

  /* LOAD DATA */
  const loadComplaints = async () => {
    const res = await axios.get("http://localhost:5001/api/complaints", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setComplaints(res.data);
  };

  const loadDrivers = async () => {
    const res = await axios.get("http://localhost:5001/api/drivers", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setDrivers(res.data);
  };

  useEffect(() => {
    loadComplaints();
    loadDrivers();
    const interval = setInterval(() => {
      loadComplaints();
      loadDrivers();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* APPROVE */
  const approve = async (id) => {
    await axios.put(
      `http://localhost:5001/api/complaints/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    loadComplaints();
  };

  /* FORM HANDLING */
  const handleChange = (e) => {
    setDriverForm({ ...driverForm, [e.target.name]: e.target.value });
  };

  const addDriver = async () => {
    await axios.post(
      "http://localhost:5001/api/drivers/add",
      driverForm,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    setDriverForm({
      name: "",
      phone: "",
      telegramChatId: "",
      lat: "",
      lng: "",
      serviceType: "Ambulance",
    });

    setShowDriverForm(false);
    loadDrivers();
  };

  /* STATS */
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const approved = complaints.filter(c => c.status === "Approved").length;
  const escalated = complaints.filter(c => c.agentStatus === "Escalated").length;

  return (
    <div className="admin-dashboard">
      <header>
        <h1>AI Command & Control Center</h1>
      </header>

      <div className="stats">
        <div className="stat-card total"><h2>{total}</h2><p>Total</p></div>
        <div className="stat-card pending"><h2>{pending}</h2><p>Pending</p></div>
        <div className="stat-card approved"><h2>{approved}</h2><p>Assigned</p></div>
        <div className="stat-card escalated"><h2>{escalated}</h2><p>Escalated</p></div>
      </div>

      <section className="driver-section">
        <button onClick={() => setShowDriverForm(!showDriverForm)}>
          {showDriverForm ? "Close Resource Form" : "Add Resource"}
        </button>

        {showDriverForm && (
          <div className="driver-form">
            <input name="name" placeholder="Name" value={driverForm.name} onChange={handleChange} />
            <input name="phone" placeholder="Phone" value={driverForm.phone} onChange={handleChange} />
            <input name="telegramChatId" placeholder="Telegram Chat ID" value={driverForm.telegramChatId} onChange={handleChange} />

            <select name="serviceType" value={driverForm.serviceType} onChange={handleChange}>
              <option value="Ambulance">🚑 Ambulance</option>
              <option value="Firefighter">🔥 Firefighter</option>
              <option value="Plumber">🚰 Plumber</option>
              <option value="Electrician">⚡ Electrician</option>
            </select>

            <LocationPicker
              setLocation={(loc) =>
                setDriverForm({ ...driverForm, lat: loc.lat, lng: loc.lng })
              }
            />

            <button onClick={addDriver}>Add Resource</button>
          </div>
        )}
      </section>

      <section className="drivers-list">
        <h2>Registered Resources</h2>
        {drivers.map((d) => (
          <div key={d._id} className="driver-card">
            <p>👤 {d.name}</p>
            <p>📞 {d.phone}</p>
            <p>🛠️ {d.serviceType}</p>
            <p>📍 {d.location?.lat}, {d.location?.lng}</p>
            <p>{d.available ? "🟢 Available" : "🔴 Busy"}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboard;