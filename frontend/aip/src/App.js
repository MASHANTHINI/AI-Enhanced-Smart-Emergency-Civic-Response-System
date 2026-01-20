import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [complaints, setComplaints] = useState([]);

  const [text, setText] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const loadData = async () => {
    const res = await axios.get("http://localhost:5001/api/complaints");
    setComplaints(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitComplaint = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5001/api/complaints", {
      text,
      imageUrl: "",
      location: { lat, lng }
    });

    setText(""); setLat(""); setLng("");
    loadData();
  };

  const approveDispatch = async (id) => {
    await axios.put(`http://localhost:5001/api/complaints/${id}/approve`);
    loadData();
  };

  const pending = complaints.filter(c => c.status === "Pending").length;
  const approved = complaints.filter(c => c.status === "Approved").length;

  return (
    <div className="container">

      <header>
        <h1>🚨 Smart Emergency & Civic Response System</h1>
        <p>AI-Assisted Decision Support Dashboard</p>
      </header>

      {/* ---------- STATS ---------- */}
      <div className="stats">
        <div className="stat-card">
          <h2>{complaints.length}</h2>
          <p>Total Reports</p>
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

      {/* ---------- FORM ---------- */}
      <section className="form-section">
        <h2>📢 Report an Issue</h2>

        <form onSubmit={submitComplaint}>
          <textarea
            placeholder="Describe emergency or infrastructure issue..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />

          <div className="row">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              required
            />
          </div>

          <button type="submit">Submit Complaint</button>
        </form>
      </section>

      {/* ---------- DASHBOARD ---------- */}
      <section>
        <h2 className="dash-title">🧑‍💻 Operator Dashboard</h2>

        <div className="grid">

          {complaints.map(c => (
            <div className="card" key={c._id}>

              <div className="top-row">
                <span className={`urgency ${c.urgency?.toLowerCase()}`}>
                  {c.urgency}
                </span>
                <span className="prio">Priority {c.priority}</span>
              </div>

              <h3>{c.category}</h3>
              <p className="desc">{c.text}</p>

              <p className="loc">📍 {c.location?.lat}, {c.location?.lng}</p>

              <div className="bottom-row">
                <span className={`status ${c.status?.toLowerCase()}`}>
                  {c.status}
                </span>

                {c.status === "Pending" && (
                  <button onClick={() => approveDispatch(c._id)}>
                    Approve
                  </button>
                )}
              </div>

            </div>
          ))}

        </div>
      </section>

    </div>
  );
}

export default App;
