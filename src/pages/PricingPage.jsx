import { useEffect } from "react";
import { useSaasStore } from "../store/saasStore";

function PricingPage() {
  const plans = useSaasStore((state) => state.plans);
  const currentPlan = useSaasStore((state) => state.currentPlan);
  const loading = useSaasStore((state) => state.loading);
  const error = useSaasStore((state) => state.error);
  const fetchSubscriptionData = useSaasStore((state) => state.fetchSubscriptionData);
  const upgradePlan = useSaasStore((state) => state.upgradePlan);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-2xl font-bold text-medical-900">Subscription Plans</h1>
        <p className="text-sm text-slate-600">Choose the plan that fits your hospital operations.</p>
        <p className="mt-2 text-sm font-semibold text-medical-700">Current Plan: {currentPlan}</p>
      </section>

      {error && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <section className="mt-6 grid gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const planCode = (plan.code || plan.name || "FREE").toUpperCase();
          const isCurrent = planCode === currentPlan;

          return (
            <article
              key={planCode}
              className={`card p-6 transition ${isCurrent ? "ring-2 ring-medical-300" : "hover:-translate-y-0.5"}`}
            >
              <h2 className="text-lg font-bold text-slate-800">{plan.name || planCode}</h2>
              <p className="mt-1 text-3xl font-extrabold text-medical-700">{plan.price || "$0/mo"}</p>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {(plan.features || []).map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>

              <button
                type="button"
                disabled={loading || isCurrent}
                onClick={() => upgradePlan(planCode)}
                className="btn-primary mt-5 w-full"
              >
                {isCurrent ? "Current Plan" : "Upgrade"}
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default PricingPage;
