import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Topbar from "../components/Topbar";
import {
    submitGrievance,
    getStaffList,
} from "../services/grievanceService";

function SubmitGrievance() {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchParams] = useSearchParams();
    const paramCategory = searchParams.get("category")?.toUpperCase();
    const validCategories = ["ACADEMIC", "HOSTEL", "TRANSPORT", "EXAMINATION", "FACULTY", "INFRASTRUCTURE", "OTHER"];
    const initialCategory = validCategories.includes(paramCategory) ? paramCategory : "ACADEMIC";

    const [staffList, setStaffList] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: initialCategory,
        studentName: "",
        proofFile: null,
        anonymous: false,
        staffId: "",
    });

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        try {
            const data = await getStaffList();
            setStaffList(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        setForm({
            ...form,
            proofFile: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("category", form.category);
            formData.append("anonymous", form.anonymous);
            formData.append("staffId", form.staffId);

            if (!form.anonymous) {
                formData.append("studentName", form.studentName);
            }

            if (form.proofFile) {
                formData.append("proofFile", form.proofFile);
            }

            await submitGrievance(formData);

            setShowSuccess(true);
            setErrorMessage("");

            setForm({
                title: "",
                description: "",
                category: "ACADEMIC",
                studentName: "",
                proofFile: null,
                anonymous: false,
                staffId: "",
            });
        } catch (error) {
            console.log(error);
            setErrorMessage("Failed to submit grievance. Please try again.");
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        navigate("/student/my-grievances");
    };

    return (
        <DashboardLayout>
            <Topbar />

            <div className="form-card">
                <h2>Submit New Grievance</h2>

                <p className="form-subtitle">
                    Share your concern with the concerned officials.
                </p>

                {errorMessage && (
                    <div style={{ padding: "10px", background: "#fee2e2", color: "#b91c1c", borderRadius: "10px", marginBottom: "15px", fontSize: "14px", fontWeight: "600" }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter grievance title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        placeholder="Explain your grievance clearly"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />

                    <label>Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                    >
                        <option value="ACADEMIC">Academic</option>
                        <option value="HOSTEL">Hostel</option>
                        <option value="TRANSPORT">Transport</option>
                        <option value="EXAMINATION">Examination</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="INFRASTRUCTURE">Infrastructure</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <label>Select Staff</label>
                    <select
                        name="staffId"
                        value={form.staffId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Staff</option>

                        {staffList.map((staff) => (
                            <option key={staff.id} value={staff.id}>
                                {staff.fullName}
                            </option>
                        ))}
                    </select>

                    <label className="checkbox-row">
                        <input
                            type="checkbox"
                            name="anonymous"
                            checked={form.anonymous}
                            onChange={handleChange}
                        />
                        Submit Anonymously
                    </label>

                    {!form.anonymous && (
                        <>
                            <label>Your Name</label>
                            <input
                                type="text"
                                name="studentName"
                                placeholder="Enter your name"
                                value={form.studentName}
                                onChange={handleChange}
                                required={!form.anonymous}
                            />
                        </>
                    )}

                    <label>Upload Proof (Max 20 MB)</label>
                    <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                    />

                    {form.proofFile && (
                        <p className="file-name">
                            Selected file: {form.proofFile.name}
                        </p>
                    )}

                    <button className="primary-btn" type="submit">
                        Submit Grievance
                    </button>
                </form>
            </div>

            {showSuccess && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <div className="custom-modal-icon">✅</div>
                        <h3>Success!</h3>
                        <p>Grievance submitted successfully</p>
                        <button className="custom-modal-btn" onClick={handleCloseSuccess}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default SubmitGrievance;