import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [user, setUser] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/getme", {
          withCredentials: true
        });
        
        setUser(response.data);
        // You need to set this based on your backend response
        // This should come from your API
        setProfileCompleted(response.data.profileCompleted || false);
      } catch (error) {
        // User is not logged in
        setUser(null);
        setProfileCompleted(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // REMOVED THE AUTO-NAVIGATION useEffect
  // Now users will stay on home page and see appropriate options

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                HealthCare
              </span>
            </div>
            <div className="flex items-center gap-4">
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-lg font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
                  >
                    Register
                  </Link>
                </>
              )}
              
              {/* Show different options based on profile completion */}
              {user && !profileCompleted && (
                <>
                  <span className="text-amber-600 text-sm font-medium">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    Profile Incomplete
                  </span>
                  <Link
                    to="/profile/complete"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
                  >
                    Complete Profile
                  </Link>
                </>
              )}
              
              {user && profileCompleted && (
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              HealthCare
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Your trusted platform for healthcare management. Connect with doctors, 
            manage appointments, and access your medical records all in one place.
          </p>

          {/* Personalized greeting for logged in users */}
          {user && (
            <div className="mb-8">
              <p className="text-2xl text-gray-800">
                Welcome back, <span className="font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">{user.name}</span>!
              </p>
            </div>
          )}

          {/* Call to Action - Shows different options based on status */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:opacity-90 transform hover:scale-105 transition-all shadow-lg"
                >
                  Get Started
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-white text-gray-700 hover:bg-gray-50 transform hover:scale-105 transition-all shadow-lg border border-gray-200"
                >
                  Learn More
                </Link>
              </>
            )}
            
            {user && !profileCompleted && (
              <>
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transform hover:scale-105 transition-all shadow-lg"
                >
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  Complete Your Profile
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-white text-gray-700 hover:bg-gray-50 transform hover:scale-105 transition-all shadow-lg border border-gray-200"
                >
                  Learn More
                </Link>
              </>
            )}
            
            {user && profileCompleted && (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:opacity-90 transform hover:scale-105 transition-all shadow-lg"
                >
                  Go to Dashboard
                  <i className="fas fa-tachometer-alt ml-2"></i>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-white text-gray-700 hover:bg-gray-50 transform hover:scale-105 transition-all shadow-lg border border-gray-200"
                >
                  Learn More
                </Link>
              </>
            )}
          </div>

          {/* Warning message for incomplete profile */}
          {user && !profileCompleted && (
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl inline-block">
              <p className="text-amber-700">
                <i className="fas fa-info-circle mr-2"></i>
                Your profile is incomplete. Please complete it to access all features.
              </p>
            </div>
          )}
        </div>

        {/* Features Section - Always visible */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-user-md text-teal-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Doctors</h3>
            <p className="text-gray-600">Connect with qualified healthcare professionals in your area</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-calendar-check text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Appointments</h3>
            <p className="text-gray-600">Book and manage appointments with just a few clicks</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-file-medical text-indigo-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Medical Records</h3>
            <p className="text-gray-600">Access your health records securely anytime, anywhere</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-clock text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Round-the-clock assistance for all your healthcare needs</p>
          </div>
        </div>

        {/* Statistics Section - Always visible */}
        <div className="mt-32 bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                10,000+
              </div>
              <p className="text-gray-600">Active Patients</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-gray-600">Healthcare Providers</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                50,000+
              </div>
              <p className="text-gray-600">Appointments Completed</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-lg border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2024 HealthCare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;