import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import Sidebar from "../components/Sidebar";
import TambahSiswa from "../components/TambahSiswa";
import DaftarSiswa from "../components/DaftarSiswa";
import FormEditSiswa from "../components/FormEditSiswa";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("tambah");
  const [editingStudent, setEditingStudent] = useState(null);

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

        {activeTab === "daftar" && (
          <>
            {editingStudent && (
              <FormEditSiswa
                siswa={editingStudent}
                onCancel={() => setEditingStudent(null)}
                onUpdate={fetchData}
              />
            )}
            <DaftarSiswa
              students={students}
              onDelete={fetchData}
              onEdit={setEditingStudent}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
