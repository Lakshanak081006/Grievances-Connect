import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmitGrievance from "./pages/SubmitGrievance";
import MyGrievances from "./pages/MyGrievances";
import Notifications from "./pages/Notifications";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import HodDashboard from "./pages/HodDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import GrievanceHistory from "./pages/GrievanceHistory";
import AddUser from "./pages/AddUser";
import ViewUsers from "./pages/ViewUsers";
import ViewAllGrievances from "./pages/ViewAllGrievances";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/hod" element={<HodDashboard />} />
        <Route path="/principal" element={<PrincipalDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student/submit" element={<SubmitGrievance />} />
        <Route path="/student/my-grievances" element={<MyGrievances />} />
        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/admin/add-user" element={<AddUser />} />
        <Route
          path="/student/grievances/:id/history"
          element={<GrievanceHistory />}
        />
        <Route path="/admin/grievances" element={<ViewAllGrievances />} />
        <Route
          path="/admin/users"
          element={<ViewUsers />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;