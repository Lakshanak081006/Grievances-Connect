import { useEffect, useState } from "react";
import { createUser, getAllGrievances } from "../services/adminService";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Topbar from "../components/Topbar";
import GrievanceCharts from "../components/GrievanceCharts";

function AdminDashboard() {
    const [rawGrievances, setRawGrievances] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        escalated: 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getAllGrievances();
            setRawGrievances(data);

            setStats({
                total: data.length,
                pending: data.filter((g) => g.status === "OPEN" || g.status === "PENDING").length,
                resolved: data.filter((g) => g.status === "RESOLVED").length,
                escalated: data.filter((g) =>
                    g.status?.includes("ESCALATED")
                ).length,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "STUDENT",
        departmentId: 1,
        registerNumber: "",
        employeeId: "",
        phone: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createUser(form);
        alert("User created successfully");
    };

    return (
        <DashboardLayout>
            <Topbar />

            <div className="page">
                <div className="dashboard-banner admin">
                    <div className="banner-content">
                        <h1>Admin Dashboard</h1>
                        <p>Manage users, departments and all grievances in one place.</p>
                    </div>
                    <div className="banner-image-wrapper">
                        <img src="/images/admin_banner.png" alt="Admin Dashboard Banner" />
                    </div>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h2>{stats.total}</h2>
                        <p>Total Grievances</p>
                    </div>

                    <div className="stat-card">
                        <h2>{stats.pending}</h2>
                        <p>Pending</p>
                    </div>

                    <div className="stat-card">
                        <h2>{stats.resolved}</h2>
                        <p>Resolved</p>
                    </div>

                    <div className="stat-card">
                        <h2>{stats.escalated}</h2>
                        <p>Escalated</p>
                    </div>
                </div>

                <GrievanceCharts stats={stats} grievances={rawGrievances} />

                <div className="dashboard-cards">
                    <Link to="/admin/add-user" className="dashboard-card">
                        <div className="card-img-wrapper">
                            <img src="/images/faculty.jpg" alt="Add User" />
                        </div>
                        <div className="card-body">
                            <h3>➕ Add User</h3>
                            <p>Create Student, Staff, HOD and Principal accounts.</p>
                        </div>
                    </Link>

                    <Link to="/admin/users" className="dashboard-card">
                        <div className="card-img-wrapper">
                            <img src="/images/academic.jpg" alt="View Users" />
                        </div>
                        <div className="card-body">
                            <h3>👥 View Users</h3>
                            <p>View all registered users and their roles.</p>
                        </div>
                    </Link>

                    <Link to="/admin/grievances" className="dashboard-card">
                        <div className="card-img-wrapper">
                            <img src="/images/infrastructure.jpg" alt="View Grievances" />
                        </div>
                        <div className="card-body">
                            <h3>📋 View Grievances</h3>
                            <p>Monitor all grievances submitted across departments.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default AdminDashboard;