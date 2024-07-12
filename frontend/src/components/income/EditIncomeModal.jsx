import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditIncomeModal = ({ income, onClose, onUpdate }) => {
  const [editedIncome, setEditedIncome] = useState({
    ...income,
    createdAt: new Date(income.createdAt),
  });

  const handleChange = (e) => {
    setEditedIncome({ ...editedIncome, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setEditedIncome({ ...editedIncome, createdAt: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/income/${income.id}`,
        {
          ...editedIncome,
          createdAt: editedIncome.createdAt.toISOString(),
        }
      );
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating income:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
        <h3 className="text-lg font-medium text-gray-100 mb-4">Edit Income</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="nama_pembeli"
            >
              Nama Pembeli
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nama_pembeli"
              type="text"
              name="nama_pembeli"
              value={editedIncome.nama_pembeli}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="total_pembelian"
              type="number"
              name="total_pembelian"
              value={editedIncome.total_pembelian}
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
              selected={editedIncome.createdAt}
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

export default EditIncomeModal;
