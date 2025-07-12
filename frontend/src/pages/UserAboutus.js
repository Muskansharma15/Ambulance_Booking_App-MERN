import React from 'react';
import './Aboutus.css';

const UserAboutUs = () => {
    return (
        <div className="page-background">

        <div className="about-us-container">
            <h1>About Us</h1>
            <p>
                <strong>SwasthSetu</strong> is your trusted platform for quick and reliable ambulance booking. 
                We aim to make emergency medical help accessible with just a few clicks.
            </p>
            <p>
                Our services are currently <strong>completely free</strong> to ensure everyone can get the help they need, 
                when they need it most. In the future, we plan to introduce secure payment options for added convenience.
            </p>
            <p>
                With real-time location tracking and seamless booking, <strong>SwasthSetu</strong> ensures that you're always connected 
                to the nearest available ambulance—no delays, no hassle.
            </p>
            <p>
                Thank you for choosing <strong>SwasthSetu</strong>. Your safety is our priority.
            </p>
            <div className='contact-info'>
                <h2>Email:- SwasthSetuServices@gmail.com</h2>
                <h2>Phone:- +91 1234567890</h2>
            </div>
        </div>
        </div>
    );
};

export default UserAboutUs;
