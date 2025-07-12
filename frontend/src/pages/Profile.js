import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
//import bgImage from "./assets/ambulancebg2.jpg"; // Adjust the path as necessary
const Profile = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const navigate = useNavigate();
 
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    console.log("User details fetched:",userData)
    setUser(userData);
    setFormData({ name: userData.name || "", email: userData.email || "" });

    const userId = localStorage.getItem("userId");
    
    if (userId) {
      try {
        fetch(`http://localhost:5000/api/bookings/user/${userId}`)
          .then((res) => res.json())
          .then((data) => setBookings(data))
          .catch((err) => {
            console.error("Failed to retrieve your bookings!", err);
            alert("Failed to load booking history.");
          });
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error("Sorry! Updation Failed");
  
      const data = await response.json();
      setUser(data.user); // 🔥 fixed
      localStorage.setItem("user", JSON.stringify(data.user)); // 🔥 fixed
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

  const token = localStorage.getItem('token');

  try {
    const userId = localStorage.getItem("userId");
    await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    alert("Profile Deleted Successfully");
    navigate("/login");
  } catch (err) {
    console.error(err);
    alert("Failed to delete profile");
  }
};

  return (
    <div className="profile-container" >
      <div className="tabs">
        <button onClick={() => setActiveTab("account")}>My Account</button>
        <button onClick={() => setActiveTab("bookings")}>Booking History</button>
      </div>

      {activeTab === "account" && (
        <div className="account-tab">
          {!editMode ? (
            <>
              <h4>User Name: {user?.name || "not able to fetch name"}</h4>
              <p>Email: {user?.email || "not able to fetch Email"}</p>
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
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="history-tab">
          <h2>📜 Booking History</h2>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <ul className="booking-list">
              {bookings.map((booking) => (
                <li key={booking._id} className="booking-item">
                  <p><strong>🚑 Pickup:</strong> {booking.pickup?.name}</p>
                  <p><strong>🏥 Dropoff:</strong> {booking.dropoff?.name}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                  <p><strong>Date:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile; 
