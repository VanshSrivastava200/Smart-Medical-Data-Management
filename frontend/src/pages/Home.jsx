
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
        const response = await axios.get(
          "http://localhost:3000/auth/getme",
          { withCredentials: true }
        );

        console.log("GET /auth/getme response:", response.data);

        setUser(response.data);
        setProfileCompleted(response.data.profileCompleted || false);
      } catch (error) {
        console.error(
          "GET /auth/getme failed:",
          error.response?.status,
          error.response?.data || error.message
        );

        setUser(null);
        setProfileCompleted(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const getDashboardRoute = () => {
    if (!user) return "/login";

    switch (user.role?.toLowerCase()) {
      case "doctor":
        return "/doctordashboard";
      case "lab":
      case "laboratory":
        return "/labdashboard";
      default:
        return "/dashboard";
    }
  };

  const handlePrimaryAction = () => {
    if (!user) {
      navigate("/register");
    } else if (!profileCompleted) {
      navigate("/profile");
    } else {
      navigate(getDashboardRoute());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-[#e6d5d2] border-t-[#8b1e2d] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#211c1c]">
      {/* Navigation */}
      <nav className="border-b border-[#e8e2de] bg-[#f8f7f4]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Health<span className="text-[#8b1e2d]">Care.</span>
          </Link>

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#eee9e4]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-[#8b1e2d] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#701725]"
                >
                  Get started
                </Link>
              </>
            ) : (
              <span className="text-sm text-[#6e6562]">
                {user.name ? `Welcome, ${user.name}` : "Welcome back"}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="mx-auto max-w-7xl px-6">
        <section className="grid min-h-[570px] items-center gap-12 py-20 md:grid-cols-2">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e8d7d4] bg-[#f1e7e4] px-4 py-2 text-sm text-[#8b1e2d]">
              <span className="h-2 w-2 rounded-full bg-[#8b1e2d]" />
              Healthcare, made simpler
            </div>

            <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Better care
              <br />
              starts with
              <br />
              <span className="text-[#8b1e2d]">better access.</span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-[#746b68]">
              A simpler way to connect with healthcare professionals, manage
              appointments, and keep your medical information in one place.
            </p>

            {user && !profileCompleted && (
              <p className="mt-5 text-sm font-medium text-[#8b1e2d]">
                Complete your profile to access your healthcare services.
              </p>
            )}

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                onClick={handlePrimaryAction}
                className="rounded-full bg-[#8b1e2d] px-7 py-4 font-medium text-white transition hover:bg-[#701725]"
              >
                {!user
                  ? "Get started"
                  : !profileCompleted
                  ? "Complete your profile"
                  : "Go to dashboard"}
                <span className="ml-3">→</span>
              </button>

              <a
                href="#services"
                className="rounded-full border border-[#dcd3ce] px-7 py-4 font-medium transition hover:bg-[#eee9e4]"
              >
                Explore services
              </a>
            </div>
          </div>

          {/* Visual panel */}
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-[#e8d7d4] blur-2xl" />
            <div className="relative rounded-[2rem] bg-[#8b1e2d] p-8 text-white shadow-xl sm:p-12">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/70">Your health, organized</p>
                  <h2 className="mt-3 text-3xl font-semibold">
                    Care in one place.
                  </h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                  +
                </div>
              </div>

              <div className="mt-12 space-y-4">
                {[
                  ["01", "Find healthcare professionals"],
                  ["02", "Manage appointments"],
                  ["03", "Access medical records"],
                ].map(([number, label]) => (
                  <div
                    key={number}
                    className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5"
                  >
                    <span className="text-sm text-white/60">{number}</span>
                    <span className="font-medium">{label}</span>
                    <span className="ml-auto text-white/70">↗</span>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm leading-6 text-white/70">
                Designed to make everyday healthcare management more
                straightforward.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20">
          <div className="mb-10 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b1e2d]">
              Our services
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need for better care.
            </h2>
            <p className="mt-4 leading-7 text-[#746b68]">
              Keep essential healthcare services accessible through one
              straightforward platform.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Find doctors",
                description:
                  "Connect with healthcare professionals for your needs.",
              },
              {
                number: "02",
                title: "Appointments",
                description:
                  "Keep track of appointments and healthcare visits.",
              },
              {
                number: "03",
                title: "Medical records",
                description:
                  "Keep important health information organized.",
              },
              {
                number: "04",
                title: "Care coordination",
                description:
                  "Make healthcare information easier to manage.",
              },
            ].map((service) => (
              <article
                key={service.number}
                className="rounded-3xl border border-[#e8e2de] bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-sm font-semibold text-[#8b1e2d]">
                  {service.number}
                </span>
                <h3 className="mt-8 text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 leading-7 text-[#746b68]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="mb-20 rounded-[2rem] bg-[#eae2dc] px-7 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b1e2d]">
                Get started
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Take a simpler approach to healthcare.
              </h2>
            </div>

            <button
              onClick={handlePrimaryAction}
              className="shrink-0 rounded-full bg-[#8b1e2d] px-7 py-4 font-medium text-white transition hover:bg-[#701725]"
            >
              {!user
                ? "Create an account"
                : !profileCompleted
                ? "Complete profile"
                : "Open dashboard"}
              <span className="ml-3">→</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e2de]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-sm text-[#746b68] sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="font-semibold text-[#211c1c]">
            Health<span className="text-[#8b1e2d]">Care.</span>
          </Link>
          <p>Healthcare management, made simpler.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;