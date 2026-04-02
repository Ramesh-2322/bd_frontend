import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppointmentStatusBadge from "../components/AppointmentStatusBadge";
import { bdmsService } from "../services/bdmsService";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const data = await bdmsService.getAppointments();
        setAppointments(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const rows = useMemo(() => {
    return appointments.map((item) => {
      const dateTimeRaw = item.appointmentDateTime || item.dateTime;
      const dateObj = dateTimeRaw ? new Date(dateTimeRaw) : null;
      return {
        id: item.id || item.appointmentId,
        date: item.date || (dateObj ? dateObj.toLocaleDateString() : "N/A"),
        time: item.time || (dateObj ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"),
        hospital: item.hospital || item.hospitalName || "N/A",
        status: item.status || "SCHEDULED",
      };
    });
  }, [appointments]);

  return (
    <section className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-medical-800 dark:text-medical-300">My Appointments</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          See your upcoming and completed appointments.
        </p>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-medical-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Hospital</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medical-100 dark:divide-slate-800">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    Loading appointments...
                  </td>
                </tr>
              )}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    No appointments found.
                  </td>
                </tr>
              )}

              {!loading &&
                rows.map((row) => (
                  <tr key={row.id || `${row.date}-${row.time}-${row.hospital}`}>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-100">{row.date}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.time}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.hospital}</td>
                    <td className="px-4 py-3">
                      <AppointmentStatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default MyAppointments;
