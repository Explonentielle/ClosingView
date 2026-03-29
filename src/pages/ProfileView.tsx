import { Mail, Phone, MapPin, Calendar, Trophy, Target, TrendingUp, Users, Zap } from "lucide-react";
import CloserBadge, { BADGE_CONFIGS, getBadgesForCA } from "@/components/CloserBadge";

const profile = {
  name: "Julien De Bonnières",
  initials: "JDB",
  role: "Senior Closer",
  email: "julien.debonnieres@closeone.io",
  phone: "+33 6 12 34 56 78",
  city: "Paris, France",
  memberSince: "Janvier 2024",
  caTotal: 950000,
  caMensuel: 85000,
  dealsTotal: 42,
  tauxClosing: 74,
  certified: true,
};

const earnedBadges = getBadgesForCA(profile.caMensuel, profile.certified);

const badgeProgressData = BADGE_CONFIGS.filter((b) => b.key !== "certified").map((b) => {
  const pct = Math.min(100, Math.round((profile.caMensuel / b.threshold) * 100));
  return { ...b, progress: pct, unlocked: profile.caMensuel >= b.threshold };
});

const ProfileView = () => (
  <div className="space-y-6 animate-slide-up">
    <div>
      <h2 className="text-2xl font-bold">Profil</h2>
      <p className="text-muted-foreground text-sm mt-1">Votre espace personnel</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-6">
      {/* LEFT CARD */}
      <div className="glass-card p-6 flex flex-col items-center text-center space-y-5" style={{ borderRadius: 16 }}>
        <div className="w-[100px] h-[100px] rounded-full gradient-primary flex items-center justify-center text-[28px] font-bold text-primary-foreground">
          {profile.initials}
        </div>
        <div>
          <h3 className="font-bold text-xl">{profile.name}</h3>
          <p className="text-sm text-[#A0A0A0]">{profile.role}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-[#A0A0A0] tracking-[1.5px] mb-3">BADGES GAGNÉS</p>
          <div className="flex flex-wrap justify-center gap-2">
            {earnedBadges.map((b) => (
              <CloserBadge key={b.key} badge={b} />
            ))}
          </div>
        </div>

        <div className="space-y-2 text-sm text-[#A0A0A0] w-full text-left">
          <div className="flex items-center gap-3"><Mail size={14} /> {profile.email}</div>
          <div className="flex items-center gap-3"><Phone size={14} /> {profile.phone}</div>
          <div className="flex items-center gap-3"><MapPin size={14} /> {profile.city}</div>
          <div className="flex items-center gap-3"><Calendar size={14} /> Membre depuis {profile.memberSince}</div>
        </div>

        <button className="w-full h-10 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
          Modifier mon profil
        </button>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">
        {/* Performance Card */}
        <div className="glass-card p-6" style={{ borderRadius: 16 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-[22px]">Performance Mensuelle</h3>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "#8B5CF620", color: "#8B5CF6" }}>
              <Zap size={12} /> Top 5%
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Trophy, label: "CA Mensuel", value: `€${(profile.caMensuel).toLocaleString()}`, highlight: true },
              { icon: Target, label: "CA Total", value: `€${(profile.caTotal).toLocaleString()}`, highlight: false },
              { icon: TrendingUp, label: "Deals Total", value: String(profile.dealsTotal), highlight: false },
              { icon: Users, label: "Taux closing", value: `${profile.tauxClosing}%`, highlight: false },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon size={20} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.highlight ? "text-primary" : ""}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badge Progression Card */}
        <div className="glass-card p-6" style={{ borderRadius: 16 }}>
          <h3 className="font-semibold text-[22px] mb-5">Progression des Badges</h3>
          <div className="space-y-4">
            {badgeProgressData.map((b) => (
              <div key={b.key} className="flex items-center gap-3">
                <CloserBadge badge={b} size={28} locked={!b.unlocked} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${b.unlocked ? "" : "text-[#A0A0A0]"}`}>{b.name}</span>
                    <span className="text-xs text-muted-foreground">€{b.threshold.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: "#2A2F35" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${b.progress}%`, backgroundColor: "#00C27A" }}
                    />
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground w-10 text-right">{b.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileView;
