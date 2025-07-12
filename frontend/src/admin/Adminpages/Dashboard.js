import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaAmbulance, FaSignOutAlt, FaFacebookMessenger, FaInfoCircle, FaCloud, FaHandHoldingMedical } from 'react-icons/fa';
import './Dashboard.css';
import logo from '../../pages/assets/ABSlogo2.png';
import DashboardChart from '../DashboardChart'; 
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchAmbulances();
    fetchBookings();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`http://localhost:5000/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAmbulances = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`http://localhost:5000/api/admin/ambulances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAmbulances(response.data.ambulances);
    } catch (error) {
      console.error("Error fetching ambulances:", error);
    }
  };
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`http://localhost:5000/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <h2 className="sidebar-title">Actions</h2>
        <ul className="sidebar-nav">
          <li><FaUser /> View Users</li>
          <li><FaAmbulance /> View Ambulances</li>
          <li><FaAmbulance /> View Pending Ambulances</li>
          <li><FaInfoCircle /> View Bookings</li>
          <li><FaFacebookMessenger /> View User Messages</li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      {/* Main Dashboard */}
      <div className="admin-dashboard">
         <h2><FaHandHoldingMedical/>Hello Admin!<FaCloud/></h2>
        <h1>Welcome to SwasthSetu Admin Dashboard</h1>
        <div className="admin-dashboard-cards">
          <div className="card">
            <FaUser className="icon" />
            <h2>Total Users</h2>
            <p>{users.length}</p>
          </div>
          <div className="card">
            <FaAmbulance className="icon" />
            <h2>Total Ambulances</h2>
            <p>{ambulances.length}</p>
          </div>
          <div className="card">
            <FaInfoCircle className="icon" />
            <h2>Total Bookings</h2>
            <p>{bookings.length}</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "300px" }}>
        <h3>Monthly Booking Overview</h3>
        <DashboardChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
