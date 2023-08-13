import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/apiService';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const isUserLoggedIn = !!localStorage.getItem('token');

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');  // Redirect the user to the login page
    }

    return (
        <nav className="navbar-container">
            <h1 className="navbar-logo">Project Management Tool</h1>
            <ul className="navbar-links">
                {!isUserLoggedIn ? (
                    <>
                        <li className="navbar-item">
                            <Link to="/login" className="navbar-link">Login</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/register" className="navbar-link">Register</Link>
                        </li>
                    </>
                ) : (
                    <li className="navbar-item">
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
