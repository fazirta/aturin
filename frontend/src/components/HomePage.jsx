import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="bg-gray-900 text-white overflow-x-hidden overflow-y-hidden">
      <nav className="bg-gray-900 p-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <img src="/logo512.png" alt="Logo" className="w-32" />
          <div>
            <button
              onClick={handleLogin}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-lg"
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 max-w-2xl mx-auto">
          <Slider {...sliderSettings}>
            <div>
              <img
                src="images/1.png"
                alt="UMKM Financial 1"
                className="w-full h-72 object-cover rounded-lg"
              />
            </div>
            <div>
              <img
                src="images/2.png"
                alt="UMKM Financial 2"
                className="w-full h-72 object-cover rounded-lg"
              />
            </div>
            <div>
              <img
                src="images/3.png"
                alt="UMKM Financial 3"
                className="w-full h-72 object-cover rounded-lg"
              />
            </div>
          </Slider>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Kelola Keuangan UMKM Anda dengan Mudah
          </h2>
          <p className="text-lg mb-6">
            Platform keuangan terpercaya untuk usaha kecil dan menengah
          </p>
          <button
            onClick={handleRegister}
            className="bg-cyan-600 hover:bg-cyan-700 transition text-white font-bold py-3 px-6 rounded-xl text-lg"
          >
            Gabung sekarang
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <FeatureCard
            icon="📊"
            title="Laporan Realtime"
            description="Pantau keuangan Anda secara real-time dengan dashboard interaktif."
          />
          <FeatureCard
            icon="💼"
            title="Manajemen Inventori"
            description="Kelola stok dan inventori Anda dengan mudah dan efisien."
          />
          <FeatureCard
            icon="🤖"
            title="AI Consultant"
            description="Dapatkan saran keuangan cerdas dari asisten AI kami."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default HomePage;
