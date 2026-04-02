import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import SkeletonCard from "../components/SkeletonCard";
import { appointmentService } from "../services/appointmentService";
import { requestService } from "../services/requestService";

function HospitalDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [requestData, appointmentData] = await Promise.all([
          requestService.getAllRequests(),
          appointmentService.getMyAppointments(),
        ]);
        setRequests(requestData || []);
        setAppointments(appointmentData || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const pendingRequests = requests.filter((item) => (item.status || "").toUpperCase() === "PENDING").length;
    const urgentRequests = requests.filter((item) => Boolean(item.urgent)).length;
    const scheduledAppointments = appointments.filter(
      (item) => (item.status || "SCHEDULED").toUpperCase() === "SCHEDULED"
    ).length;

    return {
      totalRequests: requests.length,
      pendingRequests,
      urgentRequests,
      scheduledAppointments,
    };
  }, [appointments, requests]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-2xl font-bold text-medical-900">Hospital Operations Dashboard</h1>
        <p className="text-sm text-slate-600">Monitor request load and appointment flow in real time.</p>
      </section>

      {loading ? (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
        </section>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Requests" value={stats.totalRequests} />
          <MetricCard title="Pending Requests" value={stats.pendingRequests} />
          <MetricCard title="Urgent Requests" value={stats.urgentRequests} />
          <MetricCard title="Scheduled Appointments" value={stats.scheduledAppointments} />
        </section>
      )}

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-800">Request Queue</h2>
          <p className="mt-1 text-sm text-slate-500">Review open requests and expedite critical cases.</p>
          <Link to="/my-requests" className="btn-secondary mt-4">
            Open Requests
          </Link>
        </article>

        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-800">Appointment Desk</h2>
          <p className="mt-1 text-sm text-slate-500">Book and manage donor appointments with your facility.</p>
          <Link to="/book-appointment" className="btn-secondary mt-4">
            Book Appointment
          </Link>
        </article>
      </section>

      {!loading && stats.totalRequests === 0 && (
        <section className="mt-6">
          <EmptyState
            title="No request activity"
            description="Hospital-level request metrics will appear once requests are created."
          />
        </section>
      )}
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

export default HospitalDashboardPage;
