import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BloodGroupBadge from "../components/BloodGroupBadge";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRequestStore } from "../store/requestStore";

function MatchingDonorsPage() {
  const { id } = useParams();
  const loading = useRequestStore((state) => state.loading);
  const error = useRequestStore((state) => state.error);
  const matches = useRequestStore((state) => state.matches);
  const selectedRequest = useRequestStore((state) => state.selectedRequest);
  const fetchRequestById = useRequestStore((state) => state.fetchRequestById);
  const fetchMatches = useRequestStore((state) => state.fetchMatches);

  useEffect(() => {
    if (!id) return;
    fetchRequestById(id);
    fetchMatches(id);
  }, [id, fetchMatches, fetchRequestById]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="card p-6">
        <h1 className="text-2xl font-bold text-medical-900">Matching Donors</h1>
        <p className="mt-1 text-sm text-slate-600">
          Request #{id} - {selectedRequest?.bloodGroup || "Blood Group"} at {selectedRequest?.location || "Location"}
        </p>
        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}
      </section>

      {loading ? (
        <LoadingSpinner text="Finding suitable donors" />
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                title="No matching donors"
                description="No eligible donors found for this request right now."
              />
            </div>
          )}

          {matches.map((donor) => (
            <article key={donor.id || donor.email} className="card p-5">
              <h2 className="text-lg font-bold text-slate-800">{donor.fullName || donor.name || "N/A"}</h2>

              <div className="mt-3 flex items-center gap-2">
                <BloodGroupBadge group={donor.bloodGroup} />
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    donor.available ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {donor.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-700">Location:</span> {donor.location || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Email:</span> {donor.email || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Phone:</span> {donor.phone || "N/A"}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MatchingDonorsPage;
