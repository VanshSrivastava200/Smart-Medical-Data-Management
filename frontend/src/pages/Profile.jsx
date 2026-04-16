import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  let navigate=useNavigate()
  
  // Form states
  const [doctorData, setDoctorData] = useState({ specialization: "", license: "" });
  const [patientData, setPatientData] = useState({ age: "", gender: "", bloodg: "", allergies: [] });
  const [nurseData, setNurseData] = useState({ license: "" });
  const [facilityData, setFacilityData] = useState({ address: "", doctors: [] });
  const [labData, setLabData] = useState({ address: "" });
  const [pharmacyData, setPharmacyData] = useState({ address: "" });
  
  // Helper states
  const [currentAllergy, setCurrentAllergy] = useState("");
  const [currentDoctor, setCurrentDoctor] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/auth/getme", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({ ...prev, [name]: value }));
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleNurseChange = (e) => {
    const { name, value } = e.target;
    setNurseData(prev => ({ ...prev, [name]: value }));
  };

  const handleFacilityChange = (e) => {
    const { name, value } = e.target;
    setFacilityData(prev => ({ ...prev, [name]: value }));
  };

  const handleLabChange = (e) => {
    const { name, value } = e.target;
    setLabData(prev => ({ ...prev, [name]: value }));
  };

  const handlePharmacyChange = (e) => {
    const { name, value } = e.target;
    setPharmacyData(prev => ({ ...prev, [name]: value }));
  };

  const addAllergy = () => {
    if (currentAllergy.trim()) {
      setPatientData(prev => ({
        ...prev,
        allergies: [...prev.allergies, currentAllergy.trim()]
      }));
      setCurrentAllergy("");
    }
  };

  const removeAllergy = (allergy) => {
    setPatientData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addDoctor = () => {
    if (currentDoctor.trim()) {
      setFacilityData(prev => ({
        ...prev,
        doctors: [...prev.doctors, currentDoctor.trim()]
      }));
      setCurrentDoctor("");
    }
  };

  const removeDoctor = (doctor) => {
    setFacilityData(prev => ({
      ...prev,
      doctors: prev.doctors.filter(d => d !== doctor)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      let endpoint = "";
      let data = {};

      switch (user.role) {
        case "DOCTOR":
          endpoint = "doctor";
          data = { ...doctorData };
          break;
        case "PATIENT":
          endpoint = "patient";
          data = { ...patientData };
          break;
        case "NURSE":
          endpoint = "nurse";
          data = { ...nurseData };
          break;
        case "FACILITY":
          endpoint = "facility";
          data = { ...facilityData };
          break;
        case "LAB":
          endpoint = "lab";
          data = { ...labData };
          break;
        case "PHARMACY":
          endpoint = "pharmacy";
          data = { ...pharmacyData };
          break;
        default:
          return;
      }

      const res = await axios.post(
        `http://localhost:3000/profilecomplete/${endpoint}`,
        data,
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Profile completed successfully!");
        console.log("profile Completed")
        navigate('/')
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.error || "Error submitting form");
    }
  };

  const getRoleColors = () => {
    const colors = {
      DOCTOR: { bg: "from-blue-600 to-indigo-600", text: "text-blue-600", border: "border-blue-200", icon: "text-blue-500" },
      PATIENT: { bg: "from-green-600 to-teal-600", text: "text-green-600", border: "border-green-200", icon: "text-green-500" },
      NURSE: { bg: "from-purple-600 to-pink-600", text: "text-purple-600", border: "border-purple-200", icon: "text-purple-500" },
      FACILITY: { bg: "from-red-600 to-orange-600", text: "text-red-600", border: "border-red-200", icon: "text-red-500" },
      LAB: { bg: "from-amber-600 to-yellow-600", text: "text-amber-600", border: "border-amber-200", icon: "text-amber-500" },
      PHARMACY: { bg: "from-emerald-600 to-green-600", text: "text-emerald-600", border: "border-emerald-200", icon: "text-emerald-500" }
    };
    return colors[user?.role] || colors.PATIENT;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <p className="text-gray-600">Please log in to continue</p>
        </div>
      </div>
    );
  }

  const colors = getRoleColors();

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
        {/* Header with role-based gradient */}
        <div className={`relative bg-gradient-to-r ${colors.bg} rounded-t-2xl px-8 py-6 overflow-hidden`}>
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full"></div>
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/20 rounded-full"></div>
          <h2 className="text-3xl font-bold text-white relative flex items-center gap-3">
            <i className={`fas ${user.role === 'DOCTOR' ? 'fa-user-md' : 
                              user.role === 'PATIENT' ? 'fa-user' :
                              user.role === 'NURSE' ? 'fa-user-nurse' :
                              user.role === 'FACILITY' ? 'fa-hospital' :
                              user.role === 'LAB' ? 'fa-flask' : 'fa-pills'}`}>
            </i>
            Complete Your Profile
          </h2>
          <p className="text-white/90 mt-1 relative">Please provide additional information</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* User Info Card */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-id-card text-teal-500"></i>
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                <p className="text-gray-800 font-medium flex items-center gap-2 mt-1">
                  <i className="fas fa-user text-teal-500 text-sm"></i>
                  {user.name}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</label>
                <p className="text-gray-800 font-medium flex items-center gap-2 mt-1">
                  <i className="fas fa-at text-blue-500 text-sm"></i>
                  {user.userid}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                <p className="text-gray-800 font-medium flex items-center gap-2 mt-1">
                  <i className="fas fa-envelope text-indigo-500 text-sm"></i>
                  {user.email}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Role</label>
                <p className={`${colors.text} font-medium flex items-center gap-2 mt-1`}>
                  <i className={`fas ${user.role === 'DOCTOR' ? 'fa-user-md' : 
                                    user.role === 'PATIENT' ? 'fa-user' :
                                    user.role === 'NURSE' ? 'fa-user-nurse' :
                                    user.role === 'FACILITY' ? 'fa-hospital' :
                                    user.role === 'LAB' ? 'fa-flask' : 'fa-pills'} ${colors.icon}`}>
                  </i>
                  {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Role-specific forms */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <i className={`fas ${user.role === 'DOCTOR' ? 'fa-stethoscope' : 
                                user.role === 'PATIENT' ? 'fa-heart-pulse' :
                                user.role === 'NURSE' ? 'fa-hand-holding-heart' :
                                user.role === 'FACILITY' ? 'fa-building' :
                                user.role === 'LAB' ? 'fa-microscope' : 'fa-capsules'} ${colors.icon}`}>
              </i>
              {user.role === 'DOCTOR' && 'Medical Professional Details'}
              {user.role === 'PATIENT' && 'Patient Health Information'}
              {user.role === 'NURSE' && 'Nursing Credentials'}
              {user.role === 'FACILITY' && 'Facility Information'}
              {user.role === 'LAB' && 'Laboratory Information'}
              {user.role === 'PHARMACY' && 'Pharmacy Information'}
            </h3>

            {/* DOCTOR FORM */}
            {user.role === "DOCTOR" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i className="fas fa-stethoscope text-blue-500"></i>
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={doctorData.specialization}
                    onChange={handleDoctorChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white/50"
                    placeholder="e.g., Cardiologist, Neurologist"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i className="fas fa-id-card text-purple-500"></i>
                    Medical License Number
                  </label>
                  <input
                    type="text"
                    name="license"
                    value={doctorData.license}
                    onChange={handleDoctorChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none bg-white/50"
                    placeholder="e.g., MED-12345-2024"
                  />
                </div>
              </div>
            )}

            {/* PATIENT FORM */}
            {user.role === "PATIENT" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <i className="fas fa-calendar-alt text-green-500"></i>
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={patientData.age}
                      onChange={handlePatientChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <i className="fas fa-venus-mars text-pink-500"></i>
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={patientData.gender}
                      onChange={handlePatientChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200 outline-none bg-white"
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i className="fas fa-tint text-red-500"></i>
                    Blood Group
                  </label>
                  <select
                    name="bloodg"
                    value={patientData.bloodg}
                    onChange={handlePatientChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 outline-none bg-white"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i className="fas fa-allergies text-amber-500"></i>
                    Allergies
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentAllergy}
                      onChange={(e) => setCurrentAllergy(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 outline-none bg-white/50"
                      placeholder="Add an allergy"
                    />
                    <button
                      type="button"
                      onClick={addAllergy}
                      className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {patientData.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm flex items-center gap-2 shadow-sm"
                      >
                        <i className="fas fa-exclamation-circle text-xs"></i>
                        {allergy}
                        <button
                          type="button"
                          onClick={() => removeAllergy(allergy)}
                          className="text-amber-700 hover:text-amber-900 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NURSE FORM */}
            {user.role === "NURSE" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i className="fas fa-id-card text-purple-500"></i>
                  Nursing License Number
                </label>
                <input
                  type="text"
                  name="license"
                  value={nurseData.license}
                  onChange={handleNurseChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none bg-white/50"
                  placeholder="e.g., NURSE-12345-2024"
                />
              </div>
            )}

            {/* FACILITY FORM */}
            {user.role === "FACILITY" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-red-500"></i>
                    Facility Address
                  </label>
                  <textarea
                    name="address"
                    value={facilityData.address}
                    onChange={handleFacilityChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 outline-none bg-white/50"
                    placeholder="Full address of the facility"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i className="fas fa-user-md text-blue-500"></i>
                    Associated Doctors (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentDoctor}
                      onChange={(e) => setCurrentDoctor(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDoctor())}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white/50"
                      placeholder="Add doctor's userid"
                    />
                    <button
                      type="button"
                      onClick={addDoctor}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {facilityData.doctors.map((doctor, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2 shadow-sm"
                      >
                        <i className="fas fa-user-md text-xs"></i>
                        {doctor}
                        <button
                          type="button"
                          onClick={() => removeDoctor(doctor)}
                          className="text-blue-700 hover:text-blue-900 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LAB FORM */}
            {user.role === "LAB" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-amber-500"></i>
                  Lab Address
                </label>
                <textarea
                  name="address"
                  value={labData.address}
                  onChange={handleLabChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 outline-none bg-white/50"
                  placeholder="Full address of the lab"
                />
              </div>
            )}

            {/* PHARMACY FORM */}
            {user.role === "PHARMACY" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-emerald-500"></i>
                  Pharmacy Address
                </label>
                <textarea
                  name="address"
                  value={pharmacyData.address}
                  onChange={handlePharmacyChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 outline-none bg-white/50"
                  placeholder="Full address of the pharmacy"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r ${colors.bg} text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-8`}
          >
            <i className="fas fa-save"></i>
            Complete Profile
          </button>

          {/* Skip for now link */}
          <p className="text-center text-gray-600 text-sm">
            <button
              type="button"
              onClick={() => window.location.href = '/dashboard'}
              className="text-gray-500 hover:text-gray-700 hover:underline transition-all"
            >
              Skip for now
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Profile;