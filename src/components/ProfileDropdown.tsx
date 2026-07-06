import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/services";

interface ProfileDropdownProps {
  initials: string;
}

export const ProfileDropdown = ({ initials }: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const { user, signOut: authSignOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleSignOut = async () => {
    setLoading(true);
    await authSignOut();
    setLoading(false);
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[10px] font-bold hover:opacity-80 transition-opacity cursor-pointer"
        style={{ background: "linear-gradient(135deg,#0EFF9C,#0a8d5e)", color: "#0D1117" }}
        title={user?.email || "Profile"}
      >
        {initials}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-[200px] rounded-[10px] border border-[#2a3a50] bg-[#161d2e] shadow-lg animate-fade-in"
          style={{ zIndex: 1000 }}
        >
          {/* Header with Email */}
          <div className="px-3 py-2 border-b border-[#2a3a50]">
            <p className="text-[10px] text-[#8892a0] font-bold uppercase tracking-wide">Compte</p>
            <p className="text-[11px] text-white mt-1 truncate">{user?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Profile */}
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-[12px] text-white hover:bg-[#2a3a50] transition-colors"
            >
              <User size={14} />
              Mon profil
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-[12px] text-white hover:bg-[#2a3a50] transition-colors"
            >
              <Settings size={14} />
              Paramètres
            </Link>

            {/* Divider */}
            <div className="my-1 h-px" style={{ background: "#2a3a50" }} />

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <LogOut size={14} />
              {loading ? "Déconnexion..." : "Déconnexion"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
