import "./GrievanceCharts.css";

function GrievanceCharts({ stats, grievances = [] }) {
    // 1. Donut Chart status segment values
    const statusSegments = [
        { value: stats.resolved || 0, color: "#10b981", label: "Resolved" },
        { value: stats.pending || 0, color: "#FCA311", label: "Pending" },
        { value: stats.escalated || 0, color: "#ef4444", label: "Escalated" },
    ].filter(s => s.value > 0);

    const totalActive = statusSegments.reduce((sum, s) => sum + s.value, 0);

    // Donut chart math
    const radius = 50;
    const circumference = 2 * Math.PI * radius; // ~314.16
    let currentOffset = 0;

    // 2. Category distribution calculation
    const categories = ["ACADEMIC", "HOSTEL", "TRANSPORT", "EXAMINATION", "FACULTY", "INFRASTRUCTURE", "OTHER"];
    const categoryColors = {
        ACADEMIC: "#3b82f6",
        HOSTEL: "#a855f7",
        TRANSPORT: "#06b6d4",
        EXAMINATION: "#f97316",
        FACULTY: "#ec4899",
        INFRASTRUCTURE: "#06b6d4",
        OTHER: "#64748b"
    };

    const categoryCounts = {};
    categories.forEach(cat => {
        categoryCounts[cat] = 0;
    });

    grievances.forEach(g => {
        const cat = g.category?.toUpperCase();
        if (categories.includes(cat)) {
            categoryCounts[cat]++;
        } else {
            categoryCounts["OTHER"]++;
        }
    });

    const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);
    const totalGrievances = grievances.length;

    // Calculate details
    const resolutionRate = totalGrievances > 0 ? Math.round(((stats.resolved || 0) / totalGrievances) * 100) : 0;
    
    let performanceText = "Good";
    let performanceClass = "good";
    if (resolutionRate >= 80) {
        performanceText = "Excellent";
        performanceClass = "excellent";
    } else if (resolutionRate >= 50) {
        performanceText = "Good";
        performanceClass = "good";
    } else if (totalGrievances > 0) {
        performanceText = "Needs Action";
        performanceClass = "warning";
    } else {
        performanceText = "No Data";
        performanceClass = "no-data";
    }

    return (
        <div className="analytics-section">
            <h2 className="analytics-title">Grievance Analytics</h2>
            
            <div className="charts-grid">
                {/* Donut Chart: Status Distribution */}
                <div className="chart-card donut-card">
                    <h3>Status Breakdown</h3>
                    
                    {totalActive === 0 ? (
                        <div className="empty-chart">
                            <p>No grievance data available to display chart.</p>
                        </div>
                    ) : (
                        <div className="chart-content-wrapper">
                            <div className="chart-content">
                                <div className="donut-wrapper">
                                    <svg width="100%" height="100%" viewBox="0 0 140 140" className="donut-svg">
                                        {/* Background track circle */}
                                        <circle
                                            cx="70"
                                            cy="70"
                                            r={radius}
                                            fill="transparent"
                                            stroke="#f1f5f9"
                                            strokeWidth="12"
                                        />
                                        {statusSegments.map((seg, idx) => {
                                            const percentage = (seg.value / totalActive) * 100;
                                            const strokeLength = (percentage / 100) * circumference;
                                            const strokeOffset = circumference - currentOffset;
                                            currentOffset += strokeLength;
                                            return (
                                                <circle
                                                    key={idx}
                                                    cx="70"
                                                    cy="70"
                                                    r={radius}
                                                    fill="transparent"
                                                    stroke={seg.color}
                                                    strokeWidth="12"
                                                    strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                                                    strokeDashoffset={strokeOffset}
                                                    transform="rotate(-90 70 70)"
                                                    strokeLinecap="round"
                                                    className="donut-segment"
                                                />
                                            );
                                        })}
                                    </svg>
                                    
                                    <div className="donut-center-text">
                                        <span className="total-num">{totalGrievances}</span>
                                        <span className="total-label">Total</span>
                                    </div>
                                </div>
                                
                                <div className="chart-legend">
                                    {statusSegments.map((seg, idx) => (
                                        <div key={idx} className="legend-item">
                                            <span className="legend-dot" style={{ backgroundColor: seg.color }}></span>
                                            <span className="legend-label">{seg.label}</span>
                                            <span className="legend-value">{seg.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="donut-details">
                                <div className="detail-item">
                                    <span className="detail-title">Resolution Rate</span>
                                    <span className="detail-value">{resolutionRate}%</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-title">Active Cases</span>
                                    <span className="detail-value">{stats.pending || 0}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-title">Performance</span>
                                    <span className={`detail-status ${performanceClass}`}>
                                        {performanceText}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Horizontal Bar Chart: Category Distribution */}
                <div className="chart-card bar-card">
                    <h3>Category Distribution</h3>
                    
                    <div className="bar-chart-content">
                        {categories.map((cat, idx) => {
                            const count = categoryCounts[cat];
                            const percentage = totalGrievances > 0 ? (count / totalGrievances) * 100 : 0;
                            const barWidth = (count / maxCategoryCount) * 100;
                            
                            return (
                                <div key={idx} className="bar-row">
                                    <div className="bar-label-group">
                                        <span className="bar-cat-name">
                                            {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                        </span>
                                        <span className="bar-cat-value">
                                            {count} {count === 1 ? 'issue' : 'issues'} ({Math.round(percentage)}%)
                                        </span>
                                    </div>
                                    <div className="bar-track">
                                        <div 
                                            className="bar-fill" 
                                            style={{ 
                                                width: `${barWidth}%`, 
                                                backgroundColor: categoryColors[cat] 
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GrievanceCharts;
