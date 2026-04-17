import { useState } from "react";
import axios from "axios"
import { useEffect } from "react";

const DoctorHome = () => {
    const [doctordetails, setDoctordetails] = useState(null);
    const [facilities, setFacilities] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDiagnosis, setExpandedDiagnosis] = useState(null);
    
    // New Diagnosis State
    const [showNewDiagnosis, setShowNewDiagnosis] = useState(false);
    const [patientId, setPatientId] = useState("");
    const [patientData, setPatientData] = useState(null);
    const [patientVerified, setPatientVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    
    // Diagnosis Form State
    const [newDiagnosis, setNewDiagnosis] = useState({
        patientid: "",
        facilityid: "",
        reason: "",
        precaution: "",
        conditions: [],
        medicines: [],
        tests: []
    });

    // Form input states
    const [currentCondition, setCurrentCondition] = useState("");
    const [currentMedicine, setCurrentMedicine] = useState({
        name: "",
        dosage: "",
        frequency: "",
        duration: ""
    });
    const [currentTest, setCurrentTest] = useState({
        type: "",
        testid: ""
    });

    useEffect(() => {
        const getDocDetails = async () => {
            try {
                const doctordet = await axios.get('http://localhost:3000/doctor/getdoctor', { withCredentials: true });
                const facilitydet = await axios.get('http://localhost:3000/doctor/getfacilities', { withCredentials: true });
                const diagnosisdet = await axios.get('http://localhost:3000/doctor/getdiagnosis', { withCredentials: true });
                
                setDoctordetails(doctordet.data);
                setFacilities(facilitydet.data);
                setDiagnoses(diagnosisdet.data);
                
                console.log("Doctor Details:", doctordet.data);
                console.log("Facilities:", facilitydet.data);
                console.log("Diagnoses:", diagnosisdet.data);
            } catch (error) {
                console.log("Error fetching doctor data", error);
            } finally {
                setLoading(false);
            }
        };
        getDocDetails();
    }, []);

    const toggleDiagnosis = (index) => {
        if (expandedDiagnosis === index) {
            setExpandedDiagnosis(null);
        } else {
            setExpandedDiagnosis(index);
        }
    };

    // Verify Patient
    const verifyPatient = async () => {
        if (!patientId.trim()) return;
        
        setVerifying(true);
        try {
            const response = await axios.get(`http://localhost:3000/patient/verify`, {
                params: { userid: patientId },
                withCredentials: true
            });
            
            if (response.data.exists) {
                setPatientVerified(true);
                setPatientData(response.data.patient);
                setNewDiagnosis(prev => ({ ...prev, patientid: patientId }));
            } else {
                alert("Patient not found");
            }
        } catch (error) {
            console.error("Error verifying patient:", error);
            alert("Error verifying patient");
        } finally {
            setVerifying(false);
        }
    };

    // Add Condition
    const addCondition = () => {
        if (currentCondition.trim()) {
            setNewDiagnosis(prev => ({
                ...prev,
                conditions: [...prev.conditions, currentCondition.trim()]
            }));
            setCurrentCondition("");
        }
    };

    const removeCondition = (index) => {
        setNewDiagnosis(prev => ({
            ...prev,
            conditions: prev.conditions.filter((_, i) => i !== index)
        }));
    };

    // Add Medicine
    const addMedicine = () => {
        if (currentMedicine.name && currentMedicine.dosage && currentMedicine.frequency && currentMedicine.duration) {
            setNewDiagnosis(prev => ({
                ...prev,
                medicines: [...prev.medicines, { ...currentMedicine, purchased: false }]
            }));
            setCurrentMedicine({ name: "", dosage: "", frequency: "", duration: "" });
        } else {
            alert("Please fill all medicine fields");
        }
    };

    const removeMedicine = (index) => {
        setNewDiagnosis(prev => ({
            ...prev,
            medicines: prev.medicines.filter((_, i) => i !== index)
        }));
    };

    // Add Test
    const addTest = () => {
        if (currentTest.type) {
            setNewDiagnosis(prev => ({
                ...prev,
                tests: [...prev.tests, { ...currentTest }]
            }));
            setCurrentTest({ type: "", testid: "" });
        } else {
            alert("Please enter test type");
        }
    };

    const removeTest = (index) => {
        setNewDiagnosis(prev => ({
            ...prev,
            tests: prev.tests.filter((_, i) => i !== index)
        }));
    };

    // Submit Diagnosis
    const submitDiagnosis = async () => {
        // Validate required fields
        if (!newDiagnosis.reason) {
            alert("Please enter reason for visit");
            return;
        }
        if (!newDiagnosis.precaution) {
            alert("Please enter precautions");
            return;
        }
        if (newDiagnosis.conditions.length === 0) {
            alert("Please add at least one condition");
            return;
        }

        try {
            const diagnosisData = {
                patientid: newDiagnosis.patientid,
                doctorid: doctordetails?.userid,
                facilityid: newDiagnosis.facilityid || null,
                conditions: newDiagnosis.conditions,
                reason: newDiagnosis.reason,
                precaution: newDiagnosis.precaution,
                medicines: newDiagnosis.medicines,
                tests: newDiagnosis.tests
            };

            const response = await axios.post('http://localhost:3000/diagnosis/setdiagnosis', diagnosisData, {
                withCredentials: true
            });

            if (response.data.success) {
                alert("Diagnosis added successfully!");
                // Reset form
                setShowNewDiagnosis(false);
                setPatientVerified(false);
                setPatientId("");
                setPatientData(null);
                setNewDiagnosis({
                    patientid: "",
                    facilityid: "",
                    reason: "",
                    precaution: "",
                    conditions: [],
                    medicines: [],
                    tests: []
                });
                // Refresh diagnoses list
                const diagnosisdet = await axios.get('http://localhost:3000/doctor/getdiagnosis', { withCredentials: true });
                setDiagnoses(diagnosisdet.data);
            } else {
                alert(response.data.message || "Error submitting diagnosis");
            }
        } catch (error) {
            console.error("Error submitting diagnosis:", error);
            alert(error.response?.data?.message || "Error submitting diagnosis");
        }
    };

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
                            <span className="text-gray-700 px-3 py-2">
                                <i className="fas fa-user-md text-teal-600 mr-2"></i>
                                Dr. {doctordetails?.userid}
                            </span>
                            <button 
                                onClick={async () => {
                                    await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
                                    window.location.href = '/';
                                }}
                                className="text-gray-700 hover:text-teal-600 px-3 py-2"
                            >
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section with Add Diagnosis Button */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Dr. {doctordetails?.userid}</span>
                        </h1>
                        <p className="text-gray-600 mt-2">{doctordetails?.specialization} • License: {doctordetails?.license}</p>
                    </div>
                    <button
                        onClick={() => setShowNewDiagnosis(!showNewDiagnosis)}
                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
                    >
                        <i className="fas fa-plus-circle"></i>
                        {showNewDiagnosis ? "Cancel" : "New Diagnosis"}
                    </button>
                </div>

                {/* New Diagnosis Form */}
                {showNewDiagnosis && (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                            <i className="fas fa-notes-medical text-teal-600"></i>
                            Add New Diagnosis
                        </h2>

                        {/* Patient Verification */}
                        {!patientVerified ? (
                            <div className="bg-blue-50 rounded-xl p-6 mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter Patient User ID
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={patientId}
                                        onChange={(e) => setPatientId(e.target.value)}
                                        placeholder="e.g., patient123"
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                                    />
                                    <button
                                        onClick={verifyPatient}
                                        disabled={verifying}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                                    >
                                        {verifying ? "Verifying..." : "Verify Patient"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Verified Patient Banner */}
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <i className="fas fa-check-circle text-green-600"></i>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Patient Verified</p>
                                                <p className="font-semibold text-gray-800">ID: {patientId}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setPatientVerified(false);
                                                setPatientId("");
                                                setPatientData(null);
                                            }}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>

                                    {/* Patient Details Card */}
                                    {patientData && (
                                        <div className="bg-white rounded-lg p-4 mt-2">
                                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                <i className="fas fa-user-circle text-teal-600"></i>
                                                Patient Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">User ID</p>
                                                    <p className="text-sm font-medium text-gray-800">{patientData.userid}</p>
                                                </div>
                                                {patientData.age && (
                                                    <div>
                                                        <p className="text-xs text-gray-500">Age</p>
                                                        <p className="text-sm font-medium text-gray-800">{patientData.age}</p>
                                                    </div>
                                                )}
                                                {patientData.gender && (
                                                    <div>
                                                        <p className="text-xs text-gray-500">Gender</p>
                                                        <p className="text-sm font-medium text-gray-800">{patientData.gender}</p>
                                                    </div>
                                                )}
                                                {patientData.bloodg && (
                                                    <div>
                                                        <p className="text-xs text-gray-500">Blood Group</p>
                                                        <p className="text-sm font-medium text-gray-800">{patientData.bloodg}</p>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {patientData.allergies && patientData.allergies.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-xs text-gray-500 mb-1">Known Allergies</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {patientData.allergies.map((allergy, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                                                <i className="fas fa-allergies mr-1"></i>
                                                                {allergy}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Facility Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Facility (Optional)
                                    </label>
                                    <select
                                        value={newDiagnosis.facilityid}
                                        onChange={(e) => setNewDiagnosis(prev => ({ ...prev, facilityid: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none bg-white"
                                    >
                                        <option value="">No Facility</option>
                                        {facilities.map((facility, index) => (
                                            <option key={index} value={facility.userid}>
                                                {facility.address}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Reason for Visit */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for Visit <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={newDiagnosis.reason}
                                        onChange={(e) => setNewDiagnosis(prev => ({ ...prev, reason: e.target.value }))}
                                        rows="2"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none"
                                        placeholder="Why is the patient visiting?"
                                        required
                                    />
                                </div>

                                {/* Conditions */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Conditions Diagnosed <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={currentCondition}
                                            onChange={(e) => setCurrentCondition(e.target.value)}
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none"
                                            placeholder="e.g., Hypertension"
                                        />
                                        <button
                                            type="button"
                                            onClick={addCondition}
                                            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {newDiagnosis.conditions.map((condition, index) => (
                                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                                                {condition}
                                                <button onClick={() => removeCondition(index)} className="text-purple-700 hover:text-purple-900">
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Precautions */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Precautions <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={newDiagnosis.precaution}
                                        onChange={(e) => setNewDiagnosis(prev => ({ ...prev, precaution: e.target.value }))}
                                        rows="2"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none"
                                        placeholder="Precautions to take"
                                        required
                                    />
                                </div>

                                {/* Medicines */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prescribed Medicines
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Medicine name"
                                            value={currentMedicine.name}
                                            onChange={(e) => setCurrentMedicine(prev => ({ ...prev, name: e.target.value }))}
                                            className="col-span-2 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Dosage"
                                            value={currentMedicine.dosage}
                                            onChange={(e) => setCurrentMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                                            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Frequency"
                                            value={currentMedicine.frequency}
                                            onChange={(e) => setCurrentMedicine(prev => ({ ...prev, frequency: e.target.value }))}
                                            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Duration"
                                            value={currentMedicine.duration}
                                            onChange={(e) => setCurrentMedicine(prev => ({ ...prev, duration: e.target.value }))}
                                            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addMedicine}
                                        className="mb-3 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
                                    >
                                        Add Medicine
                                    </button>
                                    <div className="space-y-2">
                                        {newDiagnosis.medicines.map((medicine, index) => (
                                            <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
                                                <div className="flex gap-4 text-sm">
                                                    <span className="font-medium">{medicine.name}</span>
                                                    <span className="text-gray-600">{medicine.dosage}</span>
                                                    <span className="text-gray-600">{medicine.frequency}</span>
                                                    <span className="text-gray-600">{medicine.duration}</span>
                                                </div>
                                                <button onClick={() => removeMedicine(index)} className="text-red-500 hover:text-red-700">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tests */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Recommended Tests
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Test type"
                                            value={currentTest.type}
                                            onChange={(e) => setCurrentTest(prev => ({ ...prev, type: e.target.value }))}
                                            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Test ID (optional)"
                                            value={currentTest.testid}
                                            onChange={(e) => setCurrentTest(prev => ({ ...prev, testid: e.target.value }))}
                                            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTest}
                                            className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all"
                                        >
                                            Add Test
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {newDiagnosis.tests.map((test, index) => (
                                            <div key={index} className="flex items-center justify-between bg-amber-50 p-3 rounded-xl">
                                                <div className="flex gap-4">
                                                    <span className="font-medium">{test.type}</span>
                                                    {test.testid && <span className="text-gray-600">ID: {test.testid}</span>}
                                                </div>
                                                <button onClick={() => removeTest(index)} className="text-red-500 hover:text-red-700">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => {
                                            setShowNewDiagnosis(false);
                                            setPatientVerified(false);
                                            setPatientId("");
                                            setPatientData(null);
                                        }}
                                        className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submitDiagnosis}
                                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
                                    >
                                        Submit Diagnosis
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Doctor Profile Card */}
                {doctordetails && (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <i className="fas fa-user-md text-teal-600"></i>
                                Your Profile
                            </h2>
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                                Active
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-xl border border-teal-100">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</label>
                                <p className="text-lg font-semibold text-gray-800 mt-1">{doctordetails.userid}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</label>
                                <p className="text-lg font-semibold text-gray-800 mt-1">{doctordetails.specialization}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">License</label>
                                <p className="text-lg font-semibold text-gray-800 mt-1">{doctordetails.license}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Facilities Section */}
                {facilities.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                            <i className="fas fa-hospital text-blue-600"></i>
                            Associated Facilities ({facilities.length})
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {facilities.map((facility, index) => (
                                <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-5 hover:shadow-lg transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-semibold text-gray-800">Facility ID: {facility.userid}</h3>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <p className="text-gray-600 flex items-start gap-2">
                                            <i className="fas fa-map-marker-alt text-blue-500 mt-1 text-sm"></i>
                                            <span>{facility.address}</span>
                                        </p>
                                        
                                        {facility.doctors && facility.doctors.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Doctors at this facility:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {facility.doctors.map((doctor, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-white text-gray-700 rounded-full text-xs border border-gray-200">
                                                            {doctor}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Diagnoses Section */}
                {diagnoses.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                            <i className="fas fa-notes-medical text-purple-600"></i>
                            Your Diagnoses ({diagnoses.length})
                        </h2>
                        
                        <div className="space-y-4">
                            {diagnoses.map((diagnosis, index) => (
                                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-gray-50 to-white p-4 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
                                        onClick={() => toggleDiagnosis(index)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <i className={`fas fa-chevron-${expandedDiagnosis === index ? 'down' : 'right'} text-gray-400`}></i>
                                            <div>
                                                <p className="font-semibold text-gray-800">Patient: {diagnosis.patientid}</p>
                                                <p className="text-sm text-gray-600">Reason: {diagnosis.reason}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(diagnosis.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    {expandedDiagnosis === index && (
                                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                                            {/* Conditions */}
                                            {diagnosis.conditions?.length > 0 && (
                                                <div className="mb-3">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Conditions:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {diagnosis.conditions.map((condition, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                                                {condition}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Precautions */}
                                            {diagnosis.precaution && (
                                                <div className="mb-3">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Precautions:</p>
                                                    <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">{diagnosis.precaution}</p>
                                                </div>
                                            )}
                                            
                                            {/* Medicines */}
                                            {diagnosis.medicines?.length > 0 && (
                                                <div className="mb-3">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Prescribed Medicines:</p>
                                                    <div className="space-y-2">
                                                        {diagnosis.medicines.map((medicine, idx) => (
                                                            <div key={idx} className="bg-white p-2 rounded-lg text-sm">
                                                                <span className="font-medium">{medicine.name}</span> - {medicine.dosage}, {medicine.frequency}, {medicine.duration}
                                                                {medicine.purchased && (
                                                                    <span className="ml-2 text-green-600">(Purchased)</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Tests */}
                                            {diagnosis.tests?.length > 0 && (
                                                <div className="mb-3">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Recommended Tests:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {diagnosis.tests.map((test, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                                                                {test.type} {test.testid && `(ID: ${test.testid})`}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Facility */}
                                            {diagnosis.facilityid && (
                                                <p className="text-xs text-gray-500 mt-2">Facility ID: {diagnosis.facilityid}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty States */}
                {facilities.length === 0 && (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center mb-8">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-hospital text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Facilities Associated</h3>
                        <p className="text-gray-600">You are not currently associated with any facilities</p>
                    </div>
                )}

                {diagnoses.length === 0 && (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-notes-medical text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Diagnoses Yet</h3>
                        <p className="text-gray-600">Your diagnosis history will appear here</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorHome;