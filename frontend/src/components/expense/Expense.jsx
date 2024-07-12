import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Expense = () => {
  const [deskripsi, setDeskripsi] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/expenseCategories/${user.id}`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [user.id]);

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/expense`, {
        deskripsi,
        amount: parseFloat(amount),
        userId: user.id,
        categoryId: parseInt(categoryId),
        createdAt: new Date(),
      });
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="flex items-center h-screen">
      <div className="w-full mx-60 bg-gray-800 p-8 rounded-xl">
        <div className="w-full">
          <h2 className="text-3xl font-bold mb-10 text-white">
            Add New Expense
          </h2>
          <form onSubmit={addExpense}>
            <div className="flex flex-col mb-5">
              <label className="font-bold text-slate-500">Deskripsi</label>
              <input
                type="text"
                className="w-full py-3 mt-1 text-slate-100 bg-gray-700 rounded-lg px-3 focus:outline-none"
                placeholder="Expense Description"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-5">
              <label className="font-bold text-slate-500">Amount</label>
              <input
                type="number"
                className="w-full py-3 mt-1 text-slate-100 bg-gray-700 rounded-lg px-3 focus:outline-none"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-5">
              <label className="font-bold text-slate-500">Category</label>
              <select
                className="w-full py-3 mt-1 text-slate-100 bg-gray-700 rounded-lg px-3 focus:outline-none"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nama}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full mt-7 py-3 font-bold text-white bg-gray-900 hover:bg-black rounded-lg hover:shadow"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Expense;
