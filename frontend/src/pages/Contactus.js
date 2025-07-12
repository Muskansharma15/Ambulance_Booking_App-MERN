import React, { useState } from 'react';
import './Contactus.css'; 
//import { Link } from 'react-router-dom';
//import logo from './assets/ABSlogo2.png'; 
const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
        alert('Thank you for contacting SwasthSetu. We will get back to you soon!');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="page-background">
        {/* 🔹 Navbar */}
        
        <div className="contact-us-container">
            <div className="contact-form-container">
                <h1>Contact Us - SwasthSetu</h1>
                <p>If you have any questions or need assistance, feel free to reach out to us.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="message">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default ContactUs;
