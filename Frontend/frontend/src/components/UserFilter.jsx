import { useState, useEffect } from "react";
import { 
    FaSearch, 
    FaUserGraduate, 
    FaUserTie, 
    FaUserShield, 
    FaUsers, 
    FaTimes
} from "react-icons/fa";
import "./UserFilter.css";

// Helper to return role-specific styling classes and icons
const getRoleIconAndClass = (roleName = "") => {
    const roleUpper = roleName.toUpperCase();
    if (roleUpper.includes("STUDENT")) return { icon: <FaUserGraduate />, class: "student", label: "Student" };
    if (roleUpper.includes("STAFF")) return { icon: <FaUserTie />, class: "staff", label: "Staff" };
    if (roleUpper.includes("HOD")) return { icon: <FaUserShield />, class: "hod", label: "HOD" };
    if (roleUpper.includes("PRINCIPAL")) return { icon: <FaUserShield />, class: "principal", label: "Principal" };
    if (roleUpper.includes("ADMIN")) return { icon: <FaUserShield />, class: "admin", label: "Admin" };
    return { icon: <FaUsers />, class: "other", label: roleName };
};

function UserFilter({ users = [], onFilterChange }) {
    const [selectedRole, setSelectedRole] = useState("ALL");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [searchText, setSearchText] = useState("");

    // Dynamically extract unique roles present in data
    const rawRoles = [...new Set(users.map(u => u.role?.roleName).filter(Boolean))];

    useEffect(() => {
        const filtered = users.filter((u) => {
            // Search text match
            const searchLower = searchText.toLowerCase();
            const matchesSearch = 
                !searchText ||
                u.fullName?.toLowerCase().includes(searchLower) ||
                u.email?.toLowerCase().includes(searchLower) ||
                u.role?.roleName?.toLowerCase().includes(searchLower) ||
                (u.department?.departmentName && u.department.departmentName.toLowerCase().includes(searchLower));

            // Role match
            const matchesRole = selectedRole === "ALL" || u.role?.roleName === selectedRole;

            // Status match
            const matchesStatus = 
                selectedStatus === "ALL" || 
                (selectedStatus === "ACTIVE" && u.active) || 
                (selectedStatus === "INACTIVE" && !u.active);

            return matchesSearch && matchesRole && matchesStatus;
        });

        onFilterChange(filtered);
    }, [searchText, selectedRole, selectedStatus, users, onFilterChange]);

    // Calculate count badges
    const getRoleCount = (roleName) => {
        if (roleName === "ALL") return users.length;
        return users.filter(u => u.role?.roleName === roleName).length;
    };

    const getStatusCount = (statusType) => {
        if (statusType === "ALL") return users.length;
        if (statusType === "ACTIVE") return users.filter(u => u.active).length;
        if (statusType === "INACTIVE") return users.filter(u => !u.active).length;
        return 0;
    };

    return (
        <div className="user-filter-container">
            <div className="filter-controls-row">
                <div className="search-bar-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users by name, email, role, or department..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="search-input"
                    />
                    {searchText && (
                        <button className="clear-search-btn" onClick={() => setSearchText("")}>
                            <FaTimes />
                        </button>
                    )}
                </div>

                <div className="status-select-wrapper">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="status-dropdown"
                    >
                        <option value="ALL">All Statuses ({getStatusCount("ALL")})</option>
                        <option value="ACTIVE">Active ({getStatusCount("ACTIVE")})</option>
                        <option value="INACTIVE">Inactive ({getStatusCount("INACTIVE")})</option>
                    </select>
                </div>
            </div>

            <div className="role-tabs-wrapper">
                <button
                    className={`role-tab all ${selectedRole === "ALL" ? "active" : ""}`}
                    onClick={() => setSelectedRole("ALL")}
                >
                    <span className="tab-icon"><FaUsers /></span>
                    <span className="tab-label">All Roles</span>
                    <span className="tab-count-badge">{getRoleCount("ALL")}</span>
                </button>

                {rawRoles.map((role) => {
                    const info = getRoleIconAndClass(role);
                    const count = getRoleCount(role);
                    return (
                        <button
                            key={role}
                            className={`role-tab ${info.class} ${selectedRole === role ? "active" : ""}`}
                            onClick={() => setSelectedRole(role)}
                        >
                            <span className="tab-icon">{info.icon}</span>
                            <span className="tab-label">{info.label}</span>
                            <span className="tab-count-badge">{count}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default UserFilter;
