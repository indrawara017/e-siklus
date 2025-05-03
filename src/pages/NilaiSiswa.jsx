import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import logo from "../assets/logo.png";

const NilaiSiswa = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nilai, setNilai] = useState(null);
    const [loading, setLoading] = useState(true);

    const urutanMapel = [
        { key: "agama", label: "Pendidikan Agama Islam dan Budi Pekerti" },
        { key: "ppkn", label: "Pendidikan Pancasila" },
        { key: "bahasaIndonesia", label: "Bahasa Indonesia" },
        { key: "bahasaInggris", label: "Bahasa Inggris" },
        { key: "matematika", label: "Matematika" },
        { key: "sejarah", label: "Sejarah" },
        { key: "pjok", label: "Pendidikan Jasmani Olahraga Kesehatan" },
        { key: "seniBudaya", label: "Seni Budaya" },
        { key: "prakarya", label: "Prakarya Kewirausahaan" },
    ];

    const urutanMapelPeminatan = [
        { key: "biologi", label: "Biologi" },
        { key: "fisika", label: "Fisika" },
        { key: "kimia", label: "Kimia" },
        { key: "ekonomi", label: "Ekonomi" },
        { key: "geografi", label: "Geografi" },
        { key: "sosiologi", label: "Sosiologi" },
        { key: "sejarahLanjutan", label: "Sejarah Tingkat Lanjut" },
    ];


    useEffect(() => {
        const fetchNilai = async () => {
            try {
                const docRef = doc(db, "students", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setNilai(docSnap.data());
                } else {
                    setNilai(null);
                }
            } catch (error) {
                console.error("Error fetching nilai:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNilai();
    }, [id]);

    const handleBackToHome = () => {
        navigate("/");
    };

    if (loading) return <p>Loading...</p>;

    if (!nilai) {
        return (
            <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
                <p className="text-red-600 text-lg">Data nilai tidak ditemukan.</p>
            </div>
        );
    }

    const mapelUmum = nilai.mapelUmum || {};
    const mapelPeminatan = nilai.mapelPeminatan || {};

    return (
        <div className="bg-white text-black px-6 py-1 font-serif text-[13pt] leading-relaxed" style={{ maxWidth: "794px", margin: "0 auto" }}>

            {/* Judul */}
            <div className="flex flex-col items-center mb-2">
                <img src={logo} alt="Logo e-SIKLUS" className="h-20" />
            </div>

            {/* Identitas */}
            <table className="mb-2 text-sm">
                <tbody className="text-sm">
                    <tr><td className="pr-2">NAMA SISWA</td><td>: {nilai.nama}</td></tr>
                    <tr><td>TTL</td><td>: {nilai.tempatLahir}, {nilai.tanggalLahir}</td></tr>
                    <tr><td>NIS</td><td>: {nilai.nis}</td></tr>
                    <tr><td>NISN</td><td>: {nilai.nisn}</td></tr>
                </tbody>
            </table>

            {/* Nilai */}
            <p className="mb-2 text-sm">Dengan hasil sebagai berikut:</p>
            <table className="w-full mb-4 border border-black border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-black px-2 py-1">No.</th>
                        <th className="border border-black px-2 py-1">Mata Pelajaran</th>
                        <th className="border border-black px-2 py-1">Nilai</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Mapel Umum */}
                    <tr className="bg-gray-200">
                        <td colSpan={3} className="border border-black px-2 py-1 text-left font-semibold">Mata Pelajaran Umum</td>
                    </tr>
                    {urutanMapel
                        .filter(({ key }) => mapelUmum[key] !== null && mapelUmum[key] !== undefined && mapelUmum[key] !== "")
                        .map(({ key, label }, index) => (
                            <tr key={key}>
                                <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                                <td className="border border-black px-2 py-1">{label}</td>
                                <td className="border border-black px-2 py-1 text-center">{mapelUmum[key]}</td>
                            </tr>
                        ))}
                    {/* Mapel Peminatan */}
                    <tr className="bg-gray-200">
                        <td colSpan={3} className="border border-black px-2 py-1 text-left font-semibold">Mata Pelajaran Peminatan</td>
                    </tr>
                    {urutanMapelPeminatan
                        .filter(({ key }) => mapelPeminatan[key] !== null && mapelPeminatan[key] !== undefined && mapelPeminatan[key] !== "")
                        .map(({ key, label }, index) => (
                            <tr key={`p-${key}`}>
                                <td className="border border-black px-2 py-1 text-center">
                                    {urutanMapel.filter(({ key }) => mapelUmum[key] !== null && mapelUmum[key] !== undefined && mapelUmum[key] !== "").length + index + 1}
                                </td>
                                <td className="border border-black px-2 py-1">{label}</td>
                                <td className="border border-black px-2 py-1 text-center">{mapelPeminatan[key]}</td>
                            </tr>
                        ))}
                    {/* Jumlah dan Rata-rata */}
                    <tr>
                        <td colSpan={2} className="border border-black px-2 py-1 font-semibold">Jumlah</td>
                        <td className="border border-black px-2 py-1 text-center">{nilai.jumlah}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="border border-black px-2 py-1 font-semibold">Rata-rata</td>
                        <td className="border border-black px-2 py-1 text-center">{nilai.rataRata}</td>
                    </tr>
                </tbody>
            </table>
            {/* Tombol kembali */}
            <div className="mt-1 text-left">
                {/* Catatan Kelulusan */}
                <div className="mt-6 text-sm">
                    <p><span className="font-semibold">Catatan:</span></p>
                    <p className="text-jusify">Bagi siswa yang sudah dinyatakan LULUS bisa mengambil Surat Keterangan Lulus (SKL) di SMA Negeri 1 Sumberasih pada hari Senin tanggal 12 Mei 2025 jam 09:00 WIB.</p>
                </div>
            </div>
        </div>
    );
};

export default NilaiSiswa;
