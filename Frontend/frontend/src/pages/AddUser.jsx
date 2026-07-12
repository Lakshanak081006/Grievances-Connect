import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Topbar from "../components/Topbar";
import { createUser } from "../services/adminService";

function AddUser() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "STUDENT",
        departmentId: 1,
        registerNumber: "",
        employeeId: "",
        phone: "",
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createUser(form);
            setShowSuccess(true);
            setErrorMessage("");
        } catch (error) {
            console.log(error);
            setErrorMessage("Failed to create user. Please try again.");
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        navigate("/admin/users");
    };

    return (
        <DashboardLayout>
            <Topbar />

            <div className="form-card">
                <h2>Add New User</h2>
                <p className="form-subtitle">
                    Create student, staff, HOD, or principal account.
                </p>

                {errorMessage && (
                    <div style={{ padding: "10px", background: "#fee2e2", color: "#b91c1c", borderRadius: "10px", marginBottom: "15px", fontSize: "14px", fontWeight: "600" }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>Full Name</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} required />

                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required />

                    <label>Password</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} required />

                    <label>Role</label>
                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="STUDENT">Student</option>
                        <option value="STAFF">Staff</option>
                        <option value="HOD">HOD</option>
                        <option value="PRINCIPAL">Principal</option>
                    </select>

                    <label>Department ID</label>
                    <input name="departmentId" value={form.departmentId} onChange={handleChange} />

                    <label>Register Number</label>
                    <input name="registerNumber" value={form.registerNumber} onChange={handleChange} />

                    <label>Employee ID</label>
                    <input name="employeeId" value={form.employeeId} onChange={handleChange} />

                    <label>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} />

                    <button className="primary-btn" type="submit">
                        Create User
                    </button>
                </form>
            </div>

            {showSuccess && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <div className="custom-modal-icon">✅</div>
                        <h3>Success!</h3>
                        <p>User created successfully</p>
                        <button className="custom-modal-btn" onClick={handleCloseSuccess}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default AddUser;