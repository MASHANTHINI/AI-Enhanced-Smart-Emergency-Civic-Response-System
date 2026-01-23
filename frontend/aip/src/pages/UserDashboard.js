import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserDashboard.css";
import MapView from "../Components/MapView";

function UserDashboard() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // (not used by backend now)
  const [complaints, setComplaints] = useState([]);

  // 📍 location state
  const [location, setLocation] = useState(null);

  const token = localStorage.getItem("token");

  /* -------- LOAD ALL COMPLAINTS -------- */
  const loadComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load complaints");
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  /* -------- USE CURRENT LOCATION -------- */
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        toast.success("Current location selected");
      },
      () => toast.error("Location permission denied"),
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  /* -------- SUBMIT COMPLAINT -------- */
  const submitComplaint = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.warning("Complaint text is required!");
      return;
    }

    if (!location?.lat || !location?.lng) {
      toast.warning("Please select a location!");
      return;
    }

    // ✅ SEND JSON (matches backend)
    const payload = {
      text,
      imageUrl: null, // backend supports this field
      location: {
        lat: location.lat,
        lng: location.lng,
      },
    };

    try {
      await axios.post("http://localhost:5001/api/complaints", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // safe even if backend not using auth
        },
      });

      toast.success("Complaint submitted successfully!");

      setText("");
      setImage(null);
      setLocation(null);

      loadComplaints();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to submit complaint");
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>📢 Report an Issue</h1>
        <p>Select your location to report the issue</p>
      </header>

      <form onSubmit={submitComplaint} className="lux-form">
        <textarea
          placeholder="Describe the issue..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        {/* 📍 Use Current Location */}
        <button
          type="button"
          className="use-location-btn"
          onClick={useMyLocation}
        >
          📍 Use My Current Location
        </button>

        {/* 🗺️ Map only after location is set */}
        {location && (
          <>
            <div className="map-wrapper">
              <MapView
                complaints={complaints}
                userLocation={location}
                setUserLocation={setLocation}
              />
            </div>

            <small style={{ color: "#94a3b8" }}>
              📍 Selected Location: {location.lat.toFixed(5)},{" "}
              {location.lng.toFixed(5)}
            </small>
          </>
        )}

        {/* (Image upload kept for future, backend not using now) */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">Submit Complaint</button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* -------- Complaints Section -------- */}
      <div className="my-complaints">
        <h2>🗂️ Complaints</h2>

        {complaints.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No complaints yet</p>
        ) : (
          <div className="complaints-grid">
            {complaints.map((c) => (
              <div key={c._id} className="complaint-card">
                <div className="card-header">
                  <span className={`urgency ${c.urgency?.toLowerCase()}`}>
                    {c.urgency}
                  </span>
                  <span className="status">{c.status}</span>
                </div>

                <p className="desc">{c.text}</p>

                {c.location?.lat && (
                  <p className="location">
                    📍 {c.location.lat.toFixed(4)}, {c.location.lng.toFixed(4)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
