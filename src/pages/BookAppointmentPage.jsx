import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { useAuthStore } from "../store/authStore";
import { useAppointmentStore } from "../store/appointmentStore";
import { useRequestStore } from "../store/requestStore";

function BookAppointmentPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const submitting = useAppointmentStore((state) => state.submitting);
  const bookingError = useAppointmentStore((state) => state.error);
  const pendingRetry = useAppointmentStore((state) => state.pendingRetry);
  const createAppointment = useAppointmentStore((state) => state.createAppointment);
  const retryPendingAppointment = useAppointmentStore((state) => state.retryPendingAppointment);

  const requests = useRequestStore((state) => state.requests);
  const loadingRequests = useRequestStore((state) => state.loading);
  const requestError = useRequestStore((state) => state.error);
  const fetchMyRequests = useRequestStore((state) => state.fetchMyRequests);

  const [formData, setFormData] = useState({
    requestId: "",
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  const approvedRequests = useMemo(
    () => requests.filter((request) => (request.status || "").toUpperCase() === "APPROVED"),
    [requests]
  );

  const validate = () => {
    const nextErrors = {};
    if (!formData.requestId) nextErrors.requestId = "Select an approved request";
    if (!formData.date) nextErrors.date = "Choose a date";
    if (!formData.time) nextErrors.time = "Choose a time";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const ok = await createAppointment({
      donorId: user?.id,
      donorName: user?.fullName || user?.name,
      requestId: Number(formData.requestId),
      appointmentDateTime: `${formData.date}T${formData.time}`,
    });

    if (ok) {
      navigate("/appointments");
    }
  };

  if (loadingRequests) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="card animate-pulse p-8">
          <div className="h-7 w-56 rounded bg-slate-200" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="h-12 rounded bg-slate-200" />
            <div className="h-12 rounded bg-slate-200" />
            <div className="h-12 rounded bg-slate-200" />
            <div className="h-12 rounded bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-medical-900">Book Appointment</h1>
        <p className="mt-1 text-sm text-slate-600">Schedule donation timing against an approved request.</p>

        {requestError && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{requestError}</div>
        )}

        {bookingError && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {bookingError}
            {pendingRetry && (
              <button type="button" onClick={retryPendingAppointment} className="ml-2 font-semibold underline">
                Retry
              </button>
            )}
          </div>
        )}

        {approvedRequests.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No approved requests"
              description="Appointments can be booked only when your request is approved by admin."
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Donor</label>
              <input
                className="input bg-slate-50"
                value={user?.fullName || user?.name || "Unknown donor"}
                readOnly
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Select Request</label>
              <select
                className="input"
                value={formData.requestId}
                onChange={(event) => setFormData((prev) => ({ ...prev, requestId: event.target.value }))}
              >
                <option value="">Choose request</option>
                {approvedRequests.map((request) => (
                  <option key={request.id} value={request.id}>
                    #{request.id} - {request.patientName} ({request.bloodGroup})
                  </option>
                ))}
              </select>
              {errors.requestId && <p className="mt-1 text-xs text-medical-700">{errors.requestId}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                className="input"
                value={formData.date}
                onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
              />
              {errors.date && <p className="mt-1 text-xs text-medical-700">{errors.date}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Time</label>
              <input
                type="time"
                className="input"
                value={formData.time}
                onChange={(event) => setFormData((prev) => ({ ...prev, time: event.target.value }))}
              />
              {errors.time && <p className="mt-1 text-xs text-medical-700">{errors.time}</p>}
            </div>

            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? "Booking appointment..." : "Submit Booking"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default BookAppointmentPage;
