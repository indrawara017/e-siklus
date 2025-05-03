import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4 border-r">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-2">
        <li>
          <button
            className={`w-full text-left p-2 rounded ${activeTab === "tambah" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
            onClick={() => setActiveTab("tambah")}
          >
            Tambah Siswa
          </button>
        </li>
        <li>
          <button
            className={`w-full text-left p-2 rounded ${activeTab === "daftar" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
            onClick={() => setActiveTab("daftar")}
          >
            Daftar Siswa
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
