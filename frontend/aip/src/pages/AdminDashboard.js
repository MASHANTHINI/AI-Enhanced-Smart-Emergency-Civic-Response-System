import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import LocationPicker from "../Components/LocationPicker";
function AdminDashboard() {

  const [complaints, setComplaints] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showDriverForm, setShowDriverForm] = useState(false); // toggle form
  const [driverForm, setDriverForm] = useState({
    name: "",
    phone: "",
    telegramChatId: "",
    lat: "",
    lng: "",
  });

  // ---------- Load Data ----------
  const loadComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/complaints", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

<<<<<<< HEAD
  // 🔁 AUTO MONITORING (AGENT WATCH MODE)
  useEffect(() => {
    loadData();
    const t = setInterval(loadData, 3000); // refresh every 3 sec
    return () => clearInterval(t);
  }, []);

  // OPTIONAL: manual override approve
=======
  const loadDrivers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/drivers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDrivers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadComplaints();
    loadDrivers();
  }, []);

  // ---------- Approve Complaint ----------
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
  const approve = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/complaints/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      loadComplaints();
    } catch (err) {
      alert("Approval failed");
    }
  };

  // ---------- Handle Driver Form ----------
  const handleChange = (e) => {
    setDriverForm({ ...driverForm, [e.target.name]: e.target.value });
  };

  const addDriver = async () => {
    try {
      await axios.post("http://localhost:5001/api/drivers/add", driverForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDriverForm({ name: "", phone: "", telegramChatId: "", lat: "", lng: "" });
      setShowDriverForm(false); // close form after adding
      loadDrivers();
    } catch (err) {
      alert("Failed to add driver");
    }
  };

  // ---------- Stats ----------
  const total = complaints.length;
<<<<<<< HEAD
  const pending = complaints.filter(c => c.status === "Pending").length;
  const approved = complaints.filter(c => c.status === "Approved").length;
  const escalated = complaints.filter(c => c.agentStatus === "Escalated").length;
=======
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const approved = complaints.filter((c) => c.status === "Approved").length;
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0

  return (
    <div className="admin-dashboard">

      <header>
        <h1> AI Command & Control Center</h1>
        <p>Autonomous monitoring and resource allocation system</p>
      </header>

      {/* ---------- Stats ---------- */}
      <div className="stats">
        <div className="stat-card total">
          <h2>{total}</h2>
          <p>Total</p>
        </div>
        <div className="stat-card pending">
          <h2>{pending}</h2>
          <p>Pending</p>
        </div>
        <div className="stat-card approved">
          <h2>{approved}</h2>
          <p>Assigned</p>
        </div>
        <div className="stat-card escalated">
          <h2>{escalated}</h2>
          <p>Escalated</p>
        </div>
      </div>

      {/* ---------- Add Driver Button ---------- */}
      <section className="driver-section">
        <button
          className="toggle-driver-form"
          onClick={() => setShowDriverForm(!showDriverForm)}
        >
          {showDriverForm ? "Close Add Driver Form" : "➕ Add Driver / Ambulance"}
        </button>

        {/* ---------- Collapsible Form ---------- */}
        {showDriverForm && (
          <div className="driver-form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={driverForm.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={driverForm.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="telegramChatId"
              placeholder="Telegram Chat ID"
              value={driverForm.telegramChatId}
              onChange={handleChange}
            />
            <p style={{ fontSize: "13px", marginBottom: "6px" }}>
  📍 Click map to select driver location
</p>

<LocationPicker
  setLocation={(loc) =>
    setDriverForm({
      ...driverForm,
      lat: loc.lat,
      lng: loc.lng,
    })
  }
/>

{driverForm.lat && (
  <p className="selected-coords">
    Selected: {driverForm.lat.toFixed(4)}, {driverForm.lng.toFixed(4)}
  </p>
)}

            <button onClick={addDriver}>Add Driver</button>
          </div>
        )}
      </section>

      {/* ---------- Drivers List ---------- */}
      <section className="drivers-list">
        <h2>🚑 Registered Drivers</h2>
        {drivers.map((d) => (
          <div key={d._id} className="driver-card">
            <p>👤 {d.name}</p>
            <p>📞 {d.phone}</p>
            <p>💬 {d.telegramChatId}</p>
            <p>📍 {d.location.lat}, {d.location.lng}</p>
            <p>🟢 {d.available ? "Available" : "Busy"}</p>
          </div>
        ))}
      </section>

      {/* ---------- Complaints Grid ---------- */}
      <section className="complaints-grid">

        {complaints.map((c) => (
          <div className="complaint-card" key={c._id}>

            <div className="card-header">
              <span className={`urgency ${c.urgency?.toLowerCase()}`}>
                {c.urgency || "N/A"}
              </span>
              <span className={`status ${c.status?.toLowerCase()}`}>
                {c.status}
              </span>
            </div>
<<<<<<< HEAD

            <p className="user">👤 {c.user?.name || "Citizen"}</p>
            <p className="category">📂 {c.category || "General"}</p>
            <p className="desc">{c.text}</p>
            <p className="location">📍 {c.location?.lat}, {c.location?.lng}</p>

            <p className="priority">Priority: {c.priority || "N/A"}</p>

            {/* 🤖 AGENT STATUS */}
            <p className="agent">
               Agent:{" "}
              <b style={{
                color:
                  c.agentStatus === "Assigned" ? "#22c55e" :
                  c.agentStatus === "Escalated" ? "#ef4444" :
                  "#facc15"
              }}>
                {c.agentStatus || "Waiting"}
              </b>
            </p>

            {/* 🚑 ASSIGNED RESOURCE */}
            {c.assignedResource && (
              <p className="resource">
                 Assigned: <b>{c.assignedResource}</b>
              </p>
=======
            <p className="user">👤 {c.user?.name || "Anonymous"}</p>
            <p className="category">{c.category || "General"}</p>
            <p className="desc">{c.text}</p>
            <p className="location">📍 {c.location?.lat}, {c.location?.lng}</p>
            <p className="risk">🔥 AI Risk Score: {c.riskScore || "N/A"}</p>
            <p className="priority">⭐ Priority: {c.priority || "N/A"}</p>
            {c.status === "Pending" && (
              <button onClick={() => approve(c._id)}>Approve Dispatch</button>
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
            )}

            {/* HUMAN OVERRIDE OPTION */}
            {c.status === "Pending" && (
              <button onClick={() => approve(c._id)}>
                Manual Approve
              </button>
            )}

          </div>
        ))}

      </section>

    </div>
  );
}

export default AdminDashboard;
