import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGrievanceHistory } from "../services/grievanceService";
import DashboardLayout from "../layouts/DashboardLayout";
import Topbar from "../components/Topbar";
function GrievanceHistory() {
    const { id } = useParams();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await getGrievanceHistory(id);
            setHistory(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <DashboardLayout>
            <Topbar />

            <div className="page">
                <div className="page-header">
                    <h1>Grievance History</h1>
                    <p>View the complete timeline of status changes.</p>
                </div>

                {history.length === 0 ? (
                    <div className="empty-card">
                        <h3>No history available</h3>
                        <p>This grievance has no status updates yet.</p>
                    </div>
                ) : (
                    <div className="timeline">
                        {history.map((h, index) => (
                            <div className="timeline-item" key={index}>
                                <div className="timeline-dot"></div>

                                <div className="timeline-card">
                                    <h3>{h.newStatus}</h3>
                                    <p>
                                        <b>From:</b> {h.oldStatus}
                                    </p>
                                    <p>
                                        <b>Remarks:</b> {h.remarks}
                                    </p>
                                    <p>
                                        <b>Changed By:</b> {h.changedBy}
                                    </p>
                                    <span>{h.changedAt}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default GrievanceHistory;