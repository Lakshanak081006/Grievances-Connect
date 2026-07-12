import { useState, useEffect } from "react";
import { 
    FaSearch, 
    FaFilter, 
    FaInbox, 
    FaSpinner, 
    FaCheckCircle, 
    FaExclamationTriangle, 
    FaTimesCircle, 
    FaFolderOpen,
    FaTimes
} from "react-icons/fa";
import "./GrievanceFilter.css";

const statusGroups = {
    ALL: () => true,
    PENDING: (g) => g.status === "OPEN" || g.status === "PENDING",
    IN_PROGRESS: (g) => g.status === "IN_PROGRESS",
    RESOLVED: (g) => g.status === "RESOLVED",
    ESCALATED: (g) => g.status?.includes("ESCALATED"),
    CLOSED: (g) => g.status === "CLOSED"
};

const tabs = [
    { id: "ALL", label: "All", icon: <FaFolderOpen />, class: "all" },
    { id: "PENDING", label: "Pending", icon: <FaInbox />, class: "pending" },
    { id: "IN_PROGRESS", label: "In Progress", icon: <FaSpinner className="animate-spin" />, class: "in-progress" },
    { id: "RESOLVED", label: "Resolved", icon: <FaCheckCircle />, class: "resolved" },
    { id: "ESCALATED", label: "Escalated", icon: <FaExclamationTriangle />, class: "escalated" },
    { id: "CLOSED", label: "Closed", icon: <FaTimesCircle />, class: "closed" }
];

function GrievanceFilter({ grievances = [], onFilterChange }) {
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [searchText, setSearchText] = useState("");

    // Calculate unique categories from grievances dynamically
    const categories = ["ALL", ...new Set(grievances.map(g => g.category).filter(Boolean))];

    // Compute status counts
    const counts = {
        ALL: grievances.length,
        PENDING: grievances.filter(statusGroups.PENDING).length,
        IN_PROGRESS: grievances.filter(statusGroups.IN_PROGRESS).length,
        RESOLVED: grievances.filter(statusGroups.RESOLVED).length,
        ESCALATED: grievances.filter(statusGroups.ESCALATED).length,
        CLOSED: grievances.filter(statusGroups.CLOSED).length
    };

    // Filter effect
    useEffect(() => {
        const filtered = grievances.filter((g) => {
            // Status Match
            const matchesStatus = statusGroups[selectedStatus](g);
            
            // Category Match
            const matchesCategory = selectedCategory === "ALL" || g.category === selectedCategory;

            // Search Match
            const searchLower = searchText.toLowerCase();
            const matchesSearch = 
                !searchText ||
                g.title?.toLowerCase().includes(searchLower) ||
                g.description?.toLowerCase().includes(searchLower) ||
                g.category?.toLowerCase().includes(searchLower) ||
                g.submittedBy?.toLowerCase().includes(searchLower) ||
                g.departmentName?.toLowerCase().includes(searchLower) ||
                g.status?.toLowerCase().includes(searchLower);

            return matchesStatus && matchesCategory && matchesSearch;
        });

        onFilterChange(filtered);
    }, [selectedStatus, selectedCategory, searchText, grievances, onFilterChange]);

    const handleClearSearch = () => {
        setSearchText("");
    };

    return (
        <div className="filter-container">
            <div className="filter-controls-row">
                <div className="search-bar-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by title, description, category, user..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="search-input"
                    />
                    {searchText && (
                        <button className="clear-search-btn" onClick={handleClearSearch}>
                            <FaTimes />
                        </button>
                    )}
                </div>

                <div className="category-select-wrapper">
                    <FaFilter className="filter-icon" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                    >
                        <option value="ALL">All Categories</option>
                        {categories.filter(c => c !== "ALL").map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0) + cat.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="status-tabs-wrapper">
                {tabs.map((tab) => {
                    const count = counts[tab.id];
                    return (
                        <button
                            key={tab.id}
                            className={`status-tab ${tab.class} ${selectedStatus === tab.id ? "active" : ""}`}
                            onClick={() => setSelectedStatus(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                            <span className="tab-count-badge">{count}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default GrievanceFilter;
