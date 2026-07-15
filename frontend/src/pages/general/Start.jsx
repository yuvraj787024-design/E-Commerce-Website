import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Start = () => {
  const navigate = useNavigate();
  const { darkTheme, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-all duration-700 ease-in-out ${
        darkTheme
          ? "bg-linear-to-br from-gray-950 via-gray-900 to-black"
          : "bg-linear-to-br from-orange-50 via-white to-yellow-50"
      }`}
    >
      {/* Top Right Buttons */}
      <div className="flex justify-end items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4">
        <button
          onClick={() => toggleTheme()}
          className={`px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base font-semibold shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${
            darkTheme
              ? "bg-yellow-400 text-black hover:bg-yellow-300"
              : "bg-gray-900 text-white hover:bg-black"
          }`}
        >
          {darkTheme ? "☀ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={() => navigate("/food-partner/login")}
          className="px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          Admin Login
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 lg:py-0 min-h-[calc(100vh-80px)] flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-12">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <span className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm sm:text-base font-semibold mb-5">
            🍔 Best Food Delivery
          </span>

          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight transition-all duration-700 ${
              darkTheme ? "text-white" : "text-gray-900"
            }`}
          >
            Delicious Food
            <br />
            <span className="text-orange-500">Delivered Fast</span>
          </h1>

          <p
            className={`mt-5 text-base sm:text-lg leading-7 max-w-xl mx-auto lg:mx-0 ${
              darkTheme ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Order fresh meals from your favorite restaurants. Hot, delicious,
            and delivered to your doorstep in minutes. Experience restaurant
            quality food without leaving your home.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => navigate("/user/register")}
              className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-xl transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/user/login")}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold border shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 ${
                darkTheme
                  ? "border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                  : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              Login
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-orange-500 blur-[90px] sm:blur-[120px] opacity-30 rounded-full"></div>

            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900"
              alt="Food"
              className="relative w-70 xs:w-[320px] sm:w-95 md:w-112.5 lg:w-130 xl:w-140 rounded-3xl border-4 sm:border-8 border-white shadow-2xl object-cover transition-all duration-700 hover:scale-[1.02]"
            />

            {/* Rating Card */}
            <div className="absolute top-2 left-2 sm:-top-5 sm:-left-5 bg-white rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-xl">
              <p className="text-xs sm:text-base font-bold text-gray-800">
                ⭐ 4.9 Rating
              </p>
            </div>

            {/* Delivery Card */}
            <div className="absolute bottom-2 right-2 sm:-bottom-5 sm:-right-5 bg-white rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-xl">
              <p className="text-xs sm:text-base font-bold text-gray-800">
                🚀 30 min Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;