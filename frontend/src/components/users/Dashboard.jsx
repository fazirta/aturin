import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  FaHome,
  FaRobot,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaDollarSign,
  FaChartLine,
  FaThList,
} from "react-icons/fa";
import { BiListUl } from "react-icons/bi";
import { AiOutlineProfile } from "react-icons/ai";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (location.pathname === "/dashboard") {
      navigate(`/dashboard/home`);
    }
  }, [user, navigate, location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "flex items-center p-2 rounded bg-gray-700"
      : "flex items-center p-2 rounded hover:bg-gray-700 transition-colors duration-200";
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-gray-800 text-white transition-transform duration-300 lg:relative lg:translate-x-0`}
      >
        <div className="p-5">
          <img src="/logo512.png" alt="Logo" className="w-32 mx-auto py-2" />
          <ul>
            <li className="mb-2 text-gray-500">Main Feature</li>
            <li className="mb-4 ml-5">
              <Link
                to="/dashboard/home"
                className={getLinkClass("/dashboard/home")}
              >
                <FaHome className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li className="mb-4 ml-5">
              <Link
                to="/dashboard/income"
                className={getLinkClass("/dashboard/income")}
              >
                <FaDollarSign className="mr-3" />
                Income
              </Link>
            </li>
            <li className="mb-4 ml-5">
              <Link
                to="/dashboard/expense"
                className={getLinkClass("/dashboard/expense")}
              >
                <FaChartLine className="mr-3" />
                Expense
              </Link>
            </li>
            <li className="mb-4 ml-5">
              <Link
                to="/dashboard/ai_consultant"
                className={getLinkClass("/dashboard/ai_consultant")}
              >
                <FaRobot className="mr-3" />
                AI Consultant
              </Link>
            </li>
            <li className="mt-10 mb-2 text-gray-500">User Feature</li>
            <li className="mb-4 ml-5">
              <Link
                to="/dashboard/products"
                className={getLinkClass("/dashboard/products")}
              >
                <BiListUl className="mr-3" />
                Add Products
              </Link>
            </li>
            <li className="mb-4 ml-5">
              <Link
                to="/dashboard/expense_category"
                className={getLinkClass("/dashboard/expense_category")}
              >
                <AiOutlineProfile className="mr-3" />
                Expense Category
              </Link>
            </li>
            <li className="mb-4 ml-5">
              <Link
                to="/dashboard/profile"
                className={getLinkClass("/dashboard/profile")}
              >
                <FaUser className="mr-3" />
                Profile
              </Link>
            </li>
          </ul>
        </div>
        <div className="absolute bottom-0 w-full p-5">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-2 bg-red-800 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-3" />
            Keluar
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xl"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h2 className="text-xl">Dashboard</h2>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-900">
          <div className="px-4 sm:px-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
