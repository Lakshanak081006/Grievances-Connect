import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Topbar from "../components/Topbar";
import GrievanceCharts from "../components/GrievanceCharts";
import GrievanceFilter from "../components/GrievanceFilter";
import {
    getPrincipalGrievances,
    resolveByPrincipal,
    closeByPrincipal,
} from "../services/principalService";

function PrincipalDashboard() {
    const [grievances, setGrievances] = useState([]);
    const [filteredGrievances, setFilteredGrievances] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        escalated: 0,
    });

    useEffect(() => {
        loadGrievances();
    }, []);

    const loadGrievances = async () => {
        try {
            const data = await getPrincipalGrievances();
            setGrievances(data);
            setFilteredGrievances(data);

            setStats({
                total: data.length,
                pending: data.filter((g) => g.status === "OPEN" || g.status === "PENDING" || g.status === "IN_PROGRESS" || g.status === "ESCALATED_TO_PRINCIPAL").length,
                resolved: data.filter((g) => g.status === "RESOLVED").length,
                escalated: data.filter((g) => g.status === "CLOSED").length,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <DashboardLayout>
            <Topbar />

            <div className="page">
                <div className="dashboard-banner principal">
                    <div className="banner-content">
                        <h1>Principal Dashboard</h1>
                        <p>Review final-level escalated grievances.</p>
                    </div>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h2>{stats.total}</h2>
                        <p>Total Escalated</p>
                    </div>

                    <div className="stat-card">
                        <h2>{stats.pending}</h2>
                        <p>Pending / Review</p>
                    </div>

                    <div className="stat-card">
                        <h2>{stats.resolved}</h2>
                        <p>Resolved</p>
                    </div>

                    <div className="stat-card">
                        <h2>{stats.escalated}</h2>
                        <p>Closed</p>
                    </div>
                </div>

                <GrievanceCharts stats={stats} grievances={grievances} />

                <h3 className="section-title" style={{ marginTop: "40px", marginBottom: "15px", color: "#14213D" }}>Grievances Under Review</h3>

                {grievances.length === 0 ? (
                    <div className="empty-card">
                        <h3>No escalated grievances</h3>
                        <p>There are no final-level escalated grievances to review yet.</p>
                    </div>
                ) : (
                    <>
                        <GrievanceFilter 
                            grievances={grievances} 
                            onFilterChange={setFilteredGrievances} 
                        />

                        {filteredGrievances.length === 0 ? (
                            <div className="empty-card" style={{ marginTop: "20px" }}>
                                <h3>No matching grievances</h3>
                                <p>Try adjusting your search query or status filter.</p>
                            </div>
                        ) : (
                            <table className="grievance-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Submitted By</th>
                                        <th>Proof</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredGrievances.map((g) => (
                                        <tr key={g.id}>
                                            <td>{g.title}</td>
                                            <td>{g.category}</td>
                                            <td>{g.description}</td>
                                            <td>
                                                <span className={`status ${g.status.toLowerCase()}`}>
                                                    {g.status}
                                                </span>
                                            </td>
                                            <td>{g.submittedBy}</td>
                                            <td>
                                                {g.proofFileName ? (
                                                    <a
                                                        href={`http://localhost:8080/api/files/${g.proofFileName}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        View Proof
                                                    </a>
                                                ) : (
                                                    "No proof"
                                                )}
                                            </td>
                                            <td>
                                                <button className="small-btn success" onClick={() => resolveByPrincipal(g.id).then(loadGrievances)}>
                                                    Resolve
                                                </button>
                                                <button className="small-btn danger" onClick={() => closeByPrincipal(g.id).then(loadGrievances)}>
                                                    Close
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

export default PrincipalDashboard;