import { BarChart3, Briefcase, ChartNoAxesCombined, User, Settings, Zap, LogOut, Globe, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Mes Clients", path: "/clients" },
  { icon: Briefcase, label: "Deals", path: "/deals" },
  { icon: ChartNoAxesCombined, label: "Stats", path: "/stats" },
  { icon: User, label: "Profil", path: "/profil" },
];

const devItems = [
  { icon: Globe, label: "Écosystèmes & Challenges" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-16 lg:w-60 h-screen bg-card border-r border-border/50 flex flex-col py-5 shrink-0">
      <div className="px-3 lg:px-5 mb-8">
        <Link to="/dashboard" className="hidden lg:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-foreground">Close</span>
              <span className="text-primary">One</span>
            </h1>
            <p className="text-[9px] text-muted-foreground -mt-0.5 tracking-wide">Growth Smarter.</p>
          </div>
        </Link>
        <Link to="/dashboard" className="lg:hidden flex justify-center">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Zap size={18} className="text-primary-foreground" />
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 lg:px-3 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden lg:inline text-sm font-medium">{label}</span>
            </Link>
          );
        })}

        {/* Separator */}
        <div className="!my-4 mx-2 border-t border-border/50" />

        {/* En développement */}
        <div className="hidden lg:block px-3 mb-2">
          <span className="text-[10px] text-muted-foreground italic tracking-wide">En développement</span>
        </div>
        {devItems.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground opacity-40 cursor-not-allowed"
          >
            <Icon size={18} className="shrink-0" />
            <span className="hidden lg:inline text-sm font-medium">{label}</span>
            <span className="hidden lg:inline ml-auto text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-warning/20 text-warning">Bientôt</span>
          </div>
        ))}
      </nav>

      <div className="px-2 lg:px-3 space-y-0.5">
        <Link
          to="/settings"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
            location.pathname === "/settings"
              ? "bg-primary/10 text-primary border-l-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <Settings size={18} className="shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">Paramètres</span>
        </Link>
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
