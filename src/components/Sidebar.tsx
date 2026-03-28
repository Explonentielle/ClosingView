import { BarChart3, Map, Target, Trophy, Gift, Briefcase, Globe, Settings, Zap, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
  { icon: Briefcase, label: "Deals", path: "/deals" },
  { icon: Map, label: "Carte", path: "/map" },
  { icon: Target, label: "Objectifs", path: "/goals" },
  { icon: Trophy, label: "Classement", path: "/leaderboard" },
  { icon: Gift, label: "Récompenses", path: "/rewards" },
  { icon: Globe, label: "Écosystèmes", path: "/ecosystems" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-16 lg:w-60 h-screen glass-card border-r border-border/50 flex flex-col py-5 shrink-0">
      <div className="px-3 lg:px-5 mb-8">
        <Link to="/dashboard" className="hidden lg:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap size={16} className="text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-foreground">Close</span>
            <span className="text-primary">One</span>
          </h1>
        </Link>
        <Link to="/dashboard" className="lg:hidden flex justify-center">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Zap size={18} className="text-primary-foreground" />
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 px-2 lg:px-3">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary glow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden lg:inline text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-2 lg:px-3 space-y-0.5">
        <Link to="/settings" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <Settings size={18} className="shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">Paramètres</span>
        </Link>
        <button onClick={() => navigate("/login")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <LogOut size={18} className="shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
