import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditExpenseModal = ({ expense, onClose, onUpdate }) => {
  const [editedExpense, setEditedExpense] = useState({
    ...expense,
    createdAt: new Date(expense.createdAt),
  });

  const handleChange = (e) => {
    setEditedExpense({ ...editedExpense, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setEditedExpense({ ...editedExpense, createdAt: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/expense/${expense.id}`,
        {
          ...editedExpense,
          createdAt: editedExpense.createdAt.toISOString(),
        }
      );
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating Expense:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
        <h3 className="text-lg font-medium text-gray-100 mb-4">Edit Expense</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="deskripsi"
            >
              Description
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="deskripsi"
              type="text"
              name="deskripsi"
              value={editedExpense.deskripsi}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              name="amount"
              value={editedExpense.amount}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="createdAt"
            >
              Date
            </label>
            <DatePicker
              selected={editedExpense.createdAt}
              onChange={handleDateChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Update
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
