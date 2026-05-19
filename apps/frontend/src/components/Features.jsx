import { Cpu, Shield, Zap, Code2 } from "lucide-react";

import { motion } from "framer-motion";

const features = [
  {
    icon: <Code2 size={40} />,
    title: "Multi Language Runtime",
    description:
      "Run Python, JavaScript, C++, and Java inside secure containers.",
  },

  {
    icon: <Shield size={40} />,
    title: "Docker Sandboxing",
    description: "Every execution runs inside isolated Docker containers.",
  },

  {
    icon: <Zap size={40} />,
    title: "Realtime Execution",
    description: "Fast live execution with optimized backend architecture.",
  },

  {
    icon: <Cpu size={40} />,
    title: "Cloud Infrastructure",
    description: "Built using microservices, Redis queues, and Kubernetes.",
  },
];

function Features() {
  return (
    <div className="relative overflow-hidden bg-[#020617] px-6 py-32">
      <div className="absolute right-[-15%] top-10 h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-[160px]" />
      <div className="absolute left-[-10%] bottom-[-10%] h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
            Built for velocity
          </p>
          <h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Powerful cloud runtime, crafted for modern teams.
          </h2>
          <p className="mt-6 text-lg text-white/70">
            The platform orchestrates containerized runtimes, secure file
            systems, and real-time collaboration without sacrificing speed.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="text-emerald-300 mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-white/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
