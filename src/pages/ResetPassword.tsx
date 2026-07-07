import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { updatePassword } from "@/services";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Supabase envoie access_token dans le hash fragment
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const accessToken = hashParams.get("access_token");

    // Ou en query parameter
    const queryToken = searchParams.get("access_token");
    const token = accessToken || queryToken;

    if (token) {
      // Définir la session avec le token reçu
      supabase.auth.setSession({
        access_token: token,
        refresh_token: hashParams.get("refresh_token") || "",
      });
    } else {
      setError("Lien de réinitialisation invalide ou expiré.");
    }
  }, [searchParams, location.hash]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "Au minimum 8 caractères";
    if (!/[A-Z]/.test(pwd)) return "Au minimum une lettre majuscule";
    if (!/[0-9]/.test(pwd)) return "Au minimum un chiffre";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Tous les champs sont requis");
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    const success = await updatePassword(password);
    setLoading(false);

    if (success) {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 3000);
    } else {
      setError("Erreur lors de la mise à jour du mot de passe. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] p-4">
      <div className="w-full max-w-[400px] rounded-[16px] border border-[#2a3a50] p-8 bg-[#161d2e]">
        {!success ? (
          <>
            <div className="text-center mb-6">
              <Lock size={32} className="mx-auto mb-3" style={{ color: "#0EFF9C" }} />
              <h1 className="text-[20px] font-bold text-white">Nouveau mot de passe</h1>
              <p className="text-[12px] text-[#8892a0] mt-2">
                Créez un mot de passe sécurisé pour votre compte.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nouveau mot de passe */}
              <label className="block">
                <span className="text-[10px] uppercase tracking-wide font-bold text-[#8892a0] mb-1 block">
                  Nouveau mot de passe
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 pr-10 rounded-[8px] border border-[#2a3a50] bg-[#0D1117] text-white text-[12px] outline-none focus:border-[#0EFF9C] transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892a0] hover:text-white"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
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
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 pr-10 rounded-[8px] border border-[#2a3a50] bg-[#0D1117] text-white text-[12px] outline-none focus:border-[#0EFF9C] transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892a0] hover:text-white"
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </label>

              {/* Validation message */}
              {password && (
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

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-[8px] font-bold text-[12px] transition-all active:scale-[0.98]"
                style={{
                  background: "#0EFF9C",
                  color: "#0D1117",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-[40px]">✅</div>
            <h2 className="text-[18px] font-bold text-white">Mot de passe réinitialisé!</h2>
            <p className="text-[12px] text-[#8892a0]">
              Vous allez être redirigé vers le dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
