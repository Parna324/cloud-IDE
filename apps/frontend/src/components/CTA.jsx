import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  const handlePrimary = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/login");
  };

  const handleSecondary = () => {
    window.location.href =
      "mailto:hello@cloudide.local?subject=Cloud%20IDE%20Demo";
  };

  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-emerald-400/20 via-transparent to-sky-400/20 px-8 py-14 text-center"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
          Launch
        </p>
        <h2 className="text-3xl font-semibold text-white lg:text-4xl">
          Move from idea to running service in one session.
        </h2>
        <p className="text-lg text-white/70">
          Build, run, and share with an IDE that is always a step ahead of your
          deployment.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900"
            onClick={handlePrimary}
            type="button"
          >
            Open Dashboard
          </button>
          <button
            className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white"
            onClick={handleSecondary}
            type="button"
          >
            Request Live Demo
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default CTA;
