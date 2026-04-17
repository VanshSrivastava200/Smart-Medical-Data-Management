import { useState } from "react";
import axios from "axios"
import { useEffect } from "react";

const LabDashboard = () => {
    const [labdetails, setLabdetails] = useState(null);
    const [testId, setTestId] = useState("");
    const [testData, setTestData] = useState(null);
    const [completedHistory, setCompletedHistory] = useState([]);
    const [searching, setSearching] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [expandedTest, setExpandedTest] = useState(null);
    const [activeTab, setActiveTab] = useState("search");
    
    // Test Results State
    const [testResults, setTestResults] = useState({
        result: "",
        notes: ""
    });

    useEffect(() => {
        const getLabDetails = async () => {
            try {
                const labdet = await axios.get('http://localhost:3000/lab/getlab', { 
                    withCredentials: true 
                });
                setLabdetails(labdet.data);
                
                // Fetch lab's completed history
                const historyRes = await axios.get('http://localhost:3000/lab/gethistory', {
                    withCredentials: true
                });
                setCompletedHistory(historyRes.data);
                
                console.log("Lab Details:", labdet.data);
                console.log("Lab History:", historyRes.data);
            } catch (error) {
                console.log("Error fetching lab data", error);
            }
        };
        getLabDetails();
    }, []);

    // Search for specific test by its _id
    const searchTest = async () => {
        if (!testId.trim()) {
            alert("Please enter Test ID");
            return;
        }

        setSearching(true);
        try {
            const response = await axios.get(`http://localhost:3000/diagnosis/gettest`, {
                params: { testId: testId },
                withCredentials: true
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                setTestData(response.data.test);
                setTestResults({
                    result: response.data.test?.result || "",
                    notes: response.data.test?.notes || ""
                });
            } else {
                alert("Test not found");
                setTestData(null);
            }
        } catch (error) {
            console.error("Error fetching test:", error);
            alert(error.response?.data?.message || "Error fetching test");
            setTestData(null);
        } finally {
            setSearching(false);
        }
    };

    // Handle result input change
    const handleResultChange = (e) => {
        const { name, value } = e.target;
        setTestResults(prev => ({ ...prev, [name]: value }));
    };

    // Upload results for the test
    const uploadTestResult = async () => {
        if (!testResults.result) {
            alert("Please enter test results");
            return;
        }

        setUploading(true);
        try {
            const uploadData = {
                testId: testData._id,
                result: testResults.result,
                notes: testResults.notes,
                labid: labdetails?.userid
            };

            const response = await axios.post('http://localhost:3000/lab/upload', uploadData, {
                withCredentials: true
            });

            if (response.data.success) {
                alert(`Results uploaded for ${testData.type} successfully!`);
                
                // Refresh completed history
                const historyRes = await axios.get('http://localhost:3000/lab/gethistory', {
                    withCredentials: true
                });
                setCompletedHistory(historyRes.data);
                
                // Clear the current test
                setTestData(null);
                setTestId("");
                setTestResults({ result: "", notes: "" });
                setActiveTab("history");
            } else {
                alert(response.data.message || "Error uploading results");
            }
        } catch (error) {
            console.error("Error uploading results:", error);
            alert(error.response?.data?.message || "Error uploading results");
        } finally {
            setUploading(false);
        }
    };

    const toggleHistoryTest = (index) => {
        if (expandedTest === index) {
            setExpandedTest(null);
        } else {
            setExpandedTest(index);
        }
    };

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
                                <i className="fas fa-flask text-amber-600 mr-2"></i>
                                Lab: {labdetails?.userid}
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
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome, <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">{labdetails?.userid}</span>
                    </h1>
                    <p className="text-gray-600 mt-2">Laboratory Dashboard</p>
                </div>

                {/* Lab Profile Card */}
                {labdetails && (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <i className="fas fa-flask text-amber-600"></i>
                                Laboratory Profile
                            </h2>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                Active
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lab ID</label>
                                <p className="text-lg font-semibold text-gray-800 mt-1">{labdetails.userid}</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-xl border border-orange-100">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</label>
                                <p className="text-lg font-semibold text-gray-800 mt-1">{labdetails.address}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("search")}
                        className={`pb-3 px-4 font-semibold transition-colors ${
                            activeTab === "search" 
                                ? "text-teal-600 border-b-2 border-teal-600" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <i className="fas fa-search mr-2"></i>
                        Upload Results
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`pb-3 px-4 font-semibold transition-colors ${
                            activeTab === "history" 
                                ? "text-teal-600 border-b-2 border-teal-600" 
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <i className="fas fa-history mr-2"></i>
                        History ({completedHistory.length})
                    </button>
                </div>

                {/* Search Tab */}
                {activeTab === "search" && (
                    <>
                        {/* Search Test Section */}
                        {!testData && (
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                                    <i className="fas fa-search text-blue-600"></i>
                                    Search Test by ID
                                </h2>
                                
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={testId}
                                        onChange={(e) => setTestId(e.target.value)}
                                        placeholder="Enter Test ID (MongoDB _id)"
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                                    />
                                    <button
                                        onClick={searchTest}
                                        disabled={searching}
                                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {searching ? "Searching..." : "Search"}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    Enter the Test ID provided by the doctor or patient
                                </p>
                            </div>
                        )}

                        {/* Test Details & Upload Section */}
                        {testData && !testData.result && (
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                                    <i className="fas fa-vial text-amber-600"></i>
                                    Upload Results for: {testData.type}
                                </h2>

                                {/* Test Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <label className="text-xs text-gray-500">Test Type</label>
                                        <p className="font-medium text-gray-800">{testData.type}</p>
                                    </div>
                                    {testData.testid && (
                                        <div>
                                            <label className="text-xs text-gray-500">Test ID</label>
                                            <p className="font-medium text-gray-800">{testData.testid}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Form */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Test Results / Report URL <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="result"
                                            value={testResults.result}
                                            onChange={handleResultChange}
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none"
                                            placeholder="Enter test results text or paste file URL here..."
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            You can either enter text results or paste a link to an uploaded file (PDF, image, etc.)
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Additional Notes (Optional)
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={testResults.notes}
                                            onChange={handleResultChange}
                                            rows="2"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none"
                                            placeholder="Any additional notes or observations..."
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            onClick={() => {
                                                setTestData(null);
                                                setTestId("");
                                                setTestResults({ result: "", notes: "" });
                                            }}
                                            className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={uploadTestResult}
                                            disabled={uploading}
                                            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                        >
                                            {uploading ? "Uploading..." : "Upload Results"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Already Completed Message */}
                        {testData && testData.result && (
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-check-circle text-3xl text-green-600"></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Test Already Completed</h3>
                                <p className="text-gray-600">This test has already been processed</p>
                                <button
                                    onClick={() => {
                                        setTestData(null);
                                        setTestId("");
                                        setTestResults({ result: "", notes: "" });
                                    }}
                                    className="mt-4 px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                                >
                                    Search Another Test
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                            <i className="fas fa-history text-green-600"></i>
                            Completed Tests History ({completedHistory.length})
                        </h2>
                        
                        {completedHistory.length > 0 ? (
                            <div className="space-y-4">
                                {completedHistory.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-gray-50 to-white p-4 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
                                            onClick={() => toggleHistoryTest(index)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <i className={`fas fa-chevron-${expandedTest === index ? 'down' : 'right'} text-gray-400`}></i>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Patient: {item.patientid}</p>
                                                    <p className="text-sm text-gray-600">Test: {item.testType}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    Completed
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {expandedTest === index && (
                                            <div className="p-4 bg-gray-50 border-t border-gray-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Diagnosis ID</p>
                                                        <p className="text-sm font-medium text-gray-800">{item.diagnosisid}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Doctor ID</p>
                                                        <p className="text-sm font-medium text-gray-800">{item.doctorid}</p>
                                                    </div>
                                                    {item.testid && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Test ID</p>
                                                            <p className="text-sm font-medium text-gray-800">{item.testid}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-3">
                                                    <p className="text-xs text-gray-500 mb-1">Test Results / Report</p>
                                                    <div className="bg-white rounded-lg p-3">
                                                        {item.result && (
                                                            <div className="mb-2">
                                                                {item.result.startsWith('http') ? (
                                                                    <a 
                                                                        href={item.result} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700"
                                                                    >
                                                                        <i className="fas fa-file-pdf"></i>
                                                                        View Report
                                                                    </a>
                                                                ) : (
                                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.result}</p>
                                                                )}
                                                            </div>
                                                        )}
                                                        {item.notes && (
                                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                                <p className="text-xs text-gray-500 mb-1">Additional Notes:</p>
                                                                <p className="text-sm text-gray-600">{item.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-flask text-3xl text-gray-400"></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Completed Tests Yet</h3>
                                <p className="text-gray-600">Uploaded test results will appear here</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default LabDashboard;