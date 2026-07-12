import { useEffect, useState } from "react";
import { getMyGrievances } from "../services/grievanceService";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Topbar from "../components/Topbar";
import GrievanceFilter from "../components/GrievanceFilter";

function MyGrievances() {
    const [grievances, setGrievances] = useState([]);
    const [filteredGrievances, setFilteredGrievances] = useState([]);

    useEffect(() => {
        loadGrievances();
    }, []);

    const loadGrievances = async () => {
        try {
            const data = await getMyGrievances();
            setGrievances(data);
            setFilteredGrievances(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <DashboardLayout>
            <Topbar />

            <div className="page">
                <div className="page-header">
                    <h1>My Grievances</h1>
                    <p>Track all your submitted grievances and their current status.</p>
                </div>

                {grievances.length === 0 ? (
                    <div className="empty-card">
                        <h3>No grievances found</h3>
                        <p>You have not submitted any grievances yet.</p>
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
                                        <th>History</th>
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
                                                <Link to={`/student/grievances/${g.id}/history`}>
                                                    <button className="small-btn">View History</button>
                                                </Link>
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

export default MyGrievances;