import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utilis/userauth";
import { useTheme } from "../../context/ThemeContext";

const UserLogin = () => {
  const navigate = useNavigate();
  const { darkTheme } = useTheme();

  // State definitions
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setLoading(true);
      const response = await api.post("/user/login", {
        email,
        password,
      });
      
      navigate("/dashboard"); // Redirect to home after login
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-all duration-700 ease-in-out ${
        darkTheme
          ? "bg-linear-to-br from-gray-950 via-gray-900 to-black"
          : "bg-linear-to-br from-orange-100 via-white to-orange-200"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl backdrop-blur-lg shadow-2xl border p-6 sm:p-8 transition-all duration-500 relative overflow-hidden ${
          darkTheme
            ? "bg-gray-900/80 border-gray-800 shadow-black/50"
            : "bg-white/80 border-white/50 hover:shadow-orange-200"
        }`}
      >
        {/* Loading Overlay State */}
        {loading && (
          <div className="absolute inset-0 bg-gray-500/50 backdrop-blur-xs flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-10 w-10 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-white font-semibold text-lg animate-pulse">Please wait...</span>
            </div>
          </div>
        )}

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold transition-colors ${darkTheme ? "text-white" : "text-gray-800"}`}>
            Welcome back
          </h1>
          <p className={`text-sm sm:text-base mt-2 transition-colors ${darkTheme ? "text-gray-400" : "text-gray-500"}`}>
            Sign in to continue your food journey.
          </p>
        </div>

        {/* Error Feedback Message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-xl font-medium border border-red-200">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className={`text-sm font-medium ${darkTheme ? "text-gray-300" : "text-gray-700"}`}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200/50 ${
                darkTheme 
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-orange-500/20" 
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className={`text-sm font-medium ${darkTheme ? "text-gray-300" : "text-gray-700"}`}>
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full rounded-xl border pl-4 pr-12 py-3 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200/50 ${
                  darkTheme 
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-orange-500/20" 
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-orange-500 transition-colors"
              >
                {showPassword ? (
                  // Eye Slash Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  // Eye Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            Sign In
          </button>
        </form>

        {/* Register Redirect */}
        <div className={`mt-6 text-center text-sm transition-colors ${darkTheme ? "text-gray-400" : "text-gray-600"}`}>
          New here?{" "}
          <Link
            to="/user/register"
            className="font-semibold text-orange-600 hover:text-orange-700 transition"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;