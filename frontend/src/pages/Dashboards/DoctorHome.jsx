
import { useState, useEffect } from "react";
import axios from "axios";

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

    // Original API calls preserved, including their order.
    useEffect(() => {
        const getDocDetails = async () => {
            try {
                const doctordet = await axios.get(
                    "http://localhost:3000/doctor/getdoctor",
                    { withCredentials: true }
                );

                const facilitydet = await axios.get(
                    "http://localhost:3000/doctor/getfacilities",
                    { withCredentials: true }
                );

                const diagnosisdet = await axios.get(
                    "http://localhost:3000/doctor/getdiagnosis",
                    { withCredentials: true }
                );

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
        setExpandedDiagnosis(
            expandedDiagnosis === index ? null : index
        );
    };

    // Original patient verification request preserved.
    const verifyPatient = async () => {
        if (!patientId.trim()) return;

        setVerifying(true);

        try {
            const response = await axios.get(
                "http://localhost:3000/patient/verify",
                {
                    params: { userid: patientId },
                    withCredentials: true
                }
            );

            if (response.data.exists) {
                setPatientVerified(true);
                setPatientData(response.data.patient);
                setNewDiagnosis((prev) => ({
                    ...prev,
                    patientid: patientId
                }));
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

    const addCondition = () => {
        if (currentCondition.trim()) {
            setNewDiagnosis((prev) => ({
                ...prev,
                conditions: [
                    ...prev.conditions,
                    currentCondition.trim()
                ]
            }));
            setCurrentCondition("");
        }
    };

    const removeCondition = (index) => {
        setNewDiagnosis((prev) => ({
            ...prev,
            conditions: prev.conditions.filter(
                (_, i) => i !== index
            )
        }));
    };

    const addMedicine = () => {
        if (
            currentMedicine.name &&
            currentMedicine.dosage &&
            currentMedicine.frequency &&
            currentMedicine.duration
        ) {
            setNewDiagnosis((prev) => ({
                ...prev,
                medicines: [
                    ...prev.medicines,
                    { ...currentMedicine, purchased: false }
                ]
            }));

            setCurrentMedicine({
                name: "",
                dosage: "",
                frequency: "",
                duration: ""
            });
        } else {
            alert("Please fill all medicine fields");
        }
    };

    const removeMedicine = (index) => {
        setNewDiagnosis((prev) => ({
            ...prev,
            medicines: prev.medicines.filter(
                (_, i) => i !== index
            )
        }));
    };

    const addTest = () => {
        if (currentTest.type) {
            setNewDiagnosis((prev) => ({
                ...prev,
                tests: [...prev.tests, { ...currentTest }]
            }));

            setCurrentTest({ type: "", testid: "" });
        } else {
            alert("Please enter test type");
        }
    };

    const removeTest = (index) => {
        setNewDiagnosis((prev) => ({
            ...prev,
            tests: prev.tests.filter((_, i) => i !== index)
        }));
    };

    // Original diagnosis submission and refresh requests preserved.
    const submitDiagnosis = async () => {
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

            const response = await axios.post(
                "http://localhost:3000/diagnosis/setdiagnosis",
                diagnosisData,
                { withCredentials: true }
            );

            if (response.data.success) {
                alert("Diagnosis added successfully!");

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

                const diagnosisdet = await axios.get(
                    "http://localhost:3000/doctor/getdiagnosis",
                    { withCredentials: true }
                );

                setDiagnoses(diagnosisdet.data);
            } else {
                alert(
                    response.data.message ||
                    "Error submitting diagnosis"
                );
            }
        } catch (error) {
            console.error("Error submitting diagnosis:", error);
            alert(
                error.response?.data?.message ||
                "Error submitting diagnosis"
            );
        }
    };

    // Original logout request preserved.
    const logout = async () => {
        await axios.post(
            "http://localhost:3000/auth/logout",
            {},
            { withCredentials: true }
        );

        window.location.href = "/";
    };

    const inputClass =
        "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#8b1e2d] focus:ring-2 focus:ring-[#8b1e2d]/10";

    const labelClass =
        "mb-2 block text-sm font-medium text-stone-700";

    const buttonClass =
        "rounded-xl bg-[#8b1e2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#701725] disabled:cursor-not-allowed disabled:opacity-50";

    const secondaryButtonClass =
        "rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-[#8b1e2d] hover:text-[#8b1e2d]";

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8f7f4]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-[#8b1e2d]" />
                    <p className="mt-4 text-sm text-stone-500">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f4] text-[#211c1c]">
            {/* Navigation */}
            <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#f8f7f4]/95 backdrop-blur">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
                    <a href="/" className="text-2xl font-bold tracking-tight">
                        Health<span className="text-[#8b1e2d]">Care</span>
                    </a>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold">
                                Dr. {doctordetails?.userid}
                            </p>
                            <p className="text-xs text-stone-500">
                                Doctor Dashboard
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b1e2d]/10 font-semibold text-[#8b1e2d]">
                            {String(doctordetails?.userid || "D")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <button
                            onClick={logout}
                            className={secondaryButtonClass}
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
                {/* Welcome */}
                <section className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8b1e2d]">
                            Doctor workspace
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Welcome back, Dr.{" "}
                            {doctordetails?.userid || "Doctor"}
                        </h1>

                        <p className="mt-3 text-sm text-stone-500 sm:text-base">
                            {doctordetails?.specialization ||
                                "Medical professional"}
                            {doctordetails?.license
                                ? ` · License: ${doctordetails.license}`
                                : ""}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowNewDiagnosis(!showNewDiagnosis)}
                        className={buttonClass}
                    >
                        {showNewDiagnosis ? "Close form" : "+ New diagnosis"}
                    </button>
                </section>

                {/* Overview cards */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-stone-200 bg-white p-5">
                        <p className="text-sm text-stone-500">Doctor ID</p>
                        <p className="mt-2 break-words text-xl font-bold">
                            {doctordetails?.userid || "—"}
                        </p>
                        <p className="mt-1 text-xs text-stone-400">
                            Your registered account
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-5">
                        <p className="text-sm text-stone-500">
                            Associated facilities
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {facilities.length}
                        </p>
                        <p className="mt-1 text-xs text-stone-400">
                            Facilities linked to you
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-5">
                        <p className="text-sm text-stone-500">
                            Diagnoses recorded
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {diagnoses.length}
                        </p>
                        <p className="mt-1 text-xs text-stone-400">
                            Patient diagnosis records
                        </p>
                    </div>
                </section>

                {/* New Diagnosis Form */}
                {showNewDiagnosis && (
                    <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 sm:p-8">
                        <div className="mb-7 border-b border-stone-100 pb-5">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b1e2d]">
                                Patient care
                            </p>
                            <h2 className="mt-2 text-2xl font-bold">
                                Create a diagnosis
                            </h2>
                            <p className="mt-2 text-sm text-stone-500">
                                Verify the patient before entering the diagnosis.
                            </p>
                        </div>

                        {!patientVerified ? (
                            <div className="rounded-xl bg-stone-50 p-5">
                                <label className={labelClass}>
                                    Patient user ID
                                </label>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <input
                                        type="text"
                                        value={patientId}
                                        onChange={(e) => setPatientId(e.target.value)}
                                        placeholder="Enter patient ID"
                                        className={inputClass}
                                    />

                                    <button
                                        onClick={verifyPatient}
                                        disabled={verifying}
                                        className={buttonClass}
                                    >
                                        {verifying ? "Verifying..." : "Verify patient"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Verified patient */}
                                <div className="mb-7 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                                                Patient verified
                                            </p>
                                            <h3 className="mt-1 text-lg font-bold">
                                                {patientData?.userid || patientId}
                                            </h3>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setPatientVerified(false);
                                                setPatientId("");
                                                setPatientData(null);
                                            }}
                                            className={secondaryButtonClass}
                                        >
                                            Change patient
                                        </button>
                                    </div>

                                    {patientData && (
                                        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-emerald-200 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                                            {[
                                                ["User ID", patientData.userid],
                                                ["Age", patientData.age],
                                                ["Gender", patientData.gender],
                                                ["Blood group", patientData.bloodg]
                                            ].map(([label, value]) => (
                                                <div key={label}>
                                                    <p className="text-xs text-stone-500">
                                                        {label}
                                                    </p>
                                                    <p className="mt-1 font-semibold">
                                                        {value || "—"}
                                                    </p>
                                                </div>
                                            ))}

                                            {patientData.allergies?.length > 0 && (
                                                <div className="sm:col-span-2 lg:col-span-4">
                                                    <p className="text-xs text-stone-500">
                                                        Known allergies
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {patientData.allergies.map((allergy, index) => (
                                                            <span
                                                                key={index}
                                                                className="rounded-full border border-red-200 bg-white px-3 py-1 text-sm text-red-700"
                                                            >
                                                                {allergy}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Diagnosis details */}
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>
                                            Reason for visit *
                                        </label>
                                        <textarea
                                            value={newDiagnosis.reason}
                                            onChange={(e) =>
                                                setNewDiagnosis((prev) => ({
                                                    ...prev,
                                                    reason: e.target.value
                                                }))
                                            }
                                            placeholder="Describe the reason for the visit"
                                            rows={3}
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Precautions *
                                        </label>
                                        <textarea
                                            value={newDiagnosis.precaution}
                                            onChange={(e) =>
                                                setNewDiagnosis((prev) => ({
                                                    ...prev,
                                                    precaution: e.target.value
                                                }))
                                            }
                                            placeholder="Enter precautions and advice"
                                            rows={3}
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className={labelClass}>
                                            Associated facility
                                        </label>
                                        <select
                                            value={newDiagnosis.facilityid}
                                            onChange={(e) =>
                                                setNewDiagnosis((prev) => ({
                                                    ...prev,
                                                    facilityid: e.target.value
                                                }))
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">
                                                No facility selected
                                            </option>
                                            {facilities.map((facility, index) => (
                                                <option
                                                    key={facility.userid || index}
                                                    value={facility.userid}
                                                >
                                                    {facility.userid}
                                                    {facility.address
                                                        ? ` — ${facility.address}`
                                                        : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Conditions */}
                                <div className="mt-8 border-t border-stone-100 pt-6">
                                    <h3 className="mb-4 text-lg font-bold">
                                        Conditions *
                                    </h3>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <input
                                            value={currentCondition}
                                            onChange={(e) => setCurrentCondition(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addCondition();
                                                }
                                            }}
                                            placeholder="Enter a condition"
                                            className={inputClass}
                                        />
                                        <button
                                            type="button"
                                            onClick={addCondition}
                                            className={buttonClass}
                                        >
                                            Add condition
                                        </button>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {newDiagnosis.conditions.map((condition, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-2 rounded-full bg-[#8b1e2d]/8 px-3 py-2 text-sm font-medium text-[#8b1e2d]"
                                            >
                                                {condition}
                                                <button
                                                    type="button"
                                                    onClick={() => removeCondition(index)}
                                                    className="font-bold"
                                                    aria-label={`Remove ${condition}`}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Medicines */}
                                <div className="mt-8 border-t border-stone-100 pt-6">
                                    <h3 className="mb-4 text-lg font-bold">
                                        Prescribed medicines
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        <input
                                            value={currentMedicine.name}
                                            onChange={(e) =>
                                                setCurrentMedicine((prev) => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))
                                            }
                                            placeholder="Medicine name"
                                            className={inputClass}
                                        />
                                        <input
                                            value={currentMedicine.dosage}
                                            onChange={(e) =>
                                                setCurrentMedicine((prev) => ({
                                                    ...prev,
                                                    dosage: e.target.value
                                                }))
                                            }
                                            placeholder="Dosage"
                                            className={inputClass}
                                        />
                                        <input
                                            value={currentMedicine.frequency}
                                            onChange={(e) =>
                                                setCurrentMedicine((prev) => ({
                                                    ...prev,
                                                    frequency: e.target.value
                                                }))
                                            }
                                            placeholder="Frequency"
                                            className={inputClass}
                                        />
                                        <input
                                            value={currentMedicine.duration}
                                            onChange={(e) =>
                                                setCurrentMedicine((prev) => ({
                                                    ...prev,
                                                    duration: e.target.value
                                                }))
                                            }
                                            placeholder="Duration"
                                            className={inputClass}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addMedicine}
                                        className={`${buttonClass} mt-3`}
                                    >
                                        Add medicine
                                    </button>

                                    <div className="mt-4 space-y-3">
                                        {newDiagnosis.medicines.map((medicine, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col justify-between gap-3 rounded-xl border border-stone-200 p-4 sm:flex-row sm:items-center"
                                            >
                                                <div>
                                                    <p className="font-semibold">
                                                        {medicine.name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-stone-500">
                                                        {medicine.dosage} · {medicine.frequency} · {medicine.duration}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedicine(index)}
                                                    className="self-start text-sm font-medium text-red-700 hover:underline sm:self-center"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tests */}
                                <div className="mt-8 border-t border-stone-100 pt-6">
                                    <h3 className="mb-4 text-lg font-bold">
                                        Recommended tests
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <input
                                            value={currentTest.type}
                                            onChange={(e) =>
                                                setCurrentTest((prev) => ({
                                                    ...prev,
                                                    type: e.target.value
                                                }))
                                            }
                                            placeholder="Test type"
                                            className={inputClass}
                                        />
                                        <input
                                            value={currentTest.testid}
                                            onChange={(e) =>
                                                setCurrentTest((prev) => ({
                                                    ...prev,
                                                    testid: e.target.value
                                                }))
                                            }
                                            placeholder="Test ID (optional)"
                                            className={inputClass}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addTest}
                                        className={`${buttonClass} mt-3`}
                                    >
                                        Add test
                                    </button>

                                    <div className="mt-4 space-y-3">
                                        {newDiagnosis.tests.map((test, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 p-4"
                                            >
                                                <div>
                                                    <p className="font-semibold">
                                                        {test.type}
                                                    </p>
                                                    {test.testid && (
                                                        <p className="text-sm text-stone-500">
                                                            Test ID: {test.testid}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTest(index)}
                                                    className="text-sm font-medium text-red-700 hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-stone-100 pt-6 sm:flex-row">
                                    <button
                                        onClick={() => {
                                            setShowNewDiagnosis(false);
                                            setPatientVerified(false);
                                            setPatientId("");
                                            setPatientData(null);
                                        }}
                                        className={secondaryButtonClass}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={submitDiagnosis}
                                        className={buttonClass}
                                    >
                                        Submit diagnosis
                                    </button>
                                </div>
                            </>
                        )}
                    </section>
                )}

                {/* Doctor Profile */}
                {doctordetails && (
                    <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
                        <div className="mb-6">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b1e2d]">
                                Account details
                            </p>
                            <h2 className="mt-2 text-xl font-bold">
                                Your profile
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {[
                                ["User ID", doctordetails.userid],
                                ["Specialization", doctordetails.specialization],
                                ["License", doctordetails.license]
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-xl bg-[#f8f7f4] p-4"
                                >
                                    <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                                        {label}
                                    </p>
                                    <p className="mt-2 break-words font-semibold">
                                        {value || "Not provided"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Facilities */}
                <section className="mb-8">
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b1e2d]">
                                Your network
                            </p>
                            <h2 className="mt-2 text-2xl font-bold">
                                Associated facilities
                            </h2>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-stone-600 ring-1 ring-stone-200">
                            {facilities.length}
                        </span>
                    </div>

                    {facilities.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
                            <h3 className="font-semibold">
                                No facilities associated
                            </h3>
                            <p className="mt-2 text-sm text-stone-500">
                                Your associated facilities will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {facilities.map((facility, index) => (
                                <article
                                    key={facility.userid || index}
                                    className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-stone-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#8b1e2d]/10 text-lg font-bold text-[#8b1e2d]">
                                            H
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="break-words font-bold">
                                                Facility {facility.userid}
                                            </h3>
                                            <p className="mt-2 break-words text-sm leading-6 text-stone-500">
                                                {facility.address || "No address provided"}
                                            </p>
                                        </div>
                                    </div>

                                    {facility.doctors?.length > 0 && (
                                        <div className="mt-5 border-t border-stone-100 pt-4">
                                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                                Doctors at this facility
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {facility.doctors.map((doctor, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-700"
                                                    >
                                                        {doctor}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* Diagnoses */}
                <section>
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b1e2d]">
                                Patient records
                            </p>
                            <h2 className="mt-2 text-2xl font-bold">
                                Diagnosis history
                            </h2>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-stone-600 ring-1 ring-stone-200">
                            {diagnoses.length}
                        </span>
                    </div>

                    {diagnoses.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
                            <h3 className="font-semibold">
                                No diagnoses yet
                            </h3>
                            <p className="mt-2 text-sm text-stone-500">
                                Diagnoses you create will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {diagnoses.map((diagnosis, index) => (
                                <article
                                    key={index}
                                    className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleDiagnosis(index)}
                                        className="flex w-full flex-col justify-between gap-3 p-5 text-left transition hover:bg-stone-50 sm:flex-row sm:items-center"
                                    >
                                        <div className="flex min-w-0 items-start gap-3">
                                            <span className="mt-0.5 text-[#8b1e2d]">
                                                {expandedDiagnosis === index ? "−" : "+"}
                                            </span>

                                            <div className="min-w-0">
                                                <h3 className="break-words font-bold">
                                                    Patient: {diagnosis.patientid}
                                                </h3>
                                                <p className="mt-1 break-words text-sm text-stone-500">
                                                    {diagnosis.reason || "No reason provided"}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="shrink-0 text-xs text-stone-400">
                                            {diagnosis.createdAt
                                                ? new Date(diagnosis.createdAt).toLocaleDateString()
                                                : ""}
                                        </span>
                                    </button>

                                    {expandedDiagnosis === index && (
                                        <div className="border-t border-stone-100 bg-[#f8f7f4]/60 p-5 sm:p-6">
                                            {diagnosis.conditions?.length > 0 && (
                                                <div className="mb-5">
                                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                                                        Conditions
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {diagnosis.conditions.map((condition, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="rounded-full bg-[#8b1e2d]/10 px-3 py-1.5 text-sm font-medium text-[#8b1e2d]"
                                                            >
                                                                {condition}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {diagnosis.precaution && (
                                                <div className="mb-5">
                                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                                                        Precautions
                                                    </p>
                                                    <p className="whitespace-pre-wrap rounded-xl bg-white p-4 text-sm leading-6 text-stone-700">
                                                        {diagnosis.precaution}
                                                    </p>
                                                </div>
                                            )}

                                            {diagnosis.medicines?.length > 0 && (
                                                <div className="mb-5">
                                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                                                        Prescribed medicines
                                                    </p>
                                                    <div className="space-y-2">
                                                        {diagnosis.medicines.map((medicine, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex flex-col justify-between gap-2 rounded-xl bg-white p-4 sm:flex-row sm:items-center"
                                                            >
                                                                <div>
                                                                    <p className="font-semibold">
                                                                        {medicine.name}
                                                                    </p>
                                                                    <p className="mt-1 text-sm text-stone-500">
                                                                        {medicine.dosage} · {medicine.frequency} · {medicine.duration}
                                                                    </p>
                                                                </div>

                                                                {medicine.purchased && (
                                                                    <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                                        Purchased
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {diagnosis.tests?.length > 0 && (
                                                <div className="mb-5">
                                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                                                        Recommended tests
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {diagnosis.tests.map((test, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
                                                            >
                                                                {test.type}
                                                                {test.testid
                                                                    ? ` · ID: ${test.testid}`
                                                                    : ""}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {diagnosis.facilityid && (
                                                <p className="border-t border-stone-200 pt-4 text-xs text-stone-500">
                                                    Facility ID: {diagnosis.facilityid}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <footer className="mt-12 border-t border-stone-200 py-6 text-center text-xs text-stone-400">
                    HealthCare · Doctor Dashboard
                </footer>
            </main>
        </div>
    );
};

export default DoctorHome;