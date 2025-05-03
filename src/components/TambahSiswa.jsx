import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const TambahSiswa = ({ onStudentAdded }) => {
    const [formData, setFormData] = useState({
        nama: "",
        nis: "",
        nisn: "",
        tempatLahir: "",
        tanggalLahir: "",
        mapelUmum: {
            agama: "", ppkn: "", bahasaIndonesia: "", bahasaInggris: "",
            matematika: "", sejarah: "", pjok: "", seniBudaya: "", prakarya: ""
        },
        mapelPeminatan: {
            biologi: "", fisika: "", kimia: "", ekonomi: "",
            geografi: "", sosiologi: "", sejarahLanjutan: ""
        },
        jumlah: "",
        rataRata: "",
        sikap: "",
        keterangan: "LULUS",
    });

    const [showDatalist, setShowDatalist] = useState(false);

    const studentsRef = collection(db, "students");

    // Function to calculate total and average
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

    // Handle input change for mapelUmum and mapelPeminatan
    const handleChange = (e, type, key) => {
        let value = e.target.value;

        // Pastikan angka tidak lebih dari 100
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


    const handleAdd = async (e) => {
        e.preventDefault();

        // Validasi nilai agar tidak ada yang > 100
        const allScores = [
            ...Object.values(formData.mapelUmum),
            ...Object.values(formData.mapelPeminatan)
        ];

        if (allScores.some(score => parseFloat(score) > 100)) {
            alert("Semua nilai harus kurang dari atau sama dengan 100.");
            return;
        }

        try {
            const { total, average } = calculateScores();
            const updatedFormData = { ...formData, jumlah: total, rataRata: average };
            updatedFormData.keterangan = average >= 80 ? "LULUS" : "TIDAK LULUS";

            await addDoc(studentsRef, updatedFormData);
            onStudentAdded();

            setFormData({
                ...updatedFormData,
                nama: "", nis: "", nisn: "", tempatLahir: "", tanggalLahir: "",
                mapelUmum: Object.fromEntries(Object.keys(formData.mapelUmum).map(k => [k, ""])),
                mapelPeminatan: Object.fromEntries(Object.keys(formData.mapelPeminatan).map(k => [k, ""])),
                jumlah: "", sikap: "", keterangan: "LULUS"
            });
        } catch (error) {
            console.error("Gagal menambahkan data siswa:", error);
            alert("Terjadi kesalahan saat menambahkan data. Coba lagi.");
        }
    };

    return (
        <form onSubmit={handleAdd} className="bg-white p-1 rounded-lg shadow-lg max-w-4xl mx-auto">
            {/* Section: Data Diri */}
            <fieldset className="space-y-6 border p-6 rounded-lg">
                <legend className="text-2xl font-semibold text-gray-800">Data Diri</legend>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Nama</label>
                        <input
                            className="border p-3 w-full rounded-md"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">NIS</label>
                        <input
                            className="border p-3 w-full rounded-md"
                            value={formData.nis}
                            onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">NISN</label>
                        <input
                            className="border p-3 w-full rounded-md"
                            value={formData.nisn}
                            onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Tempat Lahir</label>
                        <input
                            className="border p-3 w-full rounded-md"
                            list="tempatLahirList"
                            value={formData.tempatLahir}
                            onFocus={() => setShowDatalist(true)}
                            onBlur={() => setTimeout(() => setShowDatalist(false), 200)}
                            onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                        />
                        {showDatalist && (
                            <datalist id="tempatLahirList">
                                <option value="SURABAYA" />
                                <option value="MALANG" />
                                <option value="BONDOWOSO" />
                                <option value="PROBOLINGGO" />
                                <option value="GRESIK" />
                                <option value="SITUBONDO" />
                                <option value="BANYUWANGI" />
                                <option value="MADIUN" />
                                <option value="NGANJUK" />
                                <option value="BLITAR" />
                                <option value="PASURUAN" />
                                <option value="MOJOKERTO" />
                                <option value="LAMONGAN" />
                                <option value="KEDIRI" />
                                <option value="SAMPANG" />
                                <option value="PAMEKASAN" />
                                <option value="SURA" />
                                <option value="JEMBER" />
                                <option value="TULUNGAGUNG" />
                                <option value="LUMAJANG" />
                                <option value="MAGETAN" />
                            </datalist>
                        )}
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Tanggal Lahir</label>
                        <input
                            type="date"
                            className="border p-3 w-full rounded-md"
                            value={formData.tanggalLahir}
                            onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                        />
                    </div>
                </div>
            </fieldset>

            {/* Section: Nilai Mapel Umum */}
            <fieldset className="space-y-6 border p-6 rounded-lg">
                <legend className="text-2xl font-semibold text-gray-800">Nilai Mapel Umum</legend>
                <div className="grid grid-cols-2 gap-6">
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
            <fieldset className="space-y-6 border p-6 rounded-lg">
                <legend className="text-2xl font-semibold text-gray-800">Nilai Mapel Peminatan</legend>
                <div className="grid grid-cols-2 gap-6">
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
            <fieldset className="space-y-6 border p-6 rounded-lg">
                <legend className="text-2xl font-semibold text-gray-800">Rekap dan Sikap</legend>
                <div className="grid grid-cols-2 gap-6">
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
                        <select
                            className="border p-3 w-full rounded-md"
                            value={formData.sikap}
                            onChange={(e) => setFormData({ ...formData, sikap: e.target.value })}
                            required
                        >
                            <option value="">Pilih Sikap</option>
                            <option value="A">A - Sangat Baik</option>
                            <option value="B">B - Baik</option>
                            <option value="C">C - Cukup</option>
                            <option value="D">D - Kurang</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Keterangan</label>
                        <input className="border p-3 w-full rounded-md" value={formData.keterangan} readOnly />
                    </div>
                </div>
            </fieldset>

            {/* Submit Button */}
            <div className="text-right mt-8">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition duration-200 ease-in-out"
                >
                    Tambah Siswa
                </button>
            </div>
        </form>
    );


};

export default TambahSiswa;
