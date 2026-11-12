import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import OrbitPreview from "./scene/OrbitPreview";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For quick prototypes and learning new stacks.",
    features: ["Instant sandboxes", "Single workspace", "Community support"],
    cta: "Start Free",
    intent: "register",
  },
  {
    name: "Teams",
    price: "$24",
    description: "For shipping together with shared workspaces.",
    features: ["Realtime collab", "5 workspaces", "Priority builds"],
    cta: "Launch Teams",
    intent: "login",
  },
  {
    name: "Studio",
    price: "$79",
    description: "For orgs that need dedicated compute lanes.",
    features: ["Private clusters", "Unlimited projects", "SLA support"],
    cta: "Talk to Sales",
    intent: "sales",
  },
];

function Pricing() {
  const navigate = useNavigate();

  const handleAction = (intent) => {
    if (intent === "register") {
      navigate("/register");
      return;
    }

    if (intent === "login") {
      navigate("/login");
      return;
    }

    window.location.assign("mailto:hello@cloudide.local");
  };

  return (
    <section className="relative py-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_55%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 lg:flex-row lg:items-center">
        <div className="max-w-xl space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-[0.3em] text-sky-300"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-semibold text-white lg:text-4xl"
          >
            Choose the velocity that matches your release cadence.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70"
          >
            Every plan ships with instant environments, GPU-boosted execution,
            and full audit trails so your team can move without guesswork.
          </motion.p>

          <OrbitPreview className="h-56 w-full rounded-3xl border border-white/10 bg-black/40" />
          <p className="text-sm text-white/60">
            Drag to orbit the interactive preview.
          </p>
        </div>

        <div className="grid w-full gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  {plan.name}
                </h3>
                <span className="text-sm text-white/50">/mo</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">
                {plan.price}
              </p>
              <p className="mt-2 text-sm text-white/70">{plan.description}</p>

              <ul className="mt-6 space-y-3 text-sm text-white/70">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className="mt-8 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={() => handleAction(plan.intent)}
                type="button"
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
