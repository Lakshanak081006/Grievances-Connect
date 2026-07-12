import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Topbar from "../components/Topbar";
import UserFilter from "../components/UserFilter";
import { getAllUsers } from "../services/adminService";

function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.log(error);
            alert("Failed to load users");
        }
    };

    return (
        <DashboardLayout>
            <Topbar />

            <div className="page">
                <div className="page-header">
                    <h1>All Users</h1>
                    <p>Manage all registered users in the system.</p>
                </div>

                {users.length === 0 ? (
                    <div className="empty-card">
                        <h3>No users found</h3>
                        <p>No user accounts have been created yet.</p>
                    </div>
                ) : (
                    <>
                        <UserFilter 
                            users={users} 
                            onFilterChange={setFilteredUsers} 
                        />

                        {filteredUsers.length === 0 ? (
                            <div className="empty-card" style={{ marginTop: "20px" }}>
                                <h3>No matching users</h3>
                                <p>Try adjusting your search query, role filter, or status filter.</p>
                            </div>
                        ) : (
                            <table className="grievance-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.fullName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role?.roleName}</td>
                                            <td>
                                                {user.department
                                                    ? user.department.departmentName
                                                    : "-"}
                                            </td>
                                            <td>
                                                <span className={`status ${user.active ? 'resolved' : 'closed'}`}>
                                                    {user.active ? "Active" : "Inactive"}
                                                </span>
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

export default ViewUsers;