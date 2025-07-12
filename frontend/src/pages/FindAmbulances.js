import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./FindAmbulances.css"; 
import socket from "../socket"; 
import { useNavigate } from 'react-router-dom'; 
const FindAmbulances = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  const location = useLocation(); 

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const lat = queryParams.get("lat");
    const lng = queryParams.get("lng");

    if (lat && lng) {
      setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }
  }, [location]);

  useEffect(() => {
    const fetchAmbulances = async () => {
      if (userLocation.lat && userLocation.lng) {
        try {
          const response = await axios.post(`/api/auth/ambulances?lat=${userLocation.lat}&lng=${userLocation.lng}`);
          setAmbulances(response.data);
        } catch (error) {
          console.error('❌ Error fetching ambulances:', error);
        }
      }
    };

    fetchAmbulances();
  }, [userLocation]);

  return (
    <div>
      <h2>🚑 Nearby Ambulances</h2>
      {ambulances.length > 0 ? (
        ambulances.map((ambulance) => (
          <div key={ambulance._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <p><strong>Name:</strong> {ambulance.name}</p>
            <p><strong>Vehicle Number:</strong> {ambulance.vehicle_number}</p>
            <p><strong>Location:</strong> Lat {ambulance.location.lat}, Lng {ambulance.location.lng}</p>
            <p><strong>Distance:</strong> {ambulance.distance ? `${ambulance.distance} meters` : "N/A"}</p>
          </div>
        ))
      ) : (
        <p>❌ No ambulances found nearby.</p>
      )}
    </div>
  );
};


const FindAmbulanceswithoutmap = () => {
  const [ambulances, setAmbulances] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); //To receive pickup/dropoff

  const { pickup, dropoff } = location.state || {}; //Get from Home.js

  useEffect(() => {
    const fetchAmbulanceswithoutmap = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/ambulances/all-ambulances");
        setAmbulances(response.data);
        console.log("Fetched all ambulances", response.data);
      } catch (error) {
        console.error('❌ Error fetching ambulances:', error);
      }
    };

    fetchAmbulanceswithoutmap();
  }, []);

  const handleBookAmbulance = async (ambulanceId) => {
    try {
      const userId = localStorage.getItem("userId"); 
  
      const bookingData = {
        userId,         
        ambulanceId,
        pickup,
        dropoff,
      };
  
      console.log("Booking request data:", bookingData); 
  
      const response = await axios.post("http://localhost:5000/api/bookings/create", bookingData);
  
      console.log("✅ Booking request sent:", response.data);
  
      socket.emit("sendBookingRequest", {
        ambulanceId,
        pickup,
        dropoff,
        userId, // we already have it
      });
  
      alert("Booking request sent successfully!");
      navigate("/home"); // Go back to home
    } catch (error) {
      console.error("❌ Error sending booking request:", error);
      alert("Failed to send booking request.");
    }
  };
  
  return (
    <div className="ambulance-container">
      <h2 className="ambulance-title">🚑 Book Any Ambulance</h2>
      {ambulances.length > 0 ? (
        ambulances.map((ambulance) => (
          <div key={ambulance._id} className="ambulance-card">
            <p><strong>Name:</strong> {ambulance.name}</p>
            <p><strong>Email:</strong>{ambulance.email}</p>
            <p><strong>Vehicle Number:</strong> {ambulance.vehicle_number}</p>
            <p><strong>Phone Number:</strong> {ambulance.phone_number}</p>

            <button 
              className="book-btn" 
              onClick={() => handleBookAmbulance(ambulance._id)}
            >
              Book Now
            </button>
          </div>
        ))
      ) : (
        <p>❌ No ambulances found.</p>
      )}
    </div>
  );
}



//export default FindAmbulanceswithoutmap;

export {FindAmbulances, FindAmbulanceswithoutmap}

//export default FindAmbulanceswithoutmap;
