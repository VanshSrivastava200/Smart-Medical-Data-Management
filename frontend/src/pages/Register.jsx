import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    userid: "",
    email: "",
    password: "",
    role: "",
  });
  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post(
      "http://localhost:3000/auth/register",
      formData,
      { withCredentials: true },
    );
    console.log(res);
    navigate('/login')
    
    }catch{
      console.log("Error")
    }
  };

  const roles = [
    { value: "DOCTOR", label: "Doctor", icon: "fa-user-md", color: "blue" },
    { value: "PATIENT", label: "Patient", icon: "fa-user", color: "green" },
    { value: "NURSE", label: "Nurse", icon: "fa-user-nurse", color: "purple" },
    { value: "LAB", label: "Lab", icon: "fa-flask", color: "amber" },
    { value: "PHARMACY", label: "Pharmacy", icon: "fa-pills", color: "red" },
    { value: "FACILITY", label: "Facility", icon: "fa-pills", color: "gray" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main card */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 border border-white/20">
        {/* Header with wave decoration */}
        <div className="relative bg-gradient-to-r from-teal-600 to-blue-600 rounded-t-2xl px-8 py-6 overflow-hidden">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full"></div>
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/20 rounded-full"></div>
          <h2 className="text-3xl font-bold text-white relative">
            Create Account
          </h2>
          <p className="text-teal-100 mt-1 relative">
            Join our healthcare network
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name and Username row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-user text-teal-500"></i>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 outline-none bg-white/50"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-at text-blue-500"></i>
                Username
              </label>
              <input
                type="text"
                name="userid"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white/50"
                placeholder="johndoe123"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fas fa-envelope text-indigo-500"></i>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none bg-white/50"
              placeholder="john@example.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fas fa-lock text-purple-500"></i>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none bg-white/50"
              placeholder="••••••••"
            />
          </div>

          {/* Role Selection - Radio Buttons */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fas fa-id-badge text-amber-500"></i>
              Select Your Role
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {roles.map((role) => {
                // Define color classes based on role color
                const getColorClasses = (color) => {
                  const colorMap = {
                    blue: {
                      border: "border-blue-500",
                      bg: "bg-blue-50",
                      text: "text-blue-700",
                      badge: "bg-blue-500",
                      icon: "text-blue-500",
                    },
                    green: {
                      border: "border-green-500",
                      bg: "bg-green-50",
                      text: "text-green-700",
                      badge: "bg-green-500",
                      icon: "text-green-500",
                    },
                    purple: {
                      border: "border-purple-500",
                      bg: "bg-purple-50",
                      text: "text-purple-700",
                      badge: "bg-purple-500",
                      icon: "text-purple-500",
                    },
                    amber: {
                      border: "border-amber-500",
                      bg: "bg-amber-50",
                      text: "text-amber-700",
                      badge: "bg-amber-500",
                      icon: "text-amber-500",
                    },
                    red: {
                      border: "border-red-500",
                      bg: "bg-red-50",
                      text: "text-red-700",
                      badge: "bg-red-500",
                      icon: "text-red-500",
                    },
                  };
                  return colorMap[color] || colorMap.blue;
                };

                const colors = getColorClasses(role.color);

                return (
                  <label
                    key={role.value}
                    className={`
            relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer
            transition-all duration-200 hover:scale-105
            ${
              formData.role === role.value
                ? `${colors.border} ${colors.bg} shadow-lg`
                : "border-gray-200 bg-white/50 hover:border-gray-300"
            }
          `}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                      required
                    />
                    <i
                      className={`fas ${role.icon} text-2xl mb-2 ${colors.icon}`}
                    ></i>
                    <span
                      className={`text-sm font-medium ${
                        formData.role === role.value
                          ? colors.text
                          : "text-gray-600"
                      }`}
                    >
                      {role.label}
                    </span>
                    {formData.role === role.value && (
                      <div
                        className={`absolute -top-2 -right-2 w-5 h-5 ${colors.badge} rounded-full flex items-center justify-center`}
                      >
                        <i className="fas fa-check text-white text-xs"></i>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <i className="fas fa-user-plus"></i>
            Register Now
          </button>

          {/* Login link */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-all"
            >
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
