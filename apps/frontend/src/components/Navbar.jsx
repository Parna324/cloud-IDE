import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-white">Cloud IDE</h1>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => handleSection("features")}
            className="text-sm uppercase tracking-[0.2em] text-gray-300 transition hover:text-white"
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => handleSection("pricing")}
            className="text-sm uppercase tracking-[0.2em] text-gray-300 transition hover:text-white"
          >
            Pricing
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-2xl bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
