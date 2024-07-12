import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noTlp, setNoTlp] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
      nama: nama,
      alamat: alamat,
      no_tlp: noTlp,
      pekerjaan: pekerjaan,
      email: email,
      password: password,
    });

    navigate("/login");
  };

  return (
    <div className="flex items-center h-screen w-screen bg-gray-900">
      <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <form onSubmit={registerUser} className="my-10">
          <div className="flex flex-col">
            <div className="mb-5">
              <label className="font-bold text-slate-700">Nama</label>
              <input
                type="text"
                className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Masukkan nama Anda"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="font-bold text-slate-700">Alamat</label>
              <input
                type="text"
                className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Masukkan alamat Anda"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="font-bold text-slate-700">No Telpon</label>
              <input
                type="text"
                className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Masukkan nomor telepon Anda"
                value={noTlp}
                onChange={(e) => setNoTlp(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="font-bold text-slate-700">Pekerjaan</label>
              <input
                type="text"
                className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Masukkan pekerjaan Anda"
                value={pekerjaan}
                onChange={(e) => setPekerjaan(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="font-bold text-slate-700">Email</label>
              <input
                type="email"
                className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="font-bold text-slate-700">Password</label>
              <input
                type="password"
                className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow"
            >
              Daftar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
