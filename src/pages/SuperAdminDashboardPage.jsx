import { useEffect } from "react";
import EmptyState from "../components/EmptyState";
import SkeletonCard from "../components/SkeletonCard";
import { useSaasStore } from "../store/saasStore";

function SuperAdminDashboardPage() {
  const hospitals = useSaasStore((state) => state.hospitals);
  const globalStats = useSaasStore((state) => state.globalStats);
  const loading = useSaasStore((state) => state.loading);
  const error = useSaasStore((state) => state.error);
  const fetchSuperAdminData = useSaasStore((state) => state.fetchSuperAdminData);

  useEffect(() => {
    fetchSuperAdminData();
  }, [fetchSuperAdminData]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-2xl font-bold text-medical-900">Super Admin Dashboard</h1>
        <p className="text-sm text-slate-600">Manage hospitals, subscriptions, and global platform performance.</p>
      </section>

      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
        </section>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Hospitals" value={globalStats.totalHospitals} />
          <MetricCard title="Total Donors" value={globalStats.totalDonors} />
          <MetricCard title="Total Requests" value={globalStats.totalRequests} />
          <MetricCard title="Active Subscriptions" value={globalStats.activeSubscriptions} />
        </section>
      )}

      <section className="card mt-6 overflow-hidden">
        <div className="border-b border-medical-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Hospitals</h2>
          <p className="text-sm text-slate-500">Tenant list and subscription overview</p>
        </div>

        {hospitals.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No hospitals found" description="Onboard hospitals to start multi-tenant operations." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-medical-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">Hospital</th>
                  <th className="px-6 py-3">Admin</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-100">
                {hospitals.map((hospital) => (
                  <tr key={hospital.id || hospital.name}>
                    <td className="px-6 py-4 font-semibold text-slate-800">{hospital.name || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-600">{hospital.adminName || hospital.adminEmail || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-600">{hospital.plan || "FREE"}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {hospital.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="rounded-lg border border-medical-200 px-3 py-1.5 text-xs font-semibold text-medical-700 hover:bg-medical-50">
                        Manage Subscription
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function MetricCard({ title, value }) {
  return (
    <article className="card p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-extrabold text-medical-700">{value ?? 0}</p>
    </article>
  );
}

export default SuperAdminDashboardPage;
