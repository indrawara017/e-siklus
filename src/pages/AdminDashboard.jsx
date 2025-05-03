import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import Sidebar from "../components/Sidebar";
import TambahSiswa from "../components/TambahSiswa";
import DaftarSiswa from "../components/DaftarSiswa";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("tambah");

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-1">
        {activeTab === "tambah" && <TambahSiswa onStudentAdded={fetchData} />}
        {activeTab === "daftar" && <DaftarSiswa students={students} onDelete={fetchData} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
