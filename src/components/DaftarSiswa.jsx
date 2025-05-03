import React, { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const DaftarSiswa = ({ students, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [nameSortOrder, setNameSortOrder] = useState("asc");

  // Function to handle deleting a student
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "students", id));
    onDelete(); // Notify parent to refetch data
  };

  // Function to parse date strings in multiple formats
  const parseDate = (str) => {
    if (/\d{4}-\d{2}-\d{2}/.test(str)) return new Date(str);
    const bulanMap = {
      Januari: "Jan", Februari: "Feb", Maret: "Mar", April: "Apr",
      Mei: "May", Juni: "Jun", Juli: "Jul", Agustus: "Aug",
      September: "Sep", Oktober: "Oct", November: "Nov", Desember: "Dec",
    };
    const parts = str.split(" ");
    if (parts.length === 3) {
      const [tgl, bln, thn] = parts;
      const blnEng = bulanMap[bln] || bln;
      return new Date(`${tgl} ${blnEng} ${thn}`);
    }
    return new Date(str);
  };

  // Filter students based on the search term (only by name)
  const filteredStudents = students
    .filter((s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // First sort by name, then by tanggalLahir
      // Sort by name
      if (nameSortOrder === "asc") {
        if (a.nama < b.nama) return -1;
        if (a.nama > b.nama) return 1;
      } else {
        if (a.nama < b.nama) return 1;
        if (a.nama > b.nama) return -1;
      }

      // If names are the same, sort by tanggalLahir
      const dateA = parseDate(a.tanggalLahir);
      const dateB = parseDate(b.tanggalLahir);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // Toggle sort order for nama
  const handleNameSortToggle = () => {
    setNameSortOrder(nameSortOrder === "asc" ? "desc" : "asc");
  };

  // Toggle sort order for tanggalLahir
  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Cari nama..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full text-sm"
      />
      
      {/* Table with Sortable Columns */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th
              className="border p-2 cursor-pointer"
              onClick={handleNameSortToggle}
            >
              Nama {nameSortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th className="border p-2">NIS</th>
            <th className="border p-2">NISN</th>
            <th
              className="border p-2 cursor-pointer"
              onClick={handleSortToggle}
            >
              Tanggal Lahir {sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th className="border p-2">Keterangan</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.nama}</td>
                <td className="border p-2">{s.nis}</td>
                <td className="border p-2">{s.nisn}</td>
                <td className="border p-2">{s.tanggalLahir}</td>
                <td className="border p-2">{s.keterangan}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => onEdit(s)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-2">
                Tidak ada data ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DaftarSiswa;
