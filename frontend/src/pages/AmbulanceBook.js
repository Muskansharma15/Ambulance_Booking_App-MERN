import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "./BookAmbulance.css";

const BookAmbulance = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [ambulances, setAmbulances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Get live location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchNearbyAmbulances(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  // Fetch nearby ambulances
  const fetchNearbyAmbulances = async (lat, lng) => {
    try {
      const response = await axios.get(
        `/api/ambulances/nearby?lat=${lat}&lng=${lng}`
      );
      setAmbulances(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching ambulances:", error);
    }
  };

  // Send booking request
  const handleBook = async (ambulanceId) => {
    try {
      await axios.post("/api/bookings/create", {
        userId: "65feabc12345", // Replace with actual user ID from auth
        ambulanceId,
        lat: location.lat,
        lng: location.lng,
      });

      alert("Booking request sent!");
      navigate("/ambulance-dashboard");
    } catch (error) {
      console.error("Error sending booking request:", error);
      alert("Failed to send booking request.");
    }
  };

  const ambulanceIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return (
    <div className="booking-container">
      <h1>🚑 Nearby Ambulances</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={14}
          style={{ height: "70vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {ambulances.map((ambulance) => (
            <Marker
              key={ambulance._id}
              position={[ambulance.location.lat, ambulance.location.long]}
              icon={ambulanceIcon}
            >
              <Popup>
                <div>
                  <h3>{ambulance.name}</h3>
                  <p>📞 {ambulance.phone_number}</p>
                  <button
                    onClick={() => handleBook(ambulance._id)}
                    className="book-btn"
                  >
                    Send Booking Request
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default BookAmbulance;
