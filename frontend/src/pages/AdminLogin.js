import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";


const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Admin form details",formData);
    

    const endpoint = `http://localhost:5000/api/admin/admin-login`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

         if (response.ok) {
         if (data.admin) {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("adminId", data.admin._id); 
          console.log("Saved Token:", localStorage.getItem("adminToken"));
          console.log("Saved Admin ID:", localStorage.getItem("adminId"));
        }

        alert("Admin Login Successful");

        // Redirect admin to the dashboard
        navigate("/admin/dashboard");
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
      <div className="login-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
