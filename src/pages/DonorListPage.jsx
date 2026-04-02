import { useEffect } from "react";
import BloodGroupBadge from "../components/BloodGroupBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDonorStore } from "../store/donorStore";

const bloodGroups = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function DonorListPage() {
  const donors = useDonorStore((state) => state.donors);
  const loading = useDonorStore((state) => state.loading);
  const filters = useDonorStore((state) => state.filters);
  const setFilters = useDonorStore((state) => state.setFilters);
  const fetchFilteredDonors = useDonorStore((state) => state.fetchFilteredDonors);

  useEffect(() => {
    fetchFilteredDonors();
  }, [fetchFilteredDonors]);

  const handleFilter = (event) => {
    const { name, value } = event.target;
    setFilters({ [name]: value });
  };

  const onSearch = (event) => {
    event.preventDefault();
    fetchFilteredDonors();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="card p-6">
        <h1 className="text-2xl font-bold text-medical-900">Donor Directory</h1>
        <p className="mt-1 text-sm text-slate-600">Search verified donors by blood group and location.</p>

        <form onSubmit={onSearch} className="mt-5 grid gap-3 sm:grid-cols-3">
          <select
            name="bloodGroup"
            value={filters.bloodGroup}
            onChange={handleFilter}
            className="input"
          >
            {bloodGroups.map((group) => (
              <option key={group || "all"} value={group}>
                {group || "All Groups"}
              </option>
            ))}
          </select>

          <input
            name="location"
            value={filters.location}
            onChange={handleFilter}
            className="input"
            placeholder="Filter by location"
          />

          <button type="submit" className="btn-primary">
            Apply Filters
          </button>
        </form>
      </section>

      <section className="card mt-6 overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading donor list" />
        ) : (
          <>
            <div className="hidden grid-cols-5 bg-medical-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <p>Name</p>
              <p>Email</p>
              <p>Blood Group</p>
              <p>Location</p>
              <p>Status</p>
            </div>

            <div className="divide-y divide-medical-100">
              {donors.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-slate-500">No donors found.</div>
              )}

              {donors.map((donor) => (
                <article
                  key={donor.id || donor.email}
                  className="grid gap-3 px-6 py-4 md:grid-cols-5 md:items-center"
                >
                  <p className="font-semibold text-slate-800">{donor.fullName || donor.name || "N/A"}</p>
                  <p className="text-sm text-slate-600">{donor.email || "N/A"}</p>
                  <div>
                    <BloodGroupBadge group={donor.bloodGroup} />
                  </div>
                  <p className="text-sm text-slate-600">{donor.location || "N/A"}</p>
                  <p
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      donor.available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {donor.available ? "Available" : "Unavailable"}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default DonorListPage;
