import { Link, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";
import {
    FaHome,
    FaPlusCircle,
    FaFolderOpen,
    FaBell,
    FaUsers,
    FaClipboardList,
    FaSignOutAlt,
} from "react-icons/fa";

function DashboardLayout({ children }) {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo-container2">
                    <img src="/gc_logo-removebg-preview.png" alt="GC Logo" className="logo" />
                    <h1 id="dashmain">Grievances Connect</h1>
                </div>
                <p>{role} Portal</p>

                {/* STUDENT */}
                {role === "STUDENT" && (
                    <>
                        <Link to="/student">
                            <FaHome /> Dashboard
                        </Link>

                        <Link to="/student/submit">
                            <FaPlusCircle /> Submit Grievance
                        </Link>

                        <Link to="/student/my-grievances">
                            <FaFolderOpen /> My Grievances
                        </Link>

                        <Link to="/student/notifications">
                            <FaBell /> Notifications
                        </Link>
                    </>
                )}

                {/* ADMIN */}
                {role === "ADMIN" && (
                    <>
                        <Link to="/admin">
                            <FaHome /> Dashboard
                        </Link>

                        <Link to="/admin/add-user">
                            <FaPlusCircle /> Add User
                        </Link>

                        <Link to="/admin/users">
                            <FaUsers /> View Users
                        </Link>

                        <Link to="/admin/grievances">
                            <FaClipboardList /> View Grievances
                        </Link>
                    </>
                )}

                {/* STAFF */}
                {role === "STAFF" && (
                    <>
                        <Link to="/staff">
                            <FaHome /> Dashboard
                        </Link>

                        <Link to="/staff">
                            <FaClipboardList /> Assigned Grievances
                        </Link>
                    </>
                )}

                {/* HOD */}
                {role === "HOD" && (
                    <>
                        <Link to="/hod">
                            <FaHome /> Dashboard
                        </Link>

                        <Link to="/hod">
                            <FaClipboardList /> Escalated Grievances
                        </Link>
                    </>
                )}

                {/* PRINCIPAL */}
                {role === "PRINCIPAL" && (
                    <>
                        <Link to="/principal">
                            <FaHome /> Dashboard
                        </Link>

                        <Link to="/principal">
                            <FaClipboardList /> Final Grievances
                        </Link>
                    </>
                )}

                <button onClick={logout}>
                    <FaSignOutAlt /> Logout
                </button>
            </aside>

            <main className="content">{children}</main>
        </div>
    );
}

export default DashboardLayout;