import { NavLink } from "react-router-dom";

export default function Navbar() {
  const base =
    "px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition";
  const active = "bg-white/20";

  return (
    <nav className="w-full bg-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="text-lg font-semibold">Reconocimiento de Dígitos</div>
        <div className="flex gap-2">
          <NavLink
            to="/image"
            className={({ isActive }) => `${base} ${isActive ? active : ""}`}
          >
            Reconocer
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => `${base} ${isActive ? active : ""}`}
          >
            Historial
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
