import { useEffect, useState } from "react";

import axios from "axios";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import OrbitPreview from "../components/scene/OrbitPreview";
import SceneBackdrop from "../components/scene/SceneBackdrop";

function Dashboard() {
  const navigate = useNavigate();

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

  const [projects, setProjects] = useState([]);

  const [projectName, setProjectName] = useState("");

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadProjects = async () => {
      if (!token) {
        setError("Please log in to view projects.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${apiBase}/auth/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProjects(response.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [apiBase, token]);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!token) {
      setError("Please log in to create a project.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await axios.post(
        `${apiBase}/auth/projects`,
        {
          name: projectName.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProjects((prev) => [response.data, ...prev]);
      setProjectName("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create project.");
    } finally {
      setCreating(false);
    }
  };

  const handleOpenProject = (projectId) => {
    localStorage.setItem("projectId", projectId);
    navigate("/editor");
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("projectId");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-[#020617] px-6 py-20 text-white">
      <SceneBackdrop className="pointer-events-none absolute inset-0 opacity-40" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mx-auto w-full max-w-5xl rounded-[2.5rem] border border-white/10 bg-black/50 p-10 shadow-2xl backdrop-blur"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
              Workspace control
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-sm text-white/60">
              Create a new project or open an existing one.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSwitchAccount}
              type="button"
              className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white"
            >
              Switch account
            </button>
            <OrbitPreview className="h-20 w-20 rounded-2xl border border-white/10 bg-black/40" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="New project name"
            className="flex-1 rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-emerald-300"
          />

          <button
            onClick={handleCreateProject}
            disabled={creating}
            type="button"
            className="rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create Project"}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex flex-col gap-3 text-sm text-red-400">
            <span>{error}</span>
            {!token && (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-fit rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white"
              >
                Go to login
              </button>
            )}
          </div>
        )}

        <div className="mt-8 space-y-3">
          {loading ? (
            <div className="text-sm text-white/60">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-sm text-white/60">No projects yet.</div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold text-white">{project.name}</p>
                  <p className="text-xs text-white/50">
                    {project.files?.length || 0} files
                  </p>
                </div>

                <button
                  onClick={() => handleOpenProject(project.id)}
                  type="button"
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                >
                  Open
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;
