import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import socket from "../socket"; // Adjust the path as necessary
import logo from "./assets/ABSlogo2.png"; // Adjust the path as necessary
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log(formData);
  
    const endpoint =
      formData.role === "ambulance"
        ? `http://localhost:5000/api/auth/ambulances/login`
        : `http://localhost:5000/api/auth/users/login`;
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("Backend Response:", data);
  
      if (response.ok) {
        if (data.user_token) {
          localStorage.setItem("token", data.user_token);  // Save user token
          localStorage.setItem("userId", data.user._id);   // Save user ID
          //localStorage.removeItem("ambulance"); // Make sure ambulance data is cleared

        }
        console.log("🚑 Full login response:", data);

        if (data.ambulance) {
          const ambulanceId = data.ambulance.id;
          localStorage.setItem("token", data.ambulance_token);
          localStorage.setItem("ambulanceId", ambulanceId);
          localStorage.setItem("ambulance", JSON.stringify(data.ambulance)); // Save ambulance data
          //localStorage.removeItem("user");
          if (socket && socket.connected) {
            socket.emit("ambulanceOnline", { ambulanceId });
          
            // Clean existing listener before adding
            socket.off("ambulanceOnlineConfirmed"); 
          
            socket.on("ambulanceOnlineConfirmed", ({ success }) => {
              if (success) {
                console.log("🚨 Ambulance is officially online");
                // Enable booking features here
              } else {
                console.error("❌ Failed to set ambulance online");
              }
            });
          } else {
            // If not yet connected, emit once socket is ready
            socket.once("connect", () => {
              socket.emit("ambulanceOnline", { ambulanceId });
          
              // Also clean listener to avoid duplicates
              socket.off("ambulanceOnlineConfirmed");
              socket.on("ambulanceOnlineConfirmed", ({ success }) => {
                if (success) {
                  console.log("🚨 Ambulance is officially online (delayed)");
                } else {
                  console.error("❌ Failed to set ambulance online (delayed)");
                }
              });
            });
          }
          
        }
        
        
        
      
        alert("Login Successful");
      
  
        if (formData.role === "ambulance") {
          navigate("/ambulance-dashboard");
        } else if (formData.role === "user") {
          navigate("/home");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Server error");
    }
  };
  return (
    <div className="login-container">
     <div className="login-logo">
          <img src={logo} alt="SwasthSetu Logo" className="logo-img-inside" />
        </div>
      <div className="login-form">
     
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="ambulance">Ambulance</option>
          </select>

          <button type="submit">Login</button>
        </form>

        <p className="signup-text">
          Not registered? 
          <button onClick={() => navigate("/signup")}>Signup</button>
          <button onClick={() => navigate("/ambulance-signup")}>Signup as Ambulance</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
