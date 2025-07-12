import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AmbulanceSignup.css"; // Import your CSS file for styling
const AmbulanceSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    vehicle_number: "",
    location: {
      lat: "",
      long: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            location: { lat: latitude, long: longitude },
          }));
        },
        (error) => {
          console.error("Failed to fetch location:", error);
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "lat" || name === "long") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/ambulances/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>Ambulance Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="vehicle_number"
          placeholder="Vehicle Number"
          value={formData.vehicle_number}
          onChange={handleChange}
          required
        />

        {/* Display location with separate lat and long inputs */}
        <input
          type="text"
          name="lat"
          placeholder="Latitude"
          value={formData.location.lat}
          onChange={handleChange}
          readOnly
        />
        <input
          type="text"
          name="long"
          placeholder="Longitude"
          value={formData.location.long}
          onChange={handleChange}
          readOnly
        />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default AmbulanceSignup;

