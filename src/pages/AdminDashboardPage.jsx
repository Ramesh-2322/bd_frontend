import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import EmptyState from "../components/EmptyState";
import SkeletonCard from "../components/SkeletonCard";
import { useAnalyticsStore } from "../store/analyticsStore";

const pieColors = ["#e11d48", "#fb7185", "#f43f5e", "#be123c", "#fda4af", "#9f1239", "#fecdd3", "#881337"];

function AdminDashboardPage() {
  const analytics = useAnalyticsStore((state) => state.analytics);
  const loading = useAnalyticsStore((state) => state.loading);
  const error = useAnalyticsStore((state) => state.error);
  const fetchAnalytics = useAnalyticsStore((state) => state.fetchAnalytics);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-2xl font-bold text-medical-900">Admin Analytics Dashboard</h1>
        <p className="text-sm text-slate-600">Operational overview of donations and blood requests.</p>
      </section>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      {loading ? (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
        </section>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Donors" value={analytics.totalDonors} />
          <MetricCard title="Total Requests" value={analytics.totalRequests} />
          <MetricCard title="Completed Donations" value={analytics.completedDonations} />
          <MetricCard title="Active Donors" value={analytics.activeDonors} />
        </section>
      )}

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-800">Donor Management</h2>
          <p className="mt-1 text-sm text-slate-500">Approve donors, review availability, and maintain donor quality.</p>
          <Link to="/donors" className="btn-secondary mt-4">
            Manage Donors
          </Link>
        </article>

        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-800">Request Operations</h2>
          <p className="mt-1 text-sm text-slate-500">Approve or reject blood requests and track completion lifecycle.</p>
          <Link to="/admin/requests" className="btn-secondary mt-4">
            Manage Requests
          </Link>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-800">Monthly Donations</h2>
          <p className="text-sm text-slate-500">Completed donations trend by month</p>

          {analytics.monthlyDonations.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No donation data"
                description="Monthly donation metrics will appear once data is available."
              />
            </div>
          ) : (
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyDonations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="donations" fill="#e11d48" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-800">Requests by Blood Group</h2>
          <p className="text-sm text-slate-500">Distribution of requests across blood types</p>

          {analytics.requestsByBloodGroup.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No request distribution"
                description="Blood group distribution appears after requests are created."
              />
            </div>
          ) : (
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={analytics.requestsByBloodGroup}
                    dataKey="count"
                    nameKey="bloodGroup"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {analytics.requestsByBloodGroup.map((entry, index) => (
                      <Cell key={entry.bloodGroup} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
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

export default AdminDashboardPage;
