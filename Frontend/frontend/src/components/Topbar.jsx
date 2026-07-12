import { useState } from "react";
import { FaBell } from "react-icons/fa";
import "./Topbar.css";

function Topbar() {
    const role = localStorage.getItem("role");
    const storedName = localStorage.getItem("name");
    const [isOpen, setIsOpen] = useState(false);

    const getEmailFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return "";
        try {
            const payloadBase64 = token.split(".")[1];
            if (!payloadBase64) return "";
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return decodedPayload.sub || decodedPayload.email || decodedPayload.username || "";
        } catch (error) {
            console.error("Failed to decode token for email:", error);
            return "";
        }
    };

    const email = localStorage.getItem("email") || getEmailFromToken() || "user@college.edu";

    const name =
        storedName && storedName !== "undefined"
            ? storedName
            : role;

    return (
        <div className="topbar">
            <div>
                <h2>Welcome Back , {name}👋</h2>
                <p>{role}</p>
            </div>

            <div className="topbar-right">
                <FaBell className="top-icon" />
                <div className="profile-container">
                    <div className="profile-avatar-circle" onClick={() => setIsOpen(!isOpen)}>
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div className={`profile-dropdown ${isOpen ? 'show' : ''}`}>
                        <div className="dropdown-header">
                            <div className="dropdown-avatar-circle">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <div className="dropdown-info">
                                <h4>{name}</h4>
                                <p className="dropdown-email">{email}</p>
                            </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-body">
                            <div className="dropdown-item">
                                <span className="dropdown-label">Role:</span>
                                <span className="dropdown-val">{role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Topbar;