import React from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const DaftarSiswa = ({ students, onDelete }) => {
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "students", id));
    onDelete(); // Notify parent to refetch
  };

  return (
    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Nama</th>
          <th className="border p-2">NIS</th>
          <th className="border p-2">NISN</th>
          <th className="border p-2">Keterangan</th>
          <th className="border p-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s.id}>
            <td className="border p-2">{s.nama}</td>
            <td className="border p-2">{s.nis}</td>
            <td className="border p-2">{s.nisn}</td>
            <td className="border p-2">{s.keterangan}</td>
            <td className="border p-2">
              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DaftarSiswa;
