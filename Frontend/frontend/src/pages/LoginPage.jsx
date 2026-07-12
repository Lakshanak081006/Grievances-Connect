import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaShieldAlt, FaComments, FaClock, FaUsers } from "react-icons/fa";
import { login as loginApi } from "../services/authService";
import "../styles/Login.css";
import { AuthContext } from "../context/AuthContext";

const sliderImages = [
    { src: "/images/academic.jpg", label: "Academic Support", caption: "Resolve issues related to lectures, scheduling, or curriculum." },
    { src: "/images/hostel.jpg", label: "Hostel Facilities", caption: "Report room maintenance, hygiene, mess food, or utilities." },
    { src: "/images/transport.jpg", label: "Campus Transport", caption: "Address college bus route delays or shuttle schedules." },
    { src: "/images/examination.jpg", label: "Examinations", caption: "Get help with grading clashes, hall tickets, or results." },
    { src: "/images/faculty.jpg", label: "Faculty Advisory", caption: "Strengthen academic guidance and professor interaction." },
    { src: "/images/infrastructure.jpg", label: "Campus Infrastructure", caption: "Report equipment damage, lab setup, or broken utilities." },
    { src: "/images/library.jpg", label: "Library Resources", caption: "Access textbooks, reference materials, and study rooms." },
    { src: "/images/cafeteria.jpg", label: "Canteen & Dining", caption: "Ensure hygiene, quality meals, and tidy seating environments." },
    { src: "/images/sports.jpg", label: "Sports Facilities", caption: "Request field updates or gymnasium equipment maintenance." },
    { src: "/images/wifi.jpg", label: "IT & Wi-Fi Connectivity", caption: "Resolve Wi-Fi portal log-ins, slow speeds, or lab PC issues." }
];

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await loginApi(email.trim(), password.trim());

            login(data.token, data.role);

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", email.trim());

            if (data.role === "ADMIN") navigate("/admin");
            else if (data.role === "STUDENT") navigate("/student");
            else if (data.role === "STAFF") navigate("/staff");
            else if (data.role === "HOD") navigate("/hod");
            else if (data.role === "PRINCIPAL") navigate("/principal");
        } catch (error) {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="login-page">
            <header className="login-header">
                <div className="logo-container1">
                    <img src="/gc_logo-removebg-preview.png" alt="GC Logo" className="logo" />
                    <h1 id="mainpage">Grievances Connect</h1>
                </div>
                <p>Raise • Resolve • Rebuild Trust</p>
            </header>

            <main className="login-main">
                <section className="login-left">
                    <span className="tagline">College Grievance Management System</span>

                    <h2>Your voice matters.</h2>
                    <p className="intro">
                        A calm and transparent platform for students to raise concerns,
                        track progress and receive timely updates.
                    </p>

                    <div className="login-slider-container">
                        <div className="login-slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                            {sliderImages.map((slide, idx) => (
                                <div key={idx} className="login-slide">
                                    <img src={slide.src} alt={slide.label} className="slide-image" />
                                    <div className="slide-caption">
                                        <h4>{slide.label}</h4>
                                        <p>{slide.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="slider-dots">
                            {sliderImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`slider-dot ${idx === currentSlide ? "active" : ""}`}
                                    onClick={() => setCurrentSlide(idx)}
                                    aria-label={`Slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="quote-box">
                        “Speak up, be heard, and together we create change.”
                    </div>

                    <div className="feature-grid">
                        <div><FaShieldAlt /><span>Secure</span></div>
                        <div><FaComments /><span>Transparent</span></div>
                        <div><FaClock /><span>Timely</span></div>
                        <div><FaUsers /><span>Accountable</span></div>
                    </div>
                </section>

                <section className="login-card">
                    <h2>Login to Account</h2>
                    <p>Enter your credentials to continue</p>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <FaEnvelope />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <FaLock />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button className="login-btn" type="submit">
                            Login
                        </button>
                    </form>

                    <p className="bottom-quote">
                        Together, let’s build a culture of trust and responsibility.
                    </p>
                </section>
            </main>
            <footer className="footer">
                © 2026 Grievances Connect | Empowering Student Voices
            </footer>
        </div>
    );
}

export default LoginPage;