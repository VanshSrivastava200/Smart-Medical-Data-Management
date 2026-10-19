import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3000";
const CLOUD_NAME = "evf0qyxp";
const UPLOAD_PRESET = "evf0qyxp";

const LabDashboard = () => {
    const [labdetails, setLabdetails] = useState(null);
    const [testId, setTestId] = useState("");
    const [testData, setTestData] = useState(null);
    const [completedHistory, setCompletedHistory] = useState([]);
    const [searching, setSearching] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [notes, setNotes] = useState("");
    const [expandedTest, setExpandedTest] = useState(null);
    const [activeTab, setActiveTab] = useState("search");

    useEffect(() => {
        const initializeDashboard = async () => {
            try {
                const labResponse = await axios.get(`${API}/lab/getlab`, {
                    withCredentials: true,
                });
                setLabdetails(labResponse.data);

                const historyResponse = await axios.get(
                    `${API}/lab/gethistory`,
                    { withCredentials: true }
                );
                setCompletedHistory(historyResponse.data);
            } catch (error) {
                console.error("Error loading lab dashboard:", error);
            }
        };

        initializeDashboard();
    }, []);

    const fetchHistory = async () => {
        const response = await axios.get(`${API}/lab/gethistory`, {
            withCredentials: true,
        });
        setCompletedHistory(response.data);
    };

    const searchTest = async (e) => {
        e.preventDefault();

        if (!testId.trim()) {
            alert("Please enter a Test ID.");
            return;
        }

        setSearching(true);
        setTestData(null);
        setSelectedFile(null);
        setNotes("");

        try {
            const response = await axios.get(`${API}/lab/verifytest`, {
                params: { testid: testId.trim() },
                withCredentials: true,
            });

            setTestData(response.data);
        } catch (error) {
            console.error("Error searching for test:", error);
            alert(error.response?.data?.message || "Test not found.");
            setTestData(null);
        } finally {
            setSearching(false);
        }
    };

    const resetSearch = () => {
        setTestData(null);
        setTestId("");
        setSelectedFile(null);
        setNotes("");
    };

    const uploadTestResult = async (e) => {
        e.preventDefault();

        if (!testData?._id) {
            alert("Please search for a valid test first.");
            return;
        }

        if (!selectedFile) {
            alert("Please select a report file.");
            return;
        }

        if (testData.result) {
            alert("This test already has a report.");
            return;
        }

        if (
            !CLOUD_NAME ||
            CLOUD_NAME === "YOUR_CLOUD_NAME" ||
            !UPLOAD_PRESET ||
            UPLOAD_PRESET === "YOUR_UNSIGNED_UPLOAD_PRESET"
        ) {
            alert("Configure your Cloudinary cloud name and upload preset first.");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("upload_preset", UPLOAD_PRESET);

            const cloudResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
                formData
            );

            const resultUrl = cloudResponse.data.secure_url;

            if (!resultUrl) {
                throw new Error("The report URL was not returned.");
            }

            const response = await axios.post(
                `${API}/lab/upload`,
                {
                    testId: testData._id,
                    result: resultUrl,
                    notes,
                    labid: labdetails?.userid,
                },
                { withCredentials: true }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Upload failed.");
            }

            await fetchHistory();
            resetSearch();
            setActiveTab("history");
            alert("Report uploaded successfully.");
        } catch (error) {
            console.error("Report upload failed:", error);
            alert(
                error.response?.data?.message ||
                error.message ||
                "Failed to upload report."
            );
        } finally {
            setUploading(false);
        }
    };

    const navButtonClass = (tab) =>
        `border-b-2 px-1 py-4 text-sm font-semibold transition-colors ${
            activeTab === tab
                ? "border-[#8b1e2d] text-[#8b1e2d]"
                : "border-transparent text-gray-500 hover:text-[#8b1e2d]"
        }`;

    const cardClass =
        "rounded-2xl border border-[#e7e2dc] bg-white p-6 shadow-sm";

    const labelClass =
        "mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500";

    const inputClass =
        "w-full rounded-xl border border-[#ded9d3] bg-white px-4 py-3 text-sm text-[#211c1c] outline-none transition focus:border-[#8b1e2d] focus:ring-2 focus:ring-[#8b1e2d]/10";

    const primaryButtonClass =
        "rounded-xl bg-[#8b1e2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#711725] disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <div className="min-h-screen bg-[#f8f7f4] text-[#211c1c]">
            {/* Navigation */}
            <nav className="sticky top-0 z-20 border-b border-[#e7e2dc] bg-[#f8f7f4]/95 backdrop-blur">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-xl font-bold tracking-tight text-[#8b1e2d]">
                            HealthCare
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                            Medical portal
                        </p>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className="hidden text-right sm:block">
                            <p className="text-xs text-gray-500">Logged in as</p>
                            <p className="text-sm font-semibold">
                                {labdetails?.userid || "Laboratory"}
                            </p>
                        </div>

                        <button
                            onClick={async () => {
                                try {
                                    await axios.post(
                                        `${API}/auth/logout`,
                                        {},
                                        { withCredentials: true }
                                    );
                                } finally {
                                    window.location.href = "/";
                                }
                            }}
                            className="rounded-xl border border-[#e0d9d2] px-4 py-2.5 text-sm font-semibold transition hover:border-[#8b1e2d] hover:text-[#8b1e2d]"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page heading */}
                <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8b1e2d]">
                            Laboratory workspace
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Lab Dashboard
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                            Search prescribed tests, upload laboratory reports,
                            and review completed work.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-[#e7e2dc] bg-white px-4 py-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8b1e2d]/10 text-lg text-[#8b1e2d]">
                            +
                        </span>
                        <div>
                            <p className="text-xs text-gray-500">Completed reports</p>
                            <p className="text-lg font-bold">
                                {completedHistory.length}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Laboratory information */}
                {labdetails && (
                    <section className={`${cardClass} mb-8`}>
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Laboratory Profile
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Your registered laboratory information
                                </p>
                            </div>
                            <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                Active
                            </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-[#eee9e3] bg-[#faf9f7] p-4">
                                <p className={labelClass}>Laboratory ID</p>
                                <p className="break-all text-sm font-semibold">
                                    {labdetails.userid}
                                </p>
                            </div>
                            <div className="rounded-xl border border-[#eee9e3] bg-[#faf9f7] p-4">
                                <p className={labelClass}>Registered address</p>
                                <p className="text-sm font-semibold">
                                    {labdetails.address || "Not provided"}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Navigation tabs */}
                <div className="mb-6 border-b border-[#e3ddd6]">
                    <div className="flex gap-6 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("search")}
                            className={navButtonClass("search")}
                        >
                            Upload Report
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={navButtonClass("history")}
                        >
                            Completed History
                            <span className="ml-2 rounded-full bg-[#eee9e3] px-2 py-0.5 text-xs">
                                {completedHistory.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Search and upload */}
                {activeTab === "search" && (
                    <div className="space-y-6">
                        {!testData ? (
                            <section className={cardClass}>
                                <div className="mb-6">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8b1e2d]">
                                        Step 01
                                    </p>
                                    <h2 className="text-xl font-bold">
                                        Find a prescribed test
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        Enter the unique Test ID provided by the
                                        doctor to retrieve its details.
                                    </p>
                                </div>

                                <form
                                    onSubmit={searchTest}
                                    className="flex flex-col gap-3 sm:flex-row"
                                >
                                    <div className="flex-1">
                                        <label className={labelClass}>
                                            Test ID
                                        </label>
                                        <input
                                            type="text"
                                            value={testId}
                                            onChange={(e) => setTestId(e.target.value)}
                                            placeholder="Enter the patient's Test ID"
                                            className={inputClass}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={searching}
                                        className={`${primaryButtonClass} self-end`}
                                    >
                                        {searching ? "Searching..." : "Search Test"}
                                    </button>
                                </form>
                            </section>
                        ) : (
                            <section className={cardClass}>
                                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8b1e2d]">
                                            Step 02
                                        </p>
                                        <h2 className="text-xl font-bold">
                                            Test Information
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Verify the test details before uploading
                                            its report.
                                        </p>
                                    </div>

                                    <button
                                        onClick={resetSearch}
                                        className="rounded-xl border border-[#ded9d3] px-4 py-2.5 text-sm font-semibold hover:border-[#8b1e2d] hover:text-[#8b1e2d]"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="mb-7 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border border-[#eee9e3] bg-[#faf9f7] p-4">
                                        <p className={labelClass}>Test type</p>
                                        <p className="text-base font-bold">
                                            {testData.type}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-[#eee9e3] bg-[#faf9f7] p-4">
                                        <p className={labelClass}>Test ID</p>
                                        <p className="break-all text-sm font-semibold">
                                            {testData.testid}
                                        </p>
                                    </div>
                                </div>

                                {testData.result ? (
                                    <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                                        <p className="font-semibold text-green-800">
                                            A report has already been uploaded
                                        </p>
                                        <a
                                            href={testData.result}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-block text-sm font-semibold text-[#8b1e2d] underline"
                                        >
                                            View existing report
                                        </a>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={uploadTestResult}
                                        className="border-t border-[#eee9e3] pt-6"
                                    >
                                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8b1e2d]">
                                            Step 03
                                        </p>
                                        <h3 className="mb-5 text-lg font-bold">
                                            Upload Test Report
                                        </h3>

                                        <div className="mb-5">
                                            <label className={labelClass}>
                                                Report file
                                            </label>
                                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d9d0c8] bg-[#faf9f7] px-5 py-9 text-center transition hover:border-[#8b1e2d] hover:bg-[#8b1e2d]/[0.02]">
                                                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8b1e2d]/10 text-2xl text-[#8b1e2d]">
                                                    ↑
                                                </span>
                                                <span className="text-sm font-semibold">
                                                    {selectedFile
                                                        ? selectedFile.name
                                                        : "Choose a report from your device"}
                                                </span>
                                                <span className="mt-2 text-xs text-gray-500">
                                                    PDF or image file
                                                </span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,image/*"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        setSelectedFile(
                                                            e.target.files?.[0] || null
                                                        )
                                                    }
                                                />
                                            </label>

                                            {selectedFile && (
                                                <p className="mt-2 text-xs text-gray-500">
                                                    File size:{" "}
                                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <label className={labelClass}>
                                                Additional notes (optional)
                                            </label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={3}
                                                placeholder="Enter relevant observations..."
                                                className={inputClass}
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                onClick={resetSearch}
                                                disabled={uploading}
                                                className="rounded-xl border border-[#ded9d3] px-5 py-3 text-sm font-semibold hover:bg-[#faf9f7] disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={uploading || !selectedFile}
                                                className={primaryButtonClass}
                                            >
                                                {uploading
                                                    ? "Uploading report..."
                                                    : "Upload Report"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </section>
                        )}
                    </div>
                )}

                {/* History */}
                {activeTab === "history" && (
                    <section className={cardClass}>
                        <div className="mb-6">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8b1e2d]">
                                Lab records
                            </p>
                            <h2 className="text-xl font-bold">
                                Completed Test History
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Reports previously uploaded by this laboratory.
                            </p>
                        </div>

                        {completedHistory.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-[#ded9d3] py-12 text-center">
                                <p className="font-semibold">
                                    No completed tests yet
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Uploaded reports will appear here.
                                </p>
                                <button
                                    onClick={() => setActiveTab("search")}
                                    className="mt-5 text-sm font-semibold text-[#8b1e2d] hover:underline"
                                >
                                    Find a test
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {completedHistory.map((item, index) => (
                                    <div
                                        key={item.testid || index}
                                        className="overflow-hidden rounded-xl border border-[#e7e2dc]"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setExpandedTest(
                                                expandedTest === index ? null : index
                                            )}
                                            className="flex w-full flex-wrap items-center justify-between gap-4 p-4 text-left transition hover:bg-[#faf9f7] sm:p-5"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {item.testType}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Patient ID: {item.patientid}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Test ID: {item.testid || "N/A"}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                    Completed
                                                </span>
                                                <span className="text-gray-400">
                                                    {expandedTest === index ? "−" : "+"}
                                                </span>
                                            </div>
                                        </button>

                                        {expandedTest === index && (
                                            <div className="space-y-4 border-t border-[#e7e2dc] bg-[#faf9f7] p-4 sm:p-5">
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <p className={labelClass}>
                                                            Doctor ID
                                                        </p>
                                                        <p className="break-all text-sm font-medium">
                                                            {item.doctorid || "N/A"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className={labelClass}>
                                                            Diagnosis ID
                                                        </p>
                                                        <p className="break-all text-sm font-medium">
                                                            {item.diagnosisid || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {item.result && (
                                                    <div>
                                                        <p className={labelClass}>
                                                            Uploaded report
                                                        </p>
                                                        <a
                                                            href={item.result}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-semibold text-[#8b1e2d] underline"
                                                        >
                                                            View report
                                                        </a>
                                                    </div>
                                                )}

                                                {item.notes && (
                                                    <div>
                                                        <p className={labelClass}>
                                                            Additional notes
                                                        </p>
                                                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                                            {item.notes}
                                                        </p>
                                                    </div>
                                                )}

                                                <div>
                                                    <p className={labelClass}>
                                                        Completed date
                                                    </p>
                                                    <p className="text-sm font-medium">
                                                        {item.completedAt
                                                            ? new Date(item.completedAt).toLocaleDateString()
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default LabDashboard;