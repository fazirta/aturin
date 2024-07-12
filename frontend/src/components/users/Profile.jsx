// components/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from ".././AuthContext";
import EditProfileModal from "./EditProfileModal";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/profile/${user.id}`
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile", error);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading)
    return (
      <div className="text-gray-100 text-xl font-semibold animate-pulse">
        Loading profile...
      </div>
    );
  if (error)
    return (
      <div className="text-red-400 bg-red-900 p-4 rounded-lg shadow-md">
        {error}
      </div>
    );
  if (!profile)
    return (
      <div className="text-gray-300 italic">No profile data available.</div>
    );

  return (
    <div className="bg-gradient-to-br bg-gray-900 text-gray-100 p-8 shadow-2xl max-w-full h-screen mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-100 pb-3">
        Profile Detail
      </h1>
      <table className="table-auto w-2/3 mb-5">
        <tbody>
          {Object.entries({
            Name: profile.nama,
            Email: profile.email,
            Phone: profile.no_tlp,
            Address: profile.alamat,
          }).map(([key, value]) => (
            <tr
              key={key}
              className="bg-gray-900 transition-all duration-300 hover:bg-gray-700"
            >
              <td className="p-3 font-bold text-gray-100 text-xl">{key}</td>
              <td className="p-3 font-bold text-gray-100 text-xl"> : </td>
              <td className="p-3 text-gray-300 text-xl">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-opacity-50"
      >
        Edit Profile
      </button>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={profile}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default Profile;
