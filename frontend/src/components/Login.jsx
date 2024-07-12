import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          emailOrPhone: emailOrPhone,
          password: password,
        }
      );
      login(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage(
        error.response ? error.response.data.error : "Login failed"
      );
    }
  };

  return (
    <div className="flex items-center h-screen w-screen bg-gray-900">
      <div className="max-w-7xl mx-auto bg-white px-8 py-4 rounded-xl shadow shadow-slate-300">
        <form onSubmit={loginUser} className="my-10">
          <div className="flex flex-col">
            <div className="mb-5">
              <label className="font-bold text-slate-700">
                Email atau No Telpon
              </label>
              <input
                type="text"
                className="w-full py-3 mt-1 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="Masukkan email atau nomor telepon Anda"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
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

            {errorMessage && (
              <div className="mb-5 text-red-500">{errorMessage}</div>
            )}

            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
