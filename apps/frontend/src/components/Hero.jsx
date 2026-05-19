import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import HeroScene from "./scene/HeroScene";

function Hero({ onLearnMore }) {
  const navigate = useNavigate();

  const handleLaunch = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/login");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617]">
      <HeroScene />
      <div className="absolute left-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-emerald-400/20 blur-[140px]" />
      <div className="absolute right-[-10%] bottom-[-20%] h-[420px] w-[420px] rounded-full bg-sky-500/20 blur-[160px]" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 max-w-4xl px-6 text-center"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">
          Cloud IDE Platform
        </p>
        <h1 className="mt-6 text-5xl font-semibold leading-tight text-white md:text-7xl">
          Build. Execute. Deploy.
          <span className="block text-white/70">
            All from one live console.
          </span>
        </h1>

        <p className="mt-6 text-lg text-white/70">
          Spin up isolated sandboxes, collaborate in real time, and ship with
          confidence from a single dashboard.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={handleLaunch}
            type="button"
            className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-slate-900 transition hover:bg-emerald-100"
          >
            Launch IDE
          </button>

          <button
            type="button"
            onClick={() => onLearnMore?.()}
            className="rounded-2xl border border-white/20 px-8 py-4 text-base text-white"
          >
            Learn More
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Hero;
