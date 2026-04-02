import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { bdmsService } from "../services/bdmsService";

const hospitals = ["City Hospital", "Global Care", "LifeLine Medical", "Red Cross Center"];
const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

function BookAppointment() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hospital: "",
    date: "",
    timeSlot: "",
  });

  const time24h = useMemo(() => {
    if (!formData.timeSlot) return "";
    const [time, meridiem] = formData.timeSlot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }, [formData.timeSlot]);

  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await bdmsService.createAppointment({
        hospital: formData.hospital,
        date: formData.date,
        time: time24h,
        timeSlot: formData.timeSlot,
        appointmentDateTime: `${formData.date}T${time24h}:00`,
      });

      toast.success("Appointment booked successfully");
      setFormData({ hospital: "", date: "", timeSlot: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-medical-800 dark:text-medical-300">Book Appointment</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Select hospital, date, and time slot for your donation.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Select Hospital">
            <select required className="input" value={formData.hospital} onChange={updateField("hospital")}>
              <option value="">Choose hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital} value={hospital}>
                  {hospital}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Date Picker">
            <input required type="date" className="input" value={formData.date} onChange={updateField("date")} />
          </Field>

          <Field label="Time Slot">
            <select required className="input" value={formData.timeSlot} onChange={updateField("timeSlot")}>
              <option value="">Choose time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2">
            <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto">
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      {children}
    </div>
  );
}

export default BookAppointment;
