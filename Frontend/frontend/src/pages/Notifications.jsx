import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";
import DashboardLayout from "../layouts/DashboardLayout";
import Topbar from "../components/Topbar";
function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <DashboardLayout>
            <Topbar />

            <div className="page">
                <div className="page-header">
                    <h1>Notifications</h1>
                    <p>Stay updated with every change in your grievance status.</p>
                </div>

                {notifications.length === 0 ? (
                    <div className="empty-card">
                        <h3>No notifications</h3>
                        <p>You have no updates right now.</p>
                    </div>
                ) : (
                    <div className="notification-list">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`notification-card ${n.isRead ? "read" : "unread"}`}
                            >
                                <div>
                                    <h3>{n.message}</h3>
                                    <p>{n.createdAt}</p>
                                </div>

                                {!n.isRead && <span className="unread-badge">New</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Notifications;