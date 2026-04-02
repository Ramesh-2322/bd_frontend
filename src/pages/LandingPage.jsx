import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-hero-glow">
      <section className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <span className="inline-flex rounded-full bg-medical-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-medical-700">
            Save Lives Through Real-Time Donations
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-medical-900 sm:text-5xl">
            Smart Blood Donation Management for Faster Emergency Response
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
            BDMS connects verified donors and hospitals with an intelligent donor network. Track
            blood availability, manage profiles, and reduce response time with one unified dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary">
              Become a Donor
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>

        <div className="card relative p-6 sm:p-8">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-medical-200/60 blur-2xl" />
          <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-medical-300/40 blur-2xl" />

          <h2 className="text-xl font-bold text-medical-800">BDMS Impact Snapshot</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-medical-100 bg-medical-50 p-4">
              <p className="text-3xl font-extrabold text-medical-700">12K+</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">Active Donors</p>
            </div>
            <div className="rounded-xl border border-medical-100 bg-medical-50 p-4">
              <p className="text-3xl font-extrabold text-medical-700">24/7</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">Availability</p>
            </div>
            <div className="rounded-xl border border-medical-100 bg-medical-50 p-4">
              <p className="text-3xl font-extrabold text-medical-700">98%</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">Request Match</p>
            </div>
            <div className="rounded-xl border border-medical-100 bg-medical-50 p-4">
              <p className="text-3xl font-extrabold text-medical-700">300+</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">Partner Clinics</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
