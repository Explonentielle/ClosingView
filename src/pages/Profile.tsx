import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Lock, Star, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { responsiveClass } from "@/lib/responsive";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";

interface ActionProps {
  icon: React.ReactNode;
  title: string;
  accent?: boolean;
  onClick?: () => void;
  danger?: boolean;
}

const Action = ({ icon, title, accent, onClick, danger }: ActionProps) => (
  <button
    onClick={onClick}
    className="w-full rounded-[12px] border-hair p-4 flex items-center justify-between transition-150 hover:bg-white/[0.02]"
    style={
      danger
        ? { background: "#F8717110", borderColor: "#F8717155", color: "#F87171" }
        : accent
          ? { background: "#EFB02710", borderColor: "#EFB02755", color: "#EFB027" }
          : { background: "#161d2e", borderColor: "#2a3a50", color: "#FFFFFF" }
    }
  >
    <span className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-[8px] flex items-center justify-center"
        style={{ background: danger ? "#F8717118" : accent ? "#EFB02718" : "#0D1117", color: danger ? "#F87171" : accent ? "#EFB027" : "#8892a0" }}>
        {icon}
      </span>
      <span className="text-[12px] font-bold">{title}</span>
    </span>
    <span className="text-[18px]" style={{ color: danger ? "#F87171" : accent ? "#EFB027" : "#6b7a99" }}>→</span>
  </button>
);

const Profile = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
    navigate("/login");
  };

  return (
  <div className={`animate-fade-in space-y-4 ${responsiveClass.tightContainer}`}>
    {/* Hero card */}
    <div
      className="rounded-[14px] border-hair p-4 sm:p-5"
      style={{
        background: "linear-gradient(135deg,#161d2e,#111827)",
        borderColor: "#2a3a50",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[14px] font-bold"
          style={{
            background: "linear-gradient(135deg,#0EFF9C,#0a8d5e)",
            color: "#0D1117",
            border: "1.5px solid #0EFF9C",
          }}
        >JD</div>
        <div>
          <h2 className="text-[16px] font-bold text-white">Julien De Bonnières</h2>
          <p className="text-[11px]" style={{ color: "#8892a0" }}>Senior Closer · Paris, France</p>
          <div className="flex gap-1.5 mt-1.5">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#0EFF9C18", color: "#0EFF9C" }}>3 ans d'expérience</span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#9B7FE822", color: "#9B7FE8" }}>Score 74</span>
          </div>
        </div>
      </div>

      <div className="my-4 border-t-[0.5px]" style={{ borderColor: "#2a3a50" }} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[9px] uppercase tracking-wider font-bold" style={{ color: "#8892a0" }}>Email</div>
          <div className="text-[12px] text-white mt-0.5">julien@closingview.io</div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-wider font-bold" style={{ color: "#8892a0" }}>Téléphone</div>
          <div className="text-[12px] text-white mt-0.5">+33 6 12 34 56 78</div>
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <Action icon={<Pencil size={14} />} title="Modifier mon profil" />
      <Action
        icon={<Lock size={14} />}
        title="Changer mon mot de passe"
        onClick={() => setChangePasswordOpen(true)}
      />
      <Action icon={<Star size={14} />} title="Gérer mon abonnement" accent />
      <Action
        icon={<LogOut size={14} />}
        title={loading ? "Déconnexion..." : "Déconnexion"}
        danger
        onClick={handleSignOut}
      />
    </div>

    <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
  </div>
  );
};

export default Profile;
