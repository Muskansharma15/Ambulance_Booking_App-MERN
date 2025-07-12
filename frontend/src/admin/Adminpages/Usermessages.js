import React, { useEffect, useState } from 'react';

const UserMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch messages when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/contact/messages')
            .then((response) => response.json())
            .then((data) => {
                setMessages(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching messages:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading messages...</div>;
    }

    return (
        <div>
            <h1>Contact Messages</h1>
            {messages.length === 0 ? (
                <p>No messages yet.</p>
            ) : (
                <ul>
                    {messages.map((message, index) => (
                        <li key={index} style={{ marginBottom: '15px' }}>
                            <div><strong>Name:</strong> {message.name}</div>
                            <div><strong>Email:</strong> {message.email}</div>
                            <div><strong>Message:</strong> {message.message}</div>
                            <div><strong>Date:</strong> {new Date(message.date).toLocaleString()}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserMessages;
