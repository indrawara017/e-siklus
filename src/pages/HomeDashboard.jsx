import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import logo from "../assets/logo.png";
import logosma from "../assets/logorapor.png";
import Footer from "../components/Footer";
import CountdownTimer from "../components/CountdownTimer";
import "react-datepicker/dist/react-datepicker.css";

const HomeDashboard = () => {
    const [nisn, setNisn] = useState("");
    const [birthDate, setBirthDate] = useState({ day: "", month: "", year: "" });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [searched, setSearched] = useState(false);
    const [countdownFinished, setCountdownFinished] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (field) => (e) => {
        setBirthDate((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const formatDate = ({ day, month, year }) =>
        `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    const formatTanggal = (tgl) => {
        const date = new Date(tgl);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotFound(false);
        setSearchResults([]);
        setSearched(true);

        try {
            const q = query(collection(db, "students"), where("nisn", "==", nisn));
            const res = await getDocs(q);
            const tanggalFormatted = formatDate(birthDate);

            const matched = res.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((doc) => doc.tanggalLahir === tanggalFormatted);

            matched.length ? setSearchResults(matched) : setNotFound(true);
        } catch (err) {
            console.error("Error fetching data:", err);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCountdownFinish = () => {
        setCountdownFinished(true);
        localStorage.setItem("countdownFinished", "true");
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#e5e5e5]">
            <main className="flex-grow flex flex-col items-center justify-center p-5 max-w-3xl mx-auto w-full">
                <div className="flex flex-col items-center">
                    {!searched && <img src={logosma} alt="Logo SMA" className="h-35 -mb-5" />}
                    <img src={logo} alt="Logo e-SIKLUS" className="h-24 -mb-2" />
                </div>

                {!searchResults.length && (
                    <form
                        onSubmit={handleSearch}
                        className="space-y-4 mt-5 w-full max-w-md mx-auto"
                    >
                        <input
                            type="text"
                            className="border p-2 w-full"
                            placeholder="Masukkan NISN"
                            value={nisn}
                            onChange={(e) => setNisn(e.target.value)}
                            required
                            disabled={!countdownFinished}
                        />
                        <div className="flex gap-1">
                            {["day", "month", "year"].map((field, i) => (
                                <input
                                    key={field}
                                    type="number"
                                    placeholder={["Tanggal", "Bulan", "Tahun"][i]}
                                    value={birthDate[field]}
                                    min={field === "year" ? "1900" : "1"}
                                    max={field === "day" ? "31" : field === "month" ? "12" : undefined}
                                    onChange={handleInputChange(field)}
                                    className="border p-2 w-full sm:w-1/3"
                                    required
                                    disabled={!countdownFinished}
                                />
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="bg-[#032e87] text-white px-4 py-2 rounded w-full"
                            disabled={!countdownFinished}
                        >
                            Cek Kelulusan
                        </button>
                    </form>
                )}
                
                {!searched && !countdownFinished && (
                    <CountdownTimer
                        targetDate={new Date("2025-05-05T09:00:00+07:00")}
                        onFinish={handleCountdownFinish}
                    />
                )}

                {loading && <p>Loading...</p>}
                {notFound && (
                    <p className="text-red-500 font-medium text-sm sm:text-xs">Data tidak ditemukan.</p>
                )}

                {!!searchResults.length && (
                    <div className="space-y-4 mt-4 w-full">
                        {searchResults.map((siswa) => (
                            <div key={siswa.id} className="border p-2 rounded shadow bg-white text-sm leading-relaxed">
                                <div>
                                    <h2 className="mb-2">Dasar Penetapan Kelulusan Siswa:</h2>
                                    <ol className="list-decimal pl-4 text-justify">
                                        <li>Surat Edaran Dinas Pendidikan Pemerintah Provinsi Jawa Timur Nomor: 400.3.11/2238/101.2/2025 tanggal 16 April 2025 tentang Pengumuman Kelulusan, Penetapan Kelulusan dan Penerbitan Surat Keterangan Lulus, Ijasah, dan Transkip Nilai SMA Negeri/Swasta Tahun Pelajaran 2024/2025.</li>
                                        <li>Surat Keputusan Kepala SMA Negeri 1 Sumberasih Nomor: 421.3/056/101.6.3.12/2025 tanggal 02 Mei 2025 tentang Kriteria Kelulusan Siswa Tahun Pelajaran 2024/2025.</li>
                                        <li>Surat Keputusan Kepala SMA Negeri 1 Sumberasih Nomor: 400.3.8.1/060/101.6.3.12/2025 tanggal 05 Mei 2025 tentang Hasil Penetapan Kelulusan Siswa SMA Negeri 1 Sumberasih Tahun Pelajaran 2024/2025.</li>
                                    </ol>
                                </div>
                                <table className="mt-3 w-full text-sm border border-gray-500 bg-black text-white">
                                    <tbody>
                                        <tr>
                                            <td className="font-semibold p-2 w-1/3 text-left">NAMA SISWA</td>
                                            <td className="p-2 text-left">:</td>
                                            <td className="p-2 text-left">{siswa.nama}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold p-2 text-left">TTL</td>
                                            <td className="p-2 text-left">:</td>
                                            <td className="p-2 text-left">
                                                {siswa.tempatLahir}, {formatTanggal(siswa.tanggalLahir)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold p-2 text-left">NIS</td>
                                            <td className="p-2 text-left">:</td>
                                            <td className="p-2 text-left">{siswa.nis}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold p-2 text-left">NISN</td>
                                            <td className="p-2 text-left">:</td>
                                            <td className="p-2 text-left">{siswa.nisn}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="mt-3 text-justify">
                                    <p>Berdasarkan kriteria kelulusan, maka yang bersangkutan dinyatakan:</p>
                                    <p className={`mt-2 text-xl font-extrabold text-center ${siswa.keterangan === "LULUS" ? "text-green-600" : "text-red-600"}`}>
                                        {siswa.keterangan.split("").join(" ")}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => navigate(`/nilai/${searchResults[0].id}`)}
                                className="bg-[#032e87] text-white px-4 py-2 rounded w-full"
                            >
                                Lihat Nilai
                            </button>
                        </div>
                    </div>
                )}
                <div className="hidden md:block absolute top-2 right-2 z-50">
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-[#e5e5e5] text-[#dbdada] px-4 py-2 hover:bg-blue-700"
                    >
                        Hanya admin
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HomeDashboard;
