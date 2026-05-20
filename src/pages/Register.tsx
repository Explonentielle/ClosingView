import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";

const strength = (p: string) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s; // 0..4
};

const Register = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => { if (session) navigate("/dashboard", { replace: true }); }, [session, navigate]);

  const s = strength(password);
  const strengthColors = ["#2a3a50", "#F87171", "#EFB027", "#9B7FE8", "#0EFF9C"];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (password.length < 8) return setErr("Mot de passe : 8 caractères minimum.");
    if (password !== confirm) return setErr("Les mots de passe ne correspondent pas.");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { first_name: firstName, last_name: lastName },
      },
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    setDone(true);
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) setErr((result.error as Error).message);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0D1117" }}>
        <div
          className="w-full max-w-[380px] p-8 rounded-[14px] border-hair text-center"
          style={{ background: "#161d2e", borderColor: "#2a3a50" }}
        >
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: "#0EFF9C18", color: "#0EFF9C" }}
          ><Mail size={24} /></div>
          <h2 className="text-[16px] font-bold text-white mb-2">Vérifie ton email</h2>
          <p className="text-[12px]" style={{ color: "#8892a0" }}>
            On t'a envoyé un lien de confirmation à <span style={{ color: "#0EFF9C" }}>{email}</span>.
          </p>
          <Link to="/login" className="mt-5 inline-block text-[11px] font-semibold" style={{ color: "#0EFF9C" }}>
            Retour à la connexion →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "#0D1117" }}>
      <div
        className="w-full max-w-[380px] p-8 rounded-[14px] border-hair"
        style={{ background: "#161d2e", borderColor: "#2a3a50" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-[6px] rotate-45" style={{ background: "#0EFF9C" }} />
          <h1 className="text-[18px] font-bold text-white">Closing View</h1>
        </div>
        <p className="text-[14px] mb-5" style={{ color: "#8892a0" }}>Crée ton compte ✨</p>
        <div className="border-t-[0.5px] mb-5" style={{ borderColor: "#2a3a50" }} />

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input required placeholder="Prénom" value={firstName} onChange={e => setFirstName(e.target.value)}
              className="h-10 px-3 rounded-[8px] text-[13px] text-white outline-none border-hair"
              style={{ background: "#0D1117", borderColor: "#2a3a50" }} />
            <input required placeholder="Nom" value={lastName} onChange={e => setLastName(e.target.value)}
              className="h-10 px-3 rounded-[8px] text-[13px] text-white outline-none border-hair"
              style={{ background: "#0D1117", borderColor: "#2a3a50" }} />
          </div>
          <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full h-10 px-3 rounded-[8px] text-[13px] text-white outline-none border-hair"
            style={{ background: "#0D1117", borderColor: "#2a3a50" }} />

          <div className="relative">
            <input type={show ? "text" : "password"} required placeholder="Mot de passe (8+ caractères)"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full h-10 px-3 pr-10 rounded-[8px] text-[13px] text-white outline-none border-hair"
              style={{ background: "#0D1117", borderColor: "#2a3a50" }} />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "#6b7a99" }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && (
            <div className="flex gap-1">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex-1 h-1 rounded-full"
                  style={{ background: i < s ? strengthColors[s] : "#2a3a50" }} />
              ))}
            </div>
          )}

          <input type={show ? "text" : "password"} required placeholder="Confirme le mot de passe"
            value={confirm} onChange={e => setConfirm(e.target.value)}
            className="w-full h-10 px-3 rounded-[8px] text-[13px] text-white outline-none border-hair"
            style={{ background: "#0D1117", borderColor: "#2a3a50" }} />

          {err && <p className="text-[11px]" style={{ color: "#F87171" }}>{err}</p>}

          <button type="submit" disabled={loading}
            className="w-full h-10 rounded-[8px] text-[12px] font-bold tracking-wide disabled:opacity-60"
            style={{ background: "#0EFF9C", color: "#0D1117" }}>
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: "#2a3a50" }} />
          <span className="text-[10px]" style={{ color: "#6b7a99" }}>ou</span>
          <div className="flex-1 h-px" style={{ background: "#2a3a50" }} />
        </div>

        <button onClick={google}
          className="w-full h-10 rounded-[8px] text-[12px] font-semibold text-white border-hair flex items-center justify-center gap-2 hover:bg-white/[0.03]"
          style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <Link to="/login" className="mt-5 block text-center text-[11px] font-semibold" style={{ color: "#0EFF9C" }}>
          Déjà un compte ? Se connecter →
        </Link>
      </div>
    </div>
  );
};

export default Register;
