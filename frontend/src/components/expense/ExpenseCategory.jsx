import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const ExpenseCategory = () => {
  const [expenseNama, setExpenseNama] = useState("");
  const [expenseDeskripsi, setExpenseDeskripsi] = useState("");
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const [currentPageExpense, setCurrentPageExpense] = useState(1);
  const categoriesPerPage = 10;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseCategories();
  }, [user.id]);

  const fetchExpenseCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/expenseCategories/${user.id}`
      );
      console.log("Fetched categories:", response.data);
      setExpenseCategories(response.data);
    } catch (error) {
      console.error("Error fetching expense categories:", error);
    }
  };

  const addExpenseCat = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/expenseCategory`, {
        nama: expenseNama,
        deskripsi: expenseDeskripsi,
        userId: user.id,
      });
      fetchExpenseCategories();
      setExpenseNama("");
      setExpenseDeskripsi("");
    } catch (error) {
      console.error("Error adding expense category:", error);
    }
  };

  const editExpenseCat = async (e) => {
    e.preventDefault();
    try {
      console.log("Editing category:", editingCategory.id);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/expenseCategory/${editingCategory.id}`,
        {
          nama: expenseNama,
          deskripsi: expenseDeskripsi,
          userId: user.id,
        }
      );
      console.log("Edit response:", response.data);
      if (response.data) {
        fetchExpenseCategories();
        setEditingCategory(null);
        setExpenseNama("");
        setExpenseDeskripsi("");
      } else {
        console.error("Edit failed: No data returned");
      }
    } catch (error) {
      console.error(
        "Error editing expense category:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setExpenseNama(category.nama);
    setExpenseDeskripsi(category.deskripsi);
  };

  // Pagination logic (unchanged)
  const indexOfLastExpenseCategory = currentPageExpense * categoriesPerPage;
  const indexOfFirstExpenseCategory =
    indexOfLastExpenseCategory - categoriesPerPage;
  const currentExpenseCategories = expenseCategories.slice(
    indexOfFirstExpenseCategory,
    indexOfLastExpenseCategory
  );

  const nextPageExpense = () =>
    setCurrentPageExpense((prev) =>
      Math.min(
        prev + 1,
        Math.ceil(expenseCategories.length / categoriesPerPage)
      )
    );
  const prevPageExpense = () =>
    setCurrentPageExpense((prev) => Math.max(prev - 1, 1));
  const paginateExpense = (pageNumber) => setCurrentPageExpense(pageNumber);

  const pageNumbersExpense = [];
  for (
    let i = 1;
    i <= Math.ceil(expenseCategories.length / categoriesPerPage);
    i++
  ) {
    pageNumbersExpense.push(i);
  }

  const displayedPageNumbersExpense = pageNumbersExpense.filter(
    (number) =>
      number === 1 ||
      number === pageNumbersExpense.length ||
      (number >= currentPageExpense - 1 && number <= currentPageExpense + 1)
  );

  return (
    <div>
      <div className="flex max-w-7xl mt-16 mx-auto mb-1 bg-gray-800 p-6 rounded-xl shadow">
        <div className="w-1/2 pr-4">
          <h2 className="text-xl font-bold mb-4 text-slate-200">
            Lists Expense Categories
          </h2>
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-900 text-slate-100">
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Nama</th>
                <th className="py-2 px-4 text-left">Deskripsi</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentExpenseCategories.map((category, index) => (
                <tr key={category.id} className="bg-gray-700 text-slate-200">
                  <td className="py-2 px-4">
                    {indexOfFirstExpenseCategory + index + 1}
                  </td>
                  <td className="py-2 px-4">{category.nama}</td>
                  <td className="py-2 px-4">{category.deskripsi}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => startEditing(category)}
                      className="mr-2 px-3 py-1 text-blue-400 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={prevPageExpense}
              className={`px-4 py-2 border rounded ${
                currentPageExpense === 1
                  ? "bg-gray-800 border-none text-slate-500 cursor-not-allowed"
                  : "border-none bg-gray-900 text-white"
              }`}
              disabled={currentPageExpense === 1}
            >
              Previous
            </button>
            <div className="flex space-x-2">
              {displayedPageNumbersExpense.map((number) => (
                <button
                  key={number}
                  onClick={() => paginateExpense(number)}
                  className={`px-4 py-2 border rounded ${
                    currentPageExpense === number
                      ? "border-none bg-gray-900 text-white"
                      : "border-none bg-gray-800 text-slate-100"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
            <button
              onClick={nextPageExpense}
              className={`px-4 py-2 border rounded ${
                currentPageExpense ===
                Math.ceil(expenseCategories.length / categoriesPerPage)
                  ? "bg-gray-800 border-none text-slate-500 cursor-not-allowed"
                  : "border-none bg-gray-900 text-white"
              }`}
              disabled={
                currentPageExpense ===
                Math.ceil(expenseCategories.length / categoriesPerPage)
              }
            >
              Next
            </button>
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-xl font-bold mb-4 text-slate-100">
            {editingCategory
              ? "Edit Expense Category"
              : "Add New Expense Category"}
          </h2>
          <form onSubmit={editingCategory ? editExpenseCat : addExpenseCat}>
            <div className="flex flex-col">
              <div className="mb-5">
                <label className="font-bold text-slate-100">Nama</label>
                <input
                  type="text"
                  className="w-full py-3 mt-1 border text-white bg-gray-700 border-gray-700 rounded-lg px-3 focus:outline-none focus:border-gray-600 hover:shadow"
                  placeholder="Nama Expense Category"
                  value={expenseNama}
                  onChange={(e) => setExpenseNama(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label className="font-bold text-slate-100">Deskripsi</label>
                <input
                  type="text"
                  className="w-full py-3 mt-1 border text-white bg-gray-700 border-gray-700 rounded-lg px-3 focus:outline-none focus:border-gray-600 hover:shadow"
                  placeholder="Deskripsi Expense Category"
                  value={expenseDeskripsi}
                  onChange={(e) => setExpenseDeskripsi(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 font-bold text-white bg-gray-900 hover:bg-black rounded-lg border-gray-900 hover:shadow"
              >
                {editingCategory ? "Update Expense" : "Add Expense"}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setExpenseNama("");
                    setExpenseDeskripsi("");
                  }}
                  className="w-full mt-2 py-3 font-bold text-white bg-gray-600 hover:bg-gray-700 rounded-lg border-gray-600 hover:shadow"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCategory;
