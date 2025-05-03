import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const FormEditSiswa = ({ siswa, onCancel, onUpdate }) => {
  const [formData, setFormData] = useState({
    nama: siswa.nama || "",
    nis: siswa.nis || "",
    nisn: siswa.nisn || "",
    tempatLahir: siswa.tempatLahir || "",
    tanggalLahir: siswa.tanggalLahir || "",
    mapelUmum: siswa.mapelUmum || {
      agama: "", ppkn: "", bahasaIndonesia: "", bahasaInggris: "",
      matematika: "", sejarah: "", pjok: "", seniBudaya: "", prakarya: ""
    },
    mapelPeminatan: siswa.mapelPeminatan || {
      biologi: "", fisika: "", kimia: "", ekonomi: "",
      geografi: "", sosiologi: "", sejarahLanjutan: ""
    },
    jumlah: siswa.jumlah || "",
    rataRata: siswa.rataRata || "",
    sikap: siswa.sikap || "",
    keterangan: siswa.keterangan || "LULUS",
  });

  useEffect(() => {
    setFormData({
      ...siswa
    });
  }, [siswa]);

  const calculateScores = () => {
    const allScores = [
      ...Object.values(formData.mapelUmum),
      ...Object.values(formData.mapelPeminatan)
    ];

    const total = allScores.reduce((acc, score) => acc + (parseFloat(score) || 0), 0);
    const average = allScores.filter(score => score !== "").length > 0
      ? (total / allScores.filter(score => score !== "").length).toFixed(2)
      : 0;

    return { total, average };
  };

  const handleChange = (e, type, key) => {
    let value = e.target.value;

    if (parseFloat(value) > 100) {
      alert("Nilai tidak boleh lebih dari 100");
      value = "100";
    }

    const updatedFormData = { ...formData };

    if (type === "umum") {
      updatedFormData.mapelUmum[key] = value;
    } else if (type === "peminatan") {
      updatedFormData.mapelPeminatan[key] = value;
    }

    const { total, average } = calculateScores();
    updatedFormData.jumlah = total;
    updatedFormData.rataRata = average;

    updatedFormData.keterangan = average >= 80 ? "LULUS" : "TIDAK LULUS";

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "students", siswa.id);
    const { total, average } = calculateScores();
    const updatedFormData = { ...formData, jumlah: total, rataRata: average };

    await updateDoc(docRef, updatedFormData);
    onUpdate();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto space-y-6">
      {/* Section: Data Diri */}
      <fieldset className="border p-6 rounded-lg">
        <legend className="text-2xl font-semibold text-gray-800 mb-4">Data Diri</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["nama", "nis", "nisn", "tempatLahir", "tanggalLahir"].map((field, idx) => (
            <div key={idx}>
              <label className="block mb-2 text-sm font-medium text-gray-700 capitalize">{field}</label>
              <input
                className="border p-3 w-full rounded-md"
                type={field === "tanggalLahir" ? "date" : "text"}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                required={field !== "tempatLahir"}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Section: Nilai Mapel Umum */}
      <fieldset className="border p-6 rounded-lg">
        <legend className="text-2xl font-semibold text-gray-800 mb-4">Nilai Mapel Umum</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Object.entries(formData.mapelUmum).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm mb-2 text-gray-700 capitalize">{key}</label>
              <input
                type="number"
                className="border p-3 w-full rounded-md"
                placeholder="0-100"
                min="0"
                max="100"
                value={value}
                onChange={(e) => handleChange(e, "umum", key)}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Section: Nilai Mapel Peminatan */}
      <fieldset className="border p-6 rounded-lg">
        <legend className="text-2xl font-semibold text-gray-800 mb-4">Nilai Mapel Peminatan</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Object.entries(formData.mapelPeminatan).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm mb-2 text-gray-700 capitalize">{key}</label>
              <input
                type="number"
                className="border p-3 w-full rounded-md"
                placeholder="0-100"
                min="0"
                max="100"
                value={value}
                onChange={(e) => handleChange(e, "peminatan", key)}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Section: Hasil dan Sikap */}
      <fieldset className="border p-6 rounded-lg">
        <legend className="text-2xl font-semibold text-gray-800 mb-4">Rekap dan Sikap</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Jumlah Nilai</label>
            <input
              className="border p-3 w-full rounded-md"
              type="number"
              value={formData.jumlah}
              readOnly
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Rata-rata Nilai</label>
            <input
              className="border p-3 w-full rounded-md"
              type="number"
              step="0.01"
              value={formData.rataRata}
              readOnly
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Sikap</label>
            <input
              className="border p-3 w-full rounded-md"
              value={formData.sikap}
              onChange={(e) => setFormData({ ...formData, sikap: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Keterangan</label>
            <input
              className="border p-3 w-full rounded-md"
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
            />
          </div>
        </div>
      </fieldset>

      {/* Section: Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white p-3 rounded-md"
        >
          Batal
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-md"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default FormEditSiswa;
