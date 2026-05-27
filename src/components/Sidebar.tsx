import { LayoutGrid, Users, Activity, Globe, Lock, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "Home",       Icon: LayoutGrid, locked: false },
  { to: "/clients",   label: "Clients",    Icon: Users,      locked: false },
  { to: "/stats",     label: "Stats",      Icon: Activity,   locked: false },
  { to: "/network",   label: "Réseau",     Icon: Globe,      locked: false },
  { to: "/ecosystem", label: "Écosystème", Icon: Lock,       locked: true  },
];

const Sidebar = () => {
  return (
    <aside
      className="w-[58px] shrink-0 h-screen flex flex-col items-center py-3 border-hair border-r"
      style={{ background: "#0a0f1a", borderColor: "#2a3a50" }}
    >
      {/* Logo hexagone vert */}
      <NavLink to="/dashboard" className="mb-5">
        <svg width="28" height="28" viewBox="0 0 28 28">
          <polygon
            points="14,2 25,8 25,20 14,26 3,20 3,8"
            fill="none"
            stroke="#0EFF9C"
            strokeWidth="1.5"
          />
          <polygon
            points="14,7 21,11 21,17 14,21 7,17 7,11"
            fill="#0EFF9C"
            fillOpacity="0.15"
          />
        </svg>
      </NavLink>

      <nav className="flex-1 flex flex-col gap-1 w-full px-2">
        {items.map(({ to, label, Icon, locked }) => (
          <NavLink
            key={to}
            to={locked ? "#" : to}
            onClick={(e) => locked && e.preventDefault()}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 rounded-[10px] border-hair transition-150 ${
                locked ? "opacity-40 cursor-not-allowed border-transparent" : ""
              } ${
                !locked && isActive
                  ? "border-[#0EFF9C55]"
                  : "border-transparent hover:bg-white/[0.03]"
              }`
            }
            style={({ isActive }: any) =>
              !locked && isActive ? { background: "#0EFF9C18" } : undefined
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  color={!locked && isActive ? "#0EFF9C" : "#8892a0"}
                  strokeWidth={1.8}
                />
                <span
                  className="font-bold uppercase"
                  style={{
                    fontSize: "7px",
                    letterSpacing: "0.5px",
                    color: !locked && isActive ? "#0EFF9C" : "#8892a0",
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profil bas */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-2 w-[42px] rounded-[10px] border-hair transition-150 ${
            isActive ? "border-[#0EFF9C55]" : "border-transparent hover:bg-white/[0.03]"
          }`
        }
        style={({ isActive }: any) => (isActive ? { background: "#0EFF9C18" } : undefined)}
      >
        {({ isActive }) => (
          <>
            <User size={16} color={isActive ? "#0EFF9C" : "#8892a0"} strokeWidth={1.8} />
            <span
              className="font-bold uppercase"
              style={{
                fontSize: "7px",
                letterSpacing: "0.5px",
                color: isActive ? "#0EFF9C" : "#8892a0",
              }}
            >
              Profil
            </span>
          </>
        )}
      </NavLink>
    </aside>
  );
};

export default Sidebar;
