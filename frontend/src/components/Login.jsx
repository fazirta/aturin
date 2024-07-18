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
    <div className="bg-gray-900 flex h-screen flex-col justify-center px-6 py-12 lg:px-8 w-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src="/logo512.png" alt="Logo" className="w-32 mx-auto" />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={loginUser}>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Email atau nomor telepon
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                autocomplete="email"
                required
                className="bg-gray-800 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6 px-4"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                for="password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autocomplete="current-password"
                required
                className="bg-gray-800 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6 px-4"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Masuk
            </button>
          </div>
          <div className="flex gap-1 text-white">
            <p>Belum punya akun?</p>
            <a
              className="underline text-indigo-300 cursor-pointer"
              href="/register"
            >
              Registrasi
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
