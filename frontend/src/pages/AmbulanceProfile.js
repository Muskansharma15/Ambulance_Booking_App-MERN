import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const AmbulanceProfile = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [ambulance, setAmbulance] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", location: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch ambulance data once when the component is mounted
    const ambulanceData = JSON.parse(localStorage.getItem("ambulance")) || {};
    setAmbulance(ambulanceData);
    setFormData({
      name: ambulanceData.name || "",
      email: ambulanceData.email || "",
      location: ambulanceData.location || "",
    });
  }, []); // This ensures the code runs only once when the component mounts

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/home");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/ambulances/ambulance-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Sorry! Updation Failed");

      const data = await response.json();
      setAmbulance(data.ambulance); // Update ambulance state
      localStorage.setItem("ambulance", JSON.stringify(data.ambulance)); // Save updated ambulance data to localStorage
      setEditMode(false);
      alert("Profile Updated Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to Update profile");
    }
  };

  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your profile? This action cannot be undone."
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:5000/api/auth/ambulances/ambulance-profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("ambulance");
      localStorage.removeItem("token");
      alert("Profile Deleted Successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile");
    }
  };

  return (
    <div className="profile-container">
      <div className="tabs">
        <button onClick={() => setActiveTab("account")}>My Account</button>
      </div>

      {activeTab === "account" && (
        <div className="account-tab">
          {!editMode ? (
            <>
              <h3>Ambulance Name: {ambulance.name}</h3>
              <p>Email: {ambulance.email}</p>
              <p>Location: {ambulance.location}</p>
              <button onClick={() => setEditMode(true)}>Edit</button>
              <button onClick={handleDeleteProfile}>Delete Profile</button>
            </>
          ) : (
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Location"
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default AmbulanceProfile;
