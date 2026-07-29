import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { updatePassword } from "@/services";
import { ModalOverlay } from "./ModalOverlay";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    if (!loading && !success) {
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      onClose();
    }
  };

  if (!open) return null;

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "Au minimum 8 caractères";
    if (!/[A-Z]/.test(pwd)) return "Au minimum une lettre majuscule";
    if (!/[0-9]/.test(pwd)) return "Au minimum un chiffre";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError("Tous les champs sont requis");
      return;
    }

    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    const result = await updatePassword(newPassword);
    setLoading(false);

    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setNewPassword("");
        setConfirmPassword("");
        setSuccess(false);
        onClose();
      }, 2000);
    } else {
      setError("Erreur lors de la mise à jour du mot de passe");
    }
  };

  return (
    <ModalOverlay
      open={open}
      onClose={handleClose}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      overlayStyle={{ background: "rgba(13,17,23,0.75)", backdropFilter: "blur(8px)" }}
      contentClassName="w-full max-w-[400px] rounded-[14px] border border-[#2a3a50] p-6 bg-[#161d2e]"
    >
        <div className="flex items-center justify-between mb-4">
          <DialogPrimitive.Title asChild>
            <h2 className="text-[14px] font-bold text-white">Changer le mot de passe</h2>
          </DialogPrimitive.Title>
          <button
            onClick={handleClose}
            disabled={loading || success}
            className="text-[#8892a0] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nouveau mot de passe */}
            <label className="block">
              <span className="text-[10px] uppercase tracking-wide font-bold text-[#8892a0] mb-1 block">
                Nouveau mot de passe
              </span>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full h-10 px-3 pr-10 rounded-[8px] border border-[#2a3a50] bg-[#0D1117] text-white text-[12px] outline-none focus:border-[#0EFF9C] transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892a0] hover:text-white"
                  disabled={loading}
                >
                  {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </label>

            {/* Confirmation mot de passe */}
            <label className="block">
              <span className="text-[10px] uppercase tracking-wide font-bold text-[#8892a0] mb-1 block">
                Confirmer le mot de passe
              </span>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full h-10 px-3 pr-10 rounded-[8px] border border-[#2a3a50] bg-[#0D1117] text-white text-[12px] outline-none focus:border-[#0EFF9C] transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892a0] hover:text-white"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </label>

            {/* Validation message */}
            {newPassword && (
              <div className="p-2 rounded-[6px] bg-blue-500/10 border border-blue-500/50">
                <p className="text-blue-400 text-[10px]">
                  ✓ Min. 8 caractères, 1 majuscule, 1 chiffre
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-[8px] bg-red-500/10 border border-red-500/50">
                <p className="text-red-400 text-[11px]">{error}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 h-10 rounded-[8px] text-[12px] font-bold border border-[#2a3a50] text-[#8892a0] hover:text-white transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-10 rounded-[8px] text-[12px] font-bold transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "#0EFF9C",
                  color: "#0D1117",
                }}
              >
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-3">
            <div className="text-[32px]">✅</div>
            <h3 className="text-[14px] font-bold text-white">Mot de passe mis à jour!</h3>
            <p className="text-[12px] text-[#8892a0]">Fermeture...</p>
          </div>
        )}
    </ModalOverlay>
  );
};
