// components/EditProfileModal.js
import React, { useState } from "react";
import axios from "axios";

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    nama: user.nama,
    email: user.email,
    no_tlp: user.no_tlp,
    alamat: user.alamat,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/profile/edit`,
        {
          id: user.id,
          ...formData,
        }
      );
      onProfileUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border border-gray-700 w-96 shadow-lg rounded-md bg-gray-800">
        <h3 className="text-lg font-medium leading-6 text-gray-200 mb-4">
          Edit Profile
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="nama"
            >
              Name
            </label>
            <input
              type="text"
              name="nama"
              id="nama"
              value={formData.nama}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="no_tlp"
            >
              Phone
            </label>
            <input
              type="text"
              name="no_tlp"
              id="no_tlp"
              value={formData.no_tlp}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="alamat"
            >
              Address
            </label>
            <textarea
              name="alamat"
              id="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
