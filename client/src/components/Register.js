import React, { useState } from 'react';
import { registerUser } from '../services/apiService';
import './Register.css';

function Register() {
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(formData);
            console.log("Registration successful!");
            setMessage("Registration successful!");
        } catch (error) {
            console.error("Registration error:", error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="register-container" onSubmit={handleSubmit}>
            {message && <p>{message}</p>}
            <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
            />
            <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </form>
    );
}

export default Register;
