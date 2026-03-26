import { Map, Target, Trophy, Gift, BarChart3, Settings } from "lucide-react";

const navItems = [
  { icon: BarChart3, label: "Dashboard", id: "dashboard" },
  { icon: Map, label: "Carte", id: "map" },
  { icon: Target, label: "Objectifs", id: "goals" },
  { icon: Trophy, label: "Classement", id: "leaderboard" },
  { icon: Gift, label: "Récompenses", id: "rewards" },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => (
  <aside className="w-20 lg:w-64 h-screen glass-card border-r border-border/50 flex flex-col py-6 shrink-0">
    <div className="px-4 lg:px-6 mb-10">
      <h1 className="text-xl font-bold hidden lg:block">
        <span className="text-primary">close</span>
        <span className="text-muted-foreground">.io</span>
      </h1>
      <span className="text-primary font-bold text-xl lg:hidden block text-center">C</span>
    </div>
    <nav className="flex-1 space-y-1 px-2 lg:px-3">
      {navItems.map(({ icon: Icon, label, id }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
            activeTab === id
              ? "bg-primary/10 text-primary glow-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <Icon size={20} />
          <span className="hidden lg:inline text-sm font-medium">{label}</span>
        </button>
      ))}
    </nav>
    <div className="px-2 lg:px-3">
      <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
        <Settings size={20} />
        <span className="hidden lg:inline text-sm font-medium">Paramètres</span>
      </button>
    </div>
  </aside>
);

export default Sidebar;
