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
        {profileLoading ? (
          <div className="text-sm text-muted-foreground">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Prénom</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Nom</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  placeholder="Nom"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className={`${inputClass} opacity-50 cursor-not-allowed`}
              />
              <p className="text-xs text-muted-foreground mt-1">L'email ne peut pas être modifié</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Téléphone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+33 6 __ __ __ __"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Ville</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                  placeholder="Paris"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Ans d'expérience</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          </>
        )}
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

      <button
        onClick={handleSave}
        disabled={saving || profileLoading}
        className="w-full h-11 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Sauvegarde..." : "Sauvegarder"}
      </button>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </div>
  );
};

export default SettingsView;
