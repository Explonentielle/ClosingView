import { BarChart3, Map, Target, Trophy, Gift, Briefcase, Globe, Settings, Zap } from "lucide-react";

const navItems = [
  { icon: BarChart3, label: "Dashboard", id: "dashboard" },
  { icon: Briefcase, label: "Deals", id: "deals" },
  { icon: Map, label: "Carte", id: "map" },
  { icon: Target, label: "Objectifs", id: "goals" },
  { icon: Trophy, label: "Classement", id: "leaderboard" },
  { icon: Gift, label: "Récompenses", id: "rewards" },
  { icon: Globe, label: "Écosystèmes", id: "ecosystems" },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => (
  <aside className="w-16 lg:w-60 h-screen glass-card border-r border-border/50 flex flex-col py-5 shrink-0">
    <div className="px-3 lg:px-5 mb-8">
      <div className="hidden lg:flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Zap size={16} className="text-primary-foreground" />
        </div>
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-foreground">Close</span>
          <span className="text-primary">One</span>
        </h1>
      </div>
      <div className="lg:hidden flex justify-center">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
          <Zap size={18} className="text-primary-foreground" />
        </div>
      </div>
    </div>
    <nav className="flex-1 space-y-0.5 px-2 lg:px-3">
      {navItems.map(({ icon: Icon, label, id }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            activeTab === id
              ? "bg-primary/10 text-primary glow-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <Icon size={18} className="shrink-0" />
          <span className="hidden lg:inline text-sm font-medium">{label}</span>
        </button>
      ))}
    </nav>
    <div className="px-2 lg:px-3">
      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
        <Settings size={18} className="shrink-0" />
        <span className="hidden lg:inline text-sm font-medium">Paramètres</span>
      </button>
    </div>
  </aside>
);

export default Sidebar;
