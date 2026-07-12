import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Topbar from "../components/Topbar";
import GrievanceFilter from "../components/GrievanceFilter";
import { getAllGrievances } from "../services/adminService";

function ViewAllGrievances() {
    const [grievances, setGrievances] = useState([]);
    const [filteredGrievances, setFilteredGrievances] = useState([]);

    useEffect(() => {
        loadGrievances();
    }, []);

    const loadGrievances = async () => {
        const data = await getAllGrievances();
        setGrievances(data);
        setFilteredGrievances(data);
    };

    return (
        <DashboardLayout>
            <Topbar />

            <div className="page">
                <div className="page-header">
                    <h1>All Grievances</h1>
                    <p>View all grievances submitted by students.</p>
                </div>

                {grievances.length === 0 ? (
                    <div className="empty-card">
                        <h3>No grievances found</h3>
                        <p>No student grievances have been submitted yet.</p>
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
                                        <th>Department</th>
                                        <th>Proof</th>
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
                                            <td>{g.departmentName}</td>
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

export default ViewAllGrievances;