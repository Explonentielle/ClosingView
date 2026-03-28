import { Settings, User, Bell, Shield, Palette } from "lucide-react";
import { toast } from "sonner";

const SettingsView = () => {
  const handleSave = () => toast.success("Paramètres sauvegardés !");

  const inputClass = "w-full h-11 rounded-lg border border-input bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold">Paramètres</h2>
        <p className="text-muted-foreground text-sm mt-1">Gérez votre compte et vos préférences</p>
      </div>

      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <User size={18} className="text-primary" />
          <h3 className="font-semibold">Profil</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Prénom</label>
            <input defaultValue="Jean" className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Nom</label>
            <input defaultValue="Dupont" className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
          <input defaultValue="jean@closeone.io" className={inputClass} />
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={18} className="text-primary" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        {["Nouveaux deals", "Objectifs atteints", "Classement mis à jour"].map((n) => (
          <label key={n} className="flex items-center justify-between py-2">
            <span className="text-sm">{n}</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-primary" />
          </label>
        ))}
      </div>

      <button onClick={handleSave} className="w-full h-11 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
        Sauvegarder
      </button>
    </div>
  );
};

export default SettingsView;
