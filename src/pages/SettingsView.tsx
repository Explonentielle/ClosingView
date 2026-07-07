import { useState, useEffect } from "react";
import { User, Bell, Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { updateProfile } from "@/services";
import { responsiveClass } from "@/lib/responsive";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";

const SettingsView = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "");
      setExperienceYears(profile.experience_years || 0);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const updated = await updateProfile(user.id, {
      first_name: firstName,
      last_name: lastName,
      phone,
      city,
      experience_years: experienceYears,
    });
    setSaving(false);

    if (updated) {
      toast.success("Profil mis à jour !");
    } else {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const inputClass = "w-full h-11 rounded-lg border border-input bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <div className={`${responsiveClass.tightContainer} space-y-4 sm:space-y-6 animate-slide-up px-3 sm:px-0`}>
      <div>
        <h2 className="text-lg sm:text-2xl font-bold">Paramètres</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">Gérez votre compte et vos préférences</p>
      </div>

      <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <User size={16} className="sm:w-[18px] sm:h-[18px] text-primary" />
          <h3 className="font-semibold text-sm sm:text-base">Profil</h3>
        </div>
        {profileLoading ? (
          <div className="text-xs sm:text-sm text-muted-foreground">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 block">Prénom</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass + " text-xs sm:text-sm"}
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 block">Nom</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass + " text-xs sm:text-sm"}
                  placeholder="Nom"
                />
              </div>
            </div>
            <div>
              <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className={`${inputClass} opacity-50 cursor-not-allowed text-xs sm:text-sm`}
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">L'email ne peut pas être modifié</p>
            </div>
            <div>
              <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 block">Téléphone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass + " text-xs sm:text-sm"}
                placeholder="+33 6 __ __ __ __"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 block">Ville</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass + " text-xs sm:text-sm"}
                  placeholder="Paris"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 block">Ans d'expérience</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className={inputClass + " text-xs sm:text-sm"}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={16} className="sm:w-[18px] sm:h-[18px] text-primary" />
          <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>
        </div>
        {["Nouveaux deals", "Objectifs atteints", "Classement mis à jour"].map((n) => (
          <label key={n} className="flex items-center justify-between py-2">
            <span className="text-xs sm:text-sm">{n}</span>
            <input type="checkbox" defaultChecked className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded accent-primary" />
          </label>
        ))}
      </div>

      <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={16} className="sm:w-[18px] sm:h-[18px] text-primary" />
          <h3 className="font-semibold text-sm sm:text-base">Sécurité</h3>
        </div>
        <button
          onClick={() => setChangePasswordOpen(true)}
          className="w-full h-9 sm:h-11 rounded-lg border border-primary/30 text-primary font-semibold text-xs sm:text-sm hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
        >
          <Lock size={14} className="sm:w-4 sm:h-4" />
          Changer le mot de passe
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || profileLoading}
        className="w-full h-9 sm:h-11 rounded-lg gradient-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Sauvegarde..." : "Sauvegarder"}
      </button>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </div>
  );
};

export default SettingsView;
