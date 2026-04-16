import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

  let navigate =useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const res=await axios.post("http://localhost:3000/auth/login",formData,{ withCredentials: true })
    if(!res.data.profileCompleted){
      navigate('/profile')
    }
    navigate('/')
    console.log(res)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/30">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-teal-600 to-blue-600 rounded-t-3xl px-8 py-8 overflow-hidden">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full"></div>
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-white/20 rounded-full"></div>
          
          {/* Icon */}
          <div className="relative flex justify-center mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border-2 border-white/50">
              <i className="fas fa-heartbeat text-4xl text-white"></i>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white text-center relative">Welcome Back</h2>
          <p className="text-teal-100 text-center mt-2 relative">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fas fa-envelope text-teal-500"></i>
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 outline-none bg-white/50"
                placeholder="Enter your email"
                required
              />
              <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fas fa-lock text-blue-500"></i>
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white/50"
                placeholder="Enter your password"
                required
              />
              <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <i className="fas fa-sign-in-alt"></i>
            Sign In
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-all"
            >
              Create account
            </Link>
          </p>
          
        </form>
      </div>

      
    </div>
  );
};

export default Login;