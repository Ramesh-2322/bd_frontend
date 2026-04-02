import { useEffect } from "react";
import AvailabilityToggle from "../components/AvailabilityToggle";
import BloodGroupBadge from "../components/BloodGroupBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from "../store/authStore";

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const toggleAvailability = useAuthStore((state) => state.toggleAvailability);

  useEffect(() => {
    if (!user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  if (!user) {
    return <LoadingSpinner text="Loading donor profile" />;
  }

  const isAvailable = Boolean(user.availabilityStatus ?? user.available);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-medical-700">Donor Profile</p>
          <h1 className="mt-2 text-2xl font-bold text-medical-900">{user.fullName || user.name || "Donor"}</h1>
          <p className="mt-1 text-sm text-slate-600">{user.email}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <BloodGroupBadge group={user.bloodGroup} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {user.location || "Unknown Location"}
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-medical-100 bg-medical-50 p-4">
            <p className="text-sm font-medium text-slate-700">Availability for emergency requests</p>
            <div className="mt-3 flex items-center gap-3">
              <AvailabilityToggle available={isAvailable} onToggle={toggleAvailability} />
              <p className="text-sm font-semibold text-medical-800">
                {isAvailable ? "Currently Available" : "Not Available"}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">Successful Donations</p>
            <p className="mt-2 text-3xl font-extrabold text-medical-700">{user.totalDonations ?? 0}</p>
          </div>

          <div className="card p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">Last Donation Date</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">{user.lastDonationDate || "N/A"}</p>
          </div>

          <div className="card p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">Contact Number</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">{user.phone || "N/A"}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
