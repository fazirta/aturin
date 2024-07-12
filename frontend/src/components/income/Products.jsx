import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./../AuthContext";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [incomeNamaBarang, setIncomeNamaBarang] = useState("");
  const [incomeHargaBarang, setIncomeHargaBarang] = useState("");
  const [incomeDiscount, setIncomeDiscount] = useState("");
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [currentPageIncome, setCurrentPageIncome] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const categoriesPerPage = 10;

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncomeCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/incomeCategories/${user.id}`
        );
        setIncomeCategories(response.data);
      } catch (error) {
        console.error("Error fetching income categories:", error);
      }
    };
    fetchIncomeCategories();
  }, [user.id]);

  const addIncomeCat = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/incomeCategory`,
        {
          nama_barang: incomeNamaBarang,
          harga_barang: parseFloat(incomeHargaBarang),
          discount: parseFloat(incomeDiscount),
          userId: user.id,
        }
      );
      setIncomeCategories([...incomeCategories, response.data]);
      setIncomeNamaBarang("");
      setIncomeHargaBarang("");
      setIncomeDiscount("");
    } catch (error) {
      console.error("Error adding income category:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  // Get current income categories
  const indexOfLastIncomeCategory = currentPageIncome * categoriesPerPage;
  const indexOfFirstIncomeCategory =
    indexOfLastIncomeCategory - categoriesPerPage;
  const currentIncomeCategories = incomeCategories.slice(
    indexOfFirstIncomeCategory,
    indexOfLastIncomeCategory
  );

  const nextPageIncome = () =>
    setCurrentPageIncome((prev) =>
      Math.min(prev + 1, Math.ceil(incomeCategories.length / categoriesPerPage))
    );
  const prevPageIncome = () =>
    setCurrentPageIncome((prev) => Math.max(prev - 1, 1));
  const paginateIncome = (pageNumber) => setCurrentPageIncome(pageNumber);

  // Get page numbers for pagination
  const pageNumbersIncome = [];
  for (
    let i = 1;
    i <= Math.ceil(incomeCategories.length / categoriesPerPage);
    i++
  ) {
    pageNumbersIncome.push(i);
  }

  const displayedPageNumbersIncome = pageNumbersIncome.filter(
    (number) =>
      number === 1 ||
      number === pageNumbersIncome.length ||
      (number >= currentPageIncome - 1 && number <= currentPageIncome + 1)
  );

  const handleEdit = (category) => {
    setEditingCategory({ ...category });
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/incomeCategory/${id}`
        );
        setIncomeCategories(incomeCategories.filter((cat) => cat.id !== id));
      } catch (error) {
        console.error("Error deleting income category:", error);
      }
    }
  };

  const handleUpdate = async (updatedCategory) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/incomeCategory/${updatedCategory.id}`,
        updatedCategory
      );
      setIncomeCategories(
        incomeCategories.map((cat) =>
          cat.id === updatedCategory.id ? response.data : cat
        )
      );
      setEditModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating income category:", error);
    }
  };

  const EditModal = ({ isOpen, onClose, category, onUpdate }) => {
    const [editedCategory, setEditedCategory] = useState(category);

    const handleChange = (e) => {
      setEditedCategory({ ...editedCategory, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(editedCategory);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-100">
            Edit Category
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-100 mb-2">Nama Barang</label>
              <input
                type="text"
                name="nama_barang"
                value={editedCategory.nama_barang}
                onChange={handleChange}
                className="w-full py-2 px-3 text-white bg-gray-700 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-100 mb-2">Harga Barang</label>
              <input
                type="number"
                name="harga_barang"
                value={editedCategory.harga_barang}
                onChange={handleChange}
                className="w-full py-2 px-3 text-white bg-gray-700 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-100 mb-2">Stok Barang</label>
              <input
                type="number"
                name="stock_barang"
                value={editedCategory.stock_barang}
                onChange={handleChange}
                className="w-full py-2 px-3 text-white bg-gray-700 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-100 mb-2">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={editedCategory.discount}
                onChange={handleChange}
                className="w-full py-2 px-3 text-white bg-gray-700 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-500 text-white py-2 px-4 rounded"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex max-w-6xl mt-14 mx-auto mb-1 bg-gray-800 p-6 rounded-xl shadow">
      <div className="w-1/2 pr-4">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Lists Barang</h2>
        <table className="w-full mb-4">
          <thead>
            <tr className="bg-gray-900 text-gray-100">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">Barang</th>
              <th className="py-2 px-4 text-left">Harga</th>
              <th className="py-2 px-4 text-left">Discount</th>
              <th className="py-2 px-4 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentIncomeCategories.map((category, index) => (
              <tr key={category.id} className="bg-gray-700 text-gray-200">
                <td className="py-2 px-4">
                  {indexOfFirstIncomeCategory + index + 1}
                </td>
                <td className="py-2 px-4">{category.nama_barang}</td>
                <td className="py-2 px-4">{category.harga_barang}</td>
                <td className="py-2 px-4">{category.discount}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-indigo-400 py-1 px-2 rounded mr-2"
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
            onClick={prevPageIncome}
            className={`px-4 py-2 border rounded ${
              currentPageIncome === 1
                ? "bg-gray-800 border-none text-gray-500 cursor-not-allowed"
                : "border-none bg-gray-900 text-white"
            }`}
            disabled={currentPageIncome === 1}
          >
            Previous
          </button>
          <div className="flex space-x-2">
            {displayedPageNumbersIncome.map((number) => (
              <button
                key={number}
                onClick={() => paginateIncome(number)}
                className={`px-4 py-2 border rounded ${
                  currentPageIncome === number
                    ? "border-none bg-gray-900 text-white"
                    : "border-none bg-gray-800 text-gray-100"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
          <button
            onClick={nextPageIncome}
            className={`px-4 py-2 border rounded ${
              currentPageIncome ===
              Math.ceil(incomeCategories.length / categoriesPerPage)
                ? "bg-gray-800 border-none text-gray-500 cursor-not-allowed"
                : "border-none bg-gray-900 text-white"
            }`}
            disabled={
              currentPageIncome ===
              Math.ceil(incomeCategories.length / categoriesPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
      <div className="w-1/2 pl-4">
        <h2 className="text-xl font-bold mb-4 text-gray-100">Tambah Barang</h2>
        <form onSubmit={addIncomeCat}>
          <div className="flex flex-col">
            <div className="mb-5">
              <label className="font-bold text-gray-100">Nama Barang</label>
              <input
                type="text"
                className="w-full py-3 mt-1 border text-white bg-gray-700 border-gray-700 rounded-lg px-3 focus:outline-none focus:border-gray-600 hover:shadow"
                placeholder="Nama Barang"
                value={incomeNamaBarang}
                onChange={(e) => setIncomeNamaBarang(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="font-bold text-gray-100">Harga Barang</label>
              <input
                type="number"
                className="w-full py-3 mt-1 border text-white bg-gray-700 border-gray-700 rounded-lg px-3 focus:outline-none focus:border-gray-600 hover:shadow"
                placeholder="Harga Barang"
                value={incomeHargaBarang}
                onChange={(e) => setIncomeHargaBarang(e.target.value)}
              />
            </div>
            <div className="mb-10">
              <label className="font-bold text-gray-100">Diskon (%)</label>
              <input
                type="number"
                className="w-full py-3 mt-1 border text-white bg-gray-700 border-gray-700 rounded-lg px-3 focus:outline-none focus:border-gray-600 hover:shadow"
                placeholder="Diskon harga"
                value={incomeDiscount}
                onChange={(e) => setIncomeDiscount(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-gray-900 hover:bg-black rounded-lg border-gray-900 hover:shadow"
            >
              Tambah Produk
            </button>
          </div>
        </form>
      </div>

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        category={editingCategory}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default Products;
