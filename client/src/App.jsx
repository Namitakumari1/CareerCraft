
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Applications from "./pages/Applications/Applications.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import ResumeBuilder from "./pages/ResumeBuilder/ResumeBuilder.jsx";
import Profile from "./pages/Profile/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;