import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/navbar.scss";

const TopNavbar = () => {
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    const onLogout = async () => {
        await handleLogout();
        navigate("/login");
    };

    return (
        <header className="app-navbar">
            <div className="app-navbar__inner">
                <div className="app-navbar__logo">
                    Skill<span>Bridge</span>
                </div>

                <nav className="app-navbar__links">
                    <NavLink to="/" end className="app-navbar__link">Home</NavLink>
                    <NavLink to="/full-list" className="app-navbar__link">Full-List</NavLink>
                    <NavLink to="/about-us" className="app-navbar__link">About-Us</NavLink>
                    <button onClick={onLogout} className="app-navbar__logout">Logout</button>
                </nav>
            </div>
        </header>
    );
};

export default TopNavbar;
