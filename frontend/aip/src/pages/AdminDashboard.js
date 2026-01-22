import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);

  const loadData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/complaints",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const approve = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/complaints/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      loadData();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const approved = complaints.filter(c => c.status === "Approved").length;

  return (
    <div className="admin-dashboard">
      <header>
        <h1>🚨 Admin AI Risk Dashboard</h1>
        <p>AI-assisted prioritization of user complaints</p>
      </header>

      {/* -------- Stats -------- */}
      <div className="stats">
        <div className="stat-card total">
          <h2>{total}</h2>
          <p>Total Complaints</p>
        </div>
        <div className="stat-card pending">
          <h2>{pending}</h2>
          <p>Pending</p>
        </div>
        <div className="stat-card approved">
          <h2>{approved}</h2>
          <p>Approved</p>
        </div>
      </div>

      {/* -------- Complaints Grid -------- */}
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

            <p className="user">👤 {c.user?.name || "Anonymous"}</p>
            <p className="category">{c.category || "General"}</p>
            <p className="desc">{c.text}</p>
            <p className="location">📍 {c.location?.lat}, {c.location?.lng}</p>
            <p className="risk">🔥 AI Risk Score: {c.riskScore || "N/A"}</p>
            <p className="priority">⭐ Priority: {c.priority || "N/A"}</p>

            {c.status === "Pending" && (
              <button onClick={() => approve(c._id)}>Approve Dispatch</button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboard;
