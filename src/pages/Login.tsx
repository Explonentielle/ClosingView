import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signIn, signInWithGoogle } from "@/services";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { if (session) navigate("/dashboard", { replace: true }); }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const session = await signIn(email, password);
    setLoading(false);
    if (!session) {
      setErr("Email ou mot de passe incorrect");
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  const google = async () => {
    setErr(null);
    setLoading(true);
    const session = await signInWithGoogle();
    setLoading(false);
    if (!session) {
      setErr("Erreur lors de la connexion Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0D1117" }}>
      <div
        className="w-full max-w-[380px] p-8 rounded-[14px] border-hair"
        style={{ background: "#161d2e", borderColor: "#2a3a50" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-[6px] rotate-45" style={{ background: "#0EFF9C" }} />
          <h1 className="text-[18px] font-bold text-white">Closing View</h1>
        </div>
        <p className="text-[14px] mb-5" style={{ color: "#8892a0" }}>Bienvenue 👋</p>
        <div className="border-t-[0.5px] mb-5" style={{ borderColor: "#2a3a50" }} />

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#8892a0" }}>Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-[8px] text-[13px] text-white outline-none border-hair"
              style={{ background: "#0D1117", borderColor: "#2a3a50" }}
              placeholder="vous@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#8892a0" }}>Mot de passe</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 pr-10 rounded-[8px] text-[13px] text-white outline-none border-hair"
                style={{ background: "#0D1117", borderColor: "#2a3a50" }}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "#6b7a99" }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {err && <p className="mt-1.5 text-[11px]" style={{ color: "#F87171" }}>{err}</p>}
            <Link to="/forgot-password" className="block mt-2 text-[11px] font-semibold hover:text-white transition-colors" style={{ color: "#0EFF9C" }}>
              Mot de passe oublié?
            </Link>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full h-10 rounded-[8px] text-[12px] font-bold tracking-wide transition-150 disabled:opacity-60"
            style={{ background: "#0EFF9C", color: "#0D1117" }}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: "#2a3a50" }} />
          <span className="text-[10px]" style={{ color: "#6b7a99" }}>ou</span>
          <div className="flex-1 h-px" style={{ background: "#2a3a50" }} />
        </div>

        <button
          onClick={google}
          className="w-full h-10 rounded-[8px] text-[12px] font-semibold text-white border-hair flex items-center justify-center gap-2 transition-150 hover:bg-white/[0.03]"
          style={{ background: "#161d2e", borderColor: "#2a3a50" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <div className="mt-5 text-center space-y-1.5">
          <Link to="/register" className="block text-[11px] font-semibold" style={{ color: "#0EFF9C" }}>
            Pas encore de compte ? S'inscrire →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
