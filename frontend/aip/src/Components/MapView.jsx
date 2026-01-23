import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";

function LocationMarker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  });
  return null;
}

function RecenterMap({ location }) {
  const map = useMap();

  if (location && location.lat && location.lng) {
    // Smoothly move map to user location
    map.flyTo([location.lat, location.lng], 15, { animate: true });
  }

  return null;
}

function MapView({ complaints = [], userLocation, setUserLocation }) {
  // Only render map when location is ready
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : null; // wait for userLocation

  if (!center) return <div style={{ height: "400px", borderRadius: "14px", background: "#020617" }}>Loading map...</div>;

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

      {/* Click-to-select location */}
      <LocationMarker setLocation={setUserLocation} />

      {/* Recenter map */}
      <RecenterMap location={userLocation} />

      {/* Marker for user location */}
      <Marker position={center}>
        <Popup>Your Current Location</Popup>
      </Marker>

      {/* Complaints markers */}
      {complaints.map(c => (
        c.location && (
          <Marker key={c._id} position={[c.location.lat, c.location.lng]}>
            <Popup>
              <b>{c.category}</b><br />
              {c.text}<br />
              Status: {c.status}<br />
              Priority: {c.priority}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}

export default MapView;
