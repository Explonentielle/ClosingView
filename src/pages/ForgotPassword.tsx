import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/services";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email requis");
      return;
    }

    setLoading(true);
    setError(null);

    const success = await resetPassword(email);
    setLoading(false);

    if (success) {
      setSent(true);
    } else {
      setError("Erreur lors de l'envoi. Vérifiez votre email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] p-4">
      <div className="w-full max-w-[400px] rounded-[16px] border border-[#2a3a50] p-8 bg-[#161d2e]">
        {!sent ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-[12px] text-[#8892a0] hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              Retour à la connexion
            </button>

            <div className="text-center mb-6">
              <Mail size={32} className="mx-auto mb-3" style={{ color: "#0EFF9C" }} />
              <h1 className="text-[20px] font-bold text-white">Mot de passe oublié?</h1>
              <p className="text-[12px] text-[#8892a0] mt-2">
                Entrez votre email pour recevoir un lien de réinitialisation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase tracking-wide font-bold text-[#8892a0] mb-1 block">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full h-10 px-3 rounded-[8px] border border-[#2a3a50] bg-[#0D1117] text-white text-[12px] outline-none focus:border-[#0EFF9C] transition-colors"
                  disabled={loading}
                />
              </label>

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
                {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-[40px]">✅</div>
            <h2 className="text-[18px] font-bold text-white">Email envoyé!</h2>
            <p className="text-[12px] text-[#8892a0]">
              Vérifiez votre boîte mail pour le lien de réinitialisation. Le lien expire dans 24h.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full h-10 rounded-[8px] font-bold text-[12px] transition-all mt-6"
              style={{
                background: "#0EFF9C",
                color: "#0D1117",
              }}
            >
              Retour à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
