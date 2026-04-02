import { useEffect } from "react";
import AvailabilityToggle from "../components/AvailabilityToggle";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from "../store/authStore";

function Profile() {
  const user = useAuthStore((state) => state.user);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const toggleAvailability = useAuthStore((state) => state.toggleAvailability);

  useEffect(() => {
    if (!user) {
      refreshProfile();
    }
  }, [refreshProfile, user]);

  if (!user) {
    return <LoadingSpinner text="Loading profile" />;
  }

  const role = (user.role || localStorage.getItem("bdms_role") || "DONOR").toUpperCase();
  const isDonor = role === "DONOR";
  const isAvailable = Boolean(user.availabilityStatus ?? user.available);

  return (
    <section className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-medical-800 dark:text-medical-300">Profile</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Manage your account details and preferences.</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="card p-6 lg:col-span-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">Personal Details</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{user.fullName || user.name || "User"}</h2>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <ProfileField label="Email" value={user.email || "N/A"} />
            <ProfileField label="Phone" value={user.phone || user.phoneNumber || "N/A"} />
            <ProfileField label="Role" value={role} />
            <ProfileField label="Blood Group" value={user.bloodGroup || "N/A"} />
            <ProfileField label="Location" value={user.location || user.city || "N/A"} />
            <ProfileField label="Hospital" value={user.hospitalName || localStorage.getItem("bdms_hospital_name") || "N/A"} />
          </dl>
        </article>

        <article className="card p-6">
          <p className="text-xs uppercase tracking-wide text-slate-500">Activity</p>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="text-slate-500">Total Donations</p>
              <p className="text-lg font-semibold text-medical-700">{user.totalDonations ?? 0}</p>
            </div>
            <div>
              <p className="text-slate-500">Last Donation</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{user.lastDonationDate || "N/A"}</p>
            </div>

            {isDonor && (
              <div className="rounded-xl border border-medical-100 bg-medical-50 p-4">
                <p className="text-sm font-medium text-slate-700">Availability</p>
                <div className="mt-3 flex items-center gap-3">
                  <AvailabilityToggle available={isAvailable} onToggle={toggleAvailability} />
                  <span className="text-sm font-semibold text-medical-800">
                    {isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</dd>
    </div>
  );
}

export default Profile;
