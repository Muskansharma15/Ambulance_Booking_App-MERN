import React from 'react';
import './Aboutus.css'; 

const AmbulanceAboutus = () => {
    return (
        <div className="page-background">

        <div className="about-us-container">
            <h1>About Us</h1>
            <p>
                Welcome to <strong>SwasthSetu</strong>, your trusted partner in emergency medical services. 
                Our mission is to provide quick and reliable ambulance booking services to ensure timely 
                medical assistance for those in need.
            </p>
            <p>
            <strong>SwasthSetu</strong> is proud to offer its services completely free of charge. We believe that access to 
            emergency medical transportation should be available to everyone without financial barriers. Our goal is to 
             prioritize health and safety above all.
            </p>
            <p>
                At <strong>SwasthSetu</strong>, we work closely with ambulance drivers and healthcare 
                authorities to create a seamless and efficient system for booking ambulances. Our platform 
                is designed to connect patients with the nearest available ambulance, ensuring that help 
                reaches you when it matters the most.
            </p>
            <h2>For Ambulance Drivers</h2>
            <p>
                We value the dedication and hard work of ambulance drivers who are the backbone of our 
                service. By partnering with us, you can:
            </p>
            <ul>
                <li>Receive real-time booking requests.</li>
                <li>Expand your reach to more patients in need.</li>
                <li>Be part of a trusted network of emergency responders.</li>
            </ul>
            <h2>For Ambulance Authorities</h2>
            <p>
                Our platform is designed to support ambulance authorities in managing their fleet 
                efficiently. With <strong>SwasthSetu</strong>, you can:
            </p>
            <ul>
                <li>Track ambulance availability and location in real-time.</li>
                <li>Ensure faster response times for emergencies.</li>
                <li>Improve coordination between drivers and hospitals.</li>
            </ul>
            <p>
                Together, we can make a difference in saving lives. Thank you for choosing 
                <strong>SwasthSetu</strong> as your trusted ambulance booking platform.
            </p>
            <div className='contact-info'>
                <h2>Email:- SwasthSetuServices@gmail.com</h2>
                <h2>Phone:- +91 1234567890</h2>
            </div>
        </div>
        </div>
    );
};

export default AmbulanceAboutus;