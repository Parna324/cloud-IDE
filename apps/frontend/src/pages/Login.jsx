import { useState } from "react";

import axios from "axios";

import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import SceneBackdrop from "../components/scene/SceneBackdrop";

function Login() {
  const navigate = useNavigate();

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const response = await axios.post(`${apiBase}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-6">
      <SceneBackdrop className="pointer-events-none absolute inset-0 opacity-70" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-black/50 p-10 shadow-2xl backdrop-blur"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
          Welcome back
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Login</h1>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-5 py-4 text-white outline-none focus:border-emerald-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-5 py-4 text-white outline-none focus:border-emerald-300"
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-400 py-4 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-300 hover:text-emerald-200"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
