import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import HomeDashboard from "./pages/HomeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NilaiSiswa from "./pages/NilaiSiswa";
import FormEditSiswa from "./components/FormEditSiswa";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomeDashboard />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/nilai/:id" element={<NilaiSiswa />} />
        <Route path="/edit/:id" element={<FormEditSiswa />} />
      </Routes>
    </Router>
  );
}

export default App
