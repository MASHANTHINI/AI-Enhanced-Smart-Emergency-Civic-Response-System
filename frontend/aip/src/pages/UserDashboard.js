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
<<<<<<< HEAD
=======

  useEffect(() => {
    console.log("Complaints from API:", complaints);
  }, [complaints]);
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0

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
<<<<<<< HEAD
      await axios.post("http://localhost:5001/api/complaints", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // safe even if backend not using auth
=======
      await axios.post("http://localhost:5001/api/complaints", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
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
<<<<<<< HEAD

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
=======

      {/* -------- My Complaints Section -------- */}
      <div className="my-complaints">
        <h2>🗂️ My Complaints</h2>

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

>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
                  <span className="status">{c.status}</span>
                </div>

                <p className="desc">{c.text}</p>

<<<<<<< HEAD
=======
                {/* SAFE location render */}
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
                {c.location?.lat && (
                  <p className="location">
                    📍 {c.location.lat.toFixed(4)}, {c.location.lng.toFixed(4)}
                  </p>
                )}
<<<<<<< HEAD
=======

                {c.imageUrl && (
                  <img
                    src={`data:image/jpeg;base64,${c.imageUrl}`}
                    alt="Complaint"
                    className="complaint-image"
                  />
                )}

                {/* 🚑 Driver Info for assigned complaints */}
                {c.assignedDriver && (
                  <div className="driver-info">
                    <h4>🚑 Driver Details</h4>
                    <p>Name: {c.assignedDriver.name}</p>
                    <p>Phone: {c.assignedDriver.phone}</p>
                    <p>Status: {c.driverStatus}</p>
                  </div>
                )}

                {/* ✅ Resolved Time */}
                {c.driverStatus === "Completed" && c.resolvedTime && (
                  <small style={{ color: "#16a34a" }}>
                    Completed at: {new Date(c.resolvedTime).toLocaleString()}
                  </small>
                )}
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
