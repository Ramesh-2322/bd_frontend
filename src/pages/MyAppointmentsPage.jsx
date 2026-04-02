import { useEffect } from "react";
import AppointmentStatusBadge from "../components/AppointmentStatusBadge";
import EmptyState from "../components/EmptyState";
import SkeletonCard from "../components/SkeletonCard";
import { useAppointmentStore } from "../store/appointmentStore";

function MyAppointmentsPage() {
  const appointments = useAppointmentStore((state) => state.appointments);
  const loading = useAppointmentStore((state) => state.loading);
  const error = useAppointmentStore((state) => state.error);
  const fetchMyAppointments = useAppointmentStore((state) => state.fetchMyAppointments);

  useEffect(() => {
    fetchMyAppointments();
  }, [fetchMyAppointments]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-2xl font-bold text-medical-900">My Appointments</h1>
        <p className="text-sm text-slate-600">Track donation appointments and current status.</p>
      </section>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      {loading ? (
        <section className="mt-6 grid gap-4">
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
        </section>
      ) : appointments.length === 0 ? (
        <section className="mt-6">
          <EmptyState
            title="No appointments yet"
            description="Book an appointment after your request is approved."
          />
        </section>
      ) : (
        <section className="card mt-6 overflow-hidden">
          <div className="hidden grid-cols-5 bg-medical-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
            <p>Appointment ID</p>
            <p>Request</p>
            <p>Date Time</p>
            <p>Hospital</p>
            <p>Status</p>
          </div>

          <div className="divide-y divide-medical-100">
            {appointments.map((item) => (
              <article key={item.id} className="grid gap-3 px-6 py-4 md:grid-cols-5 md:items-center">
                <p className="font-semibold text-slate-800">#{item.id || "N/A"}</p>
                <p className="text-sm text-slate-600">#{item.requestId || "N/A"}</p>
                <p className="text-sm text-slate-600">
                  {item.appointmentDateTime ? new Date(item.appointmentDateTime).toLocaleString() : "N/A"}
                </p>
                <p className="text-sm text-slate-600">{item.hospitalName || "N/A"}</p>
                <div>
                  <AppointmentStatusBadge status={item.status} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default MyAppointmentsPage;
