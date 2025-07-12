import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DropLocation from "./Droplocation";  // DropLocation component

const Bookingform = () => {
  const { ambulanceId } = useParams();  // Get the ambulance ID from the URL
  const [pickup, setPickup] = useState({ lat: "", lng: "" });
  const [drop, setDrop] = useState({ lat: "", lng: "" });
  const [notes, setNotes] = useState("");
  const [ambulance, setAmbulance] = useState(null);

  const userId = "USER_ID";  // Replace with logged-in user's ID

  useEffect(() => {
    const fetchAmbulance = async () => {
      try {
        const response = await axios.get(`/api/ambulances/${ambulanceId}`);
        setAmbulance(response.data);
      } catch (error) {
        console.error("Error fetching ambulance details:", error);
      }
    };
    fetchAmbulance();
  }, [ambulanceId]);

  const handleBooking = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/bookings", {
        userId,
        ambulanceId,
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        dropLat: drop.lat,
        dropLng: drop.lng,
        notes,
      });

      alert("Booking successful!");
      console.log("Booking Response:", response.data);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book the ambulance.");
    }
  };

  return (
    <div className="booking-form">
      <h2>🚑 Book Ambulance</h2>

      {ambulance && (
        <div>
          <p>Selected Ambulance: {ambulance.name}</p>
          <p>Location: Latitude {ambulance.location.lat}, Longitude {ambulance.location.long}</p>
        </div>
      )}

      {/* Pickup Location */}
      <label>Pickup Latitude:</label>
      <input
        type="text"
        value={pickup.lat}
        onChange={(e) => setPickup({ ...pickup, lat: e.target.value })}
      />

      <label>Pickup Longitude:</label>
      <input
        type="text"
        value={pickup.lng}
        onChange={(e) => setPickup({ ...pickup, lng: e.target.value })}
      />

      {/* Drop Location Selector */}
      <DropLocation
        setDropLatitude={(lat) => setDrop({ ...drop, lat })}
        setDropLongitude={(lng) => setDrop({ ...drop, lng })}
      />

      {/* Notes */}
      <label>Notes:</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

      <button onClick={handleBooking}>Book Ambulance</button>
    </div>
  );
};

export default Bookingform;

