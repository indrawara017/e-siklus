import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import HomeDashboard from "./pages/HomeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NilaiSiswa from "./pages/NilaiSiswa";
import Footer from "./components/Footer";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomeDashboard />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/nilai/:id" element={<NilaiSiswa />} />
      </Routes>
    </Router>
  );
}

export default App
