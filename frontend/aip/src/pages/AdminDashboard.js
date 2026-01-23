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
      console.error("Fetch error:", err);
    }
  };

  // 🔁 AUTO MONITORING (AGENT WATCH MODE)
  useEffect(() => {
    loadData();
    const t = setInterval(loadData, 3000); // refresh every 3 sec
    return () => clearInterval(t);
  }, []);

  // OPTIONAL: manual override approve
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
  const escalated = complaints.filter(c => c.agentStatus === "Escalated").length;

  return (
    <div className="admin-dashboard">

      <header>
        <h1> AI Command & Control Center</h1>
        <p>Autonomous monitoring and resource allocation system</p>
      </header>

      {/* -------- Stats -------- */}
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
