import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import MapsFunctions from "../components/MapsFuntions";
import bgImage from "./assets/ambulancebg2.jpg";
import AddressSearch from "../components/AddressSearch";
import socket from "../socket";
import logo from "./assets/ABSlogo2.png"; 
import { FaUserCircle } from "react-icons/fa"; 

const LocationComponent = ({ setLocation, setPickup, fetchNearbyAmbulances }) => {
  const [isLocating, setIsLocating] = useState(false);

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data?.display_name || "Location not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unable to fetch address";
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("📍 Fetched Location:", latitude, longitude);

          setLocation({ lat: latitude, lng: longitude });

          const address = await fetchAddress(latitude, longitude);
          setPickup({ name: address, lat: latitude, lng: longitude });

          fetchNearbyAmbulances(latitude, longitude);
          setIsLocating(false);
        },
        (error) => {
          setIsLocating(false);
          console.error("Error fetching location:", error);
          alert("❌ Failed to get location. Enable location services.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  

  return (
    <button onClick={handleGetLocation} className="location-btn" disabled={isLocating}>
      {isLocating ? "Locating..." : "📍 Use My Live Location"}
    </button>
  );
};

const Home = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [nearbyAmbulances, setNearbyAmbulances] = useState([]);
  const [profileMenu, setProfileMenu] = useState(false);

  const navigate = useNavigate();
    useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("userOnline", { userId });
    }
  }, []);

  const fetchNearbyAmbulances = async (latitude, longitude) => {
    if (!latitude || !longitude) {
      console.warn(" Location coordinates are missing!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/ambulances/find-ambulances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log(" Nearby ambulances:", data);

      setNearbyAmbulances([...new Map(data.map((amb) => [amb._id, amb])).values()]);
    } catch (error) {
      console.error("Error fetching ambulances:", error);
    }
  };

  useEffect(() => {
    if (location.lat !== null && location.lng !== null) {
      fetchNearbyAmbulances(location.lat, location.lng);
    }
  }, [location]);
 
  useEffect(() => {
    // Emit 'userOnline' to notify the server when the user connects
    socket.emit("userOnline", { userId: localStorage.getItem("userId") });
  
    // Listen for the 'bookingStatusUpdate' event from the server
    socket.on("bookingStatusUpdate", ({ bookingId, status, message }) => {
      console.log("Booking update received:", bookingId, status, message);
      
      // Display the notification in an alert
      alert(`${message} (Booking ID: ${bookingId}, Status: ${status})`);
    });
  
    // Clean up the socket listener on component unmount
    return () => {
      socket.off("bookingStatusUpdate");
    };
  }, []);
  
  
  

  return (
    <div
      className="home_container"
      style={{
        background: `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      {/* 🔹 Navbar */}
      <div className="menu">
        <ul>
        <li className="logo">
              <img src={logo} alt="Logo" className="logo-img" />
            
          </li>
          <li><Link to="/home">HOME</Link></li>
          <li><Link to="/aboutus">ABOUT US</Link></li>
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

      {/* 🔹 Map */}
      <div className="map-container" style={{ height: "50vh", width: "100%" }}>
      <MapsFunctions
  pickup={pickup || {}}
  dropoff={dropoff || {}}
  nearbyAmbulances={nearbyAmbulances || []}
/>


      </div>

      {/* 🔹 Booking Section */}
      <div className="booking-container">
        <h2>🚑 Book an Ambulance</h2>

        {/* 📍 Pickup Location */}
        <label className="input-label">Pickup Location:</label>
        <AddressSearch
          placeholder="Search Pickup Location"
          onSelect={(place) => {
  setPickup({
    name: place.display_name || place.name || "Unknown Location",
    lat: place.lat,
    lng: place.lng,
  });
  setLocation({ lat: place.lat, lng: place.lng });
}}

        />
        {pickup?.name && <p className="selected-location">📍 {pickup.name}</p>}

        {/* 🏥 Dropoff Location */}
        <label className="input-label">Drop-off Location:</label>
        <AddressSearch
          placeholder="Search Drop-off Location"
          onSelect={(place) =>
  setDropoff({
    name: place.display_name || place.name || "Unknown Location",
    lat: place.lat,
    lng: place.lng,
  })
}

        />
        {dropoff?.name && <p className="selected-location">🏥 {dropoff.name}</p>}

        {/* Live Location Button */}
        <LocationComponent
          setLocation={setLocation}
          setPickup={setPickup}
          fetchNearbyAmbulances={fetchNearbyAmbulances}
        />
 
<button
  onClick={() => navigate("/find-ambulances",{ state: { pickup, dropoff } })}
  className="book-btn"
>
  Show All Ambulances
</button>


      </div>
    </div>
  );
};

export default Home;
