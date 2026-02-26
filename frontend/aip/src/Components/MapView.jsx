// src/Components/MapView.jsx

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===========================
   FIX LEAFLET DEFAULT ICON
=========================== */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===========================
   CLICK TO UPDATE LOCATION
=========================== */
function LocationMarker({ setUserLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setUserLocation({
        lat,
        lng,
      });
    },
  });

  return null;
}

/* ===========================
   RECENTER MAP
=========================== */
function RecenterMap({ location }) {
  const map = useMap();

  if (location?.lat && location?.lng) {
    map.flyTo([location.lat, location.lng], 15, {
      animate: true,
      duration: 1.2,
    });
  }

  return null;
}

/* ===========================
   MAIN MAP VIEW
=========================== */
function MapView({
  complaints = [],
  userLocation,
  setUserLocation,
}) {
  if (!userLocation?.lat || !userLocation?.lng) {
    return (
      <div
        style={{
          height: "400px",
          borderRadius: "14px",
          background: "#020617",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
        }}
      >
        Select location to load map...
      </div>
    );
  }

  const center = [userLocation.lat, userLocation.lng];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "400px", borderRadius: "14px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Click to change location */}
      <LocationMarker setUserLocation={setUserLocation} />

      {/* Smooth recenter */}
      <RecenterMap location={userLocation} />

      {/* User marker */}
      <Marker position={center}>
        <Popup>Your Current Location</Popup>
      </Marker>

      {/* Complaint markers */}
      {complaints.map((c) =>
        c.location ? (
          <Marker
            key={c._id}
            position={[c.location.lat, c.location.lng]}
          >
            <Popup>
              <b>{c.category}</b>
              <br />
              {c.text}
              <br />
              Status: {c.status}
              <br />
              Priority: {c.priority}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}

export default MapView;