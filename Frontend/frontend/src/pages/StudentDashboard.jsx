import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { getMyGrievances } from "../services/grievanceService";
import Topbar from "../components/Topbar";
import GrievanceCharts from "../components/GrievanceCharts";

function StudentDashboard() {
    const [rawGrievances, setRawGrievances] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        escalated: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getMyGrievances();
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

    return (
        <DashboardLayout>
            <div className="page">
                <Topbar />

                <div className="dashboard-banner student" style={{ marginTop: "20px" }}>
                    <div className="banner-content">
                        <h1>Student Dashboard</h1>
                        <p>Welcome back! Manage your grievances, track their status and stay updated with notifications.</p>
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
                    <Link to="/student/submit" className="dashboard-card">
                        <div className="card-img-wrapper">
                            <img src="/images/academic.jpg" alt="Submit Grievance" />
                        </div>
                        <div className="card-body">
                            <h3>📝 Submit Grievance</h3>
                            <p>Raise a new grievance anonymously or with identity.</p>
                        </div>
                    </Link>

                    <Link to="/student/my-grievances" className="dashboard-card">
                        <div className="card-img-wrapper">
                            <img src="/images/library.jpg" alt="My Grievances" />
                        </div>
                        <div className="card-body">
                            <h3>📂 My Grievances</h3>
                            <p>Track your submitted grievances and status.</p>
                        </div>
                    </Link>

                    <Link to="/student/notifications" className="dashboard-card">
                        <div className="card-img-wrapper">
                            <img src="/images/wifi.jpg" alt="Notifications" />
                        </div>
                        <div className="card-body">
                            <h3>🔔 Notifications</h3>
                            <p>View latest grievance updates.</p>
                        </div>
                    </Link>
                </div>

                <div className="scenarios-section">
                    <h2 className="scenarios-title">Explore Grievance Scenarios</h2>
                    <p className="scenarios-subtitle">
                        Select a standard scenario below to quickly submit a concern with the right category pre-selected.
                    </p>
                    <div className="scenarios-grid">
                        {scenarios.map((scenario, index) => (
                            <div key={index} className="scenario-card">
                                <div className="scenario-img-wrapper">
                                    <img src={scenario.image} alt={scenario.title} className="scenario-img" />
                                </div>
                                <div className="scenario-card-content">
                                    <h3>{scenario.title}</h3>
                                    <p>{scenario.description}</p>
                                    <Link to={`/student/submit?category=${scenario.category}`} className="scenario-btn">
                                        Report Issue
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

const scenarios = [
    {
        title: "Academic Concerns",
        description: "Issues related to class schedules, syllabus coverage, lectures, or academic materials.",
        image: "/images/academic.jpg",
        category: "ACADEMIC"
    },
    {
        title: "Hostel & Dorms",
        description: "Room maintenance, cleanliness, water supply, warden support, or mess issues.",
        image: "/images/hostel.jpg",
        category: "HOSTEL"
    },
    {
        title: "Campus Transport",
        description: "College bus delays, transport routes, shuttle frequencies, or bus pass concerns.",
        image: "/images/transport.jpg",
        category: "TRANSPORT"
    },
    {
        title: "Examinations",
        description: "Hall ticket delays, scheduling clashes, grading discrepancies, or results publication.",
        image: "/images/examination.jpg",
        category: "EXAMINATION"
    },
    {
        title: "Faculty & Teaching",
        description: "Teaching methodology concerns, communication gaps, or faculty mentoring issues.",
        image: "/images/faculty.jpg",
        category: "FACULTY"
    },
    {
        title: "Infrastructure & Labs",
        description: "Damaged class furniture, lab equipment failures, non-working ACs, or smart board issues.",
        image: "/images/infrastructure.jpg",
        category: "INFRASTRUCTURE"
    },
    {
        title: "Library Resources",
        description: "Book unavailability, renewal problems, lack of study space, or digital library issues.",
        image: "/images/library.jpg",
        category: "OTHER"
    },
    {
        title: "Cafeteria & Dining",
        description: "Food quality complaints, hygiene concerns, seating space, or cafeteria pricing.",
        image: "/images/cafeteria.jpg",
        category: "OTHER"
    },
    {
        title: "Sports & Gym",
        description: "Sports equipment shortage, playground maintenance, or gym accessibility issues.",
        image: "/images/sports.jpg",
        category: "OTHER"
    },

];

export default StudentDashboard;