import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "./Ambulancedashboard.css";
import bgImage from "./assets/ambulancebg2.jpg"; 
import socket from "../socket"; 
import axios from "axios"; 
import { FaUserCircle } from "react-icons/fa"; 
import logo from "./assets/ABSlogo2.png"; 

const UpdateMapView = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
};

const AmbulanceDashboard = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [status, setStatus] = useState("pending");
  const [rideInfo, setRideInfo] = useState(null);
   const [profileMenu, setProfileMenu] = useState(false);
  // Get live location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Logout handler

  const updateBookingStatusAPI = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.put(
        "http://localhost:5000/api/auth/ambulances/booking/status",
        { bookingId, status }, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
  
      console.log("✅ Booking updated via API:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating booking via API:", error.response?.data?.message || error.message);
      alert("Failed to update booking status.");
    }
  };
  
  

  // Accept/Start Ride
  const handleStartRide = async () => {
    if (!rideInfo?._id) return;
  
    await updateBookingStatusAPI(rideInfo._id, "approved");
    setStatus("approved");
    alert("Ride started!");
  
    socket.emit("bookingResponse", {
      bookingId: rideInfo._id,
      status: "approved",
    });
  };
  
  // Reject Ride
  const handleRejectRide = async () => {
    if (!rideInfo?._id) return;
  
    await updateBookingStatusAPI(rideInfo._id, "rejected");
    alert("Ride rejected.");
  
    socket.emit("bookingResponse", {
      bookingId: rideInfo._id,
      status: "rejected",
    });
  
    setRideInfo(null);
    setStatus("pending");
  };
  


  // End Ride
  const handleEndRide = async () => {
    if (!rideInfo?._id) return;
  
    await updateBookingStatusAPI(rideInfo._id, "completed");
    setStatus("pending");
    alert("Ride ended!");
  
    socket.emit("bookingResponse", {
      bookingId: rideInfo._id,
      status: "completed",
    });
  
    setRideInfo(null);
  };
   

  // On component mount
  useEffect(() => {
    getLocation();
  
    const ambulanceId = localStorage.getItem("ambulanceId");
    console.log("📦 Retrieved ambulanceId from localStorage:", ambulanceId);
  
    const handleConnect = () => {
      console.log("🧩 Socket connected:", socket.id);
      if (ambulanceId) {
        socket.emit("ambulanceOnline", { ambulanceId });
        console.log("🚑 Emitted ambulanceOnline:", ambulanceId);
      }
    };
  
    // Handle connect (including after refresh)
    socket.on("connect", handleConnect);
  
    // Clean up on unmount, but DON'T disconnect socket unless you really want to stop real-time updates
    return () => {
      socket.off("connect", handleConnect);
      // DON'T disconnect the socket on unmount unless you're logging out
      // socket.disconnect(); <-- remove this unless you’re ending the session
    };
  }, []);
  
  
  
  

  // Handle new booking request
  useEffect(() => {
    socket.on("newBookingRequest", (booking) => {
      console.log("📦 New booking received:", booking);
      setRideInfo(booking);

      alert(`📍 New booking!\nPickup: ${booking.pickup.name}\nDropoff: ${booking.dropoff.name}`);
    });

    return () => {
      socket.off("newBookingRequest");
    };
  }, []);

  // Custom ambulance marker
  const ambulanceIcon = new L.Icon({
    iconUrl: "https://cdn4.vectorstock.com/i/1000x1000/80/98/ambulance-vehicle-pin-map-icon-vector-11718098.jpg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return (
    <div
      className="dashboard-container"
      style={{
        background: `linear-gradient(to top, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.6) 50%), url(${bgImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <div className="menu">
        <ul>
            <li className="logo">
                        <img src={logo} alt="Logo" className="logo-img" />
                      
                    </li>
          <li><Link to="/ambulance-dashboard">HOME</Link></li>
          <li><Link to="/ambulance-aboutus">ABOUT US</Link></li>
          <li><Link to="/contactus">CONTACT US</Link></li>
                   <li className="relative">
            <button onClick={() => setProfileMenu(!profileMenu)} className="text-white text-xl">
              <FaUserCircle />
            </button>
            {profileMenu && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-40 z-10">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setProfileMenu(false);
                    navigate("/account");
                  }}
                >
                  My Account
                </button>
                {/*<button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setProfileMenu(false);
                    navigate("/history");
                  }}
                >
                  Booking History
                </button>*/}
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Header */}
      <div className="header">
        
      </div>

      {/* Map Display */}
      <div className="map-container">
        <h1 className="map-title">🚑 Ambulance Location</h1>
      
        {location.lat && location.lng ? (
  
          <MapContainer center={[location.lat, location.lng]} zoom={15} style={{ height: "70vh", width: "100%" }}>
          <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
/>

            <UpdateMapView lat={location.lat} lng={location.lng} />
            <Marker position={[location.lat, location.lng]} icon={ambulanceIcon}>
              <Popup>You are here 🚑</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      {/* Ride Info & Controls */}
      {rideInfo && (
        <div className="ride-info">
          <h2>🚦 Ride Information</h2>
          <p><strong>User:</strong> {rideInfo?.user?.name || "N/A"}</p>
          <p><strong>Pickup:</strong> {rideInfo?.pickup?.name}</p>
          <p><strong>Dropoff:</strong> {rideInfo?.dropoff?.name}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
      )}

      {/* Status & Actions */}
{/* Status & Actions */}
{rideInfo && (
  <div className="status-actions">
    <h3>Status: <span className={status === "approved" ? "approved" : "pending"}>{status}</span></h3>

    {status === "pending" && (
      <>
        <button onClick={handleStartRide} className="start-btn">Accept Ride</button>
        <button onClick={handleRejectRide} className="reject-btn">Reject Ride</button>
      </>
    )}

    {status === "approved" && (
      <button onClick={handleEndRide} className="end-btn">Finish Ride</button>
    )}
  </div>
)}


    </div>
  );
};

export default AmbulanceDashboard;
