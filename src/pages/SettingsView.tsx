import { useState } from "react";
import { User, Bell, Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import { responsiveClass } from "@/lib/responsive";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";

const SettingsView = () => {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const handleSave = () => toast.success("Paramètres sauvegardés !");

  const inputClass = "w-full h-11 rounded-lg border border-input bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <div className={`${responsiveClass.tightContainer} space-y-6 animate-slide-up`}>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">Paramètres</h2>
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

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={18} className="text-primary" />
          <h3 className="font-semibold">Sécurité</h3>
        </div>
        <button
          onClick={() => setChangePasswordOpen(true)}
          className="w-full h-11 rounded-lg border border-primary/30 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
        >
          <Lock size={16} />
          Changer le mot de passe
        </button>
      </div>

      <button onClick={handleSave} className="w-full h-11 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
        Sauvegarder
      </button>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </div>
  );
};

export default SettingsView;
