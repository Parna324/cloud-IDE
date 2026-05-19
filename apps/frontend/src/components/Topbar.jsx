import { useNavigate } from "react-router-dom";

function Topbar({
  language,
  setLanguage,
  runCode,
  saveFile,
  saving,
  saveNote,
}) {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("projectId");
    navigate("/login");
  };
  return (
    <div className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0f172a] px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-white">Cloud IDE</h1>
        <button
          type="button"
          onClick={handleDashboard}
          className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white"
        >
          Dashboard
        </button>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#1e293b] text-white px-4 py-2 rounded-lg outline-none"
        >
          <option value="python">Python</option>

          <option value="javascript">JavaScript</option>

          <option value="cpp">C++</option>

          <option value="java">Java</option>
        </select>

        <button
          onClick={saveFile}
          disabled={saving}
          className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-xl text-white font-semibold transition disabled:opacity-60"
          type="button"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={runCode}
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl text-white font-semibold transition"
          type="button"
        >
          Run Code
        </button>

        <button
          onClick={handleLogout}
          type="button"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white"
        >
          Log out
        </button>

        {saveNote && <span className="text-xs text-slate-300">{saveNote}</span>}
      </div>
    </div>
  );
}

export default Topbar;
