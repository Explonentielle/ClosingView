import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, BarChart3, Users, Zap, CheckCircle } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]);

  return (
    <div style={{ background: "#0D1117" }}>
      {/* Navigation */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 border-b"
        style={{ borderColor: "#2a3a50" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 sm:w-8 h-6 sm:h-8 rounded-[6px] rotate-45"
            style={{ background: "#0EFF9C" }}
          />
          <span className="text-sm sm:text-lg font-bold text-white">Closing View</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-2 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[12px] font-bold rounded-lg transition-150"
            style={{ color: "#0EFF9C" }}
          >
            Connexion
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-2 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[12px] font-bold rounded-lg transition-150"
            style={{ background: "#0EFF9C", color: "#0D1117" }}
          >
            S'inscrire
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-4 sm:px-8 py-12 sm:py-32 text-center max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
          Maîtrisez votre <span style={{ color: "#0EFF9C" }}>Closing</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base mb-6 sm:mb-8" style={{ color: "#8892a0" }}>
          La plateforme tout-en-un pour les closers. Suivez vos performances,
          <br />
          gérez vos clients et optimisez votre taux de closing en temps réel.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-[10px] sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-150 hover:scale-105"
            style={{ background: "#0EFF9C", color: "#0D1117" }}
          >
            Commencer gratuitement <ArrowRight size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-[10px] sm:text-[13px] font-bold border-hair transition-150"
            style={{ borderColor: "#2a3a50", color: "#0EFF9C" }}
          >
            J'ai déjà un compte
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 sm:px-8 py-12 sm:py-20 bg-gradient-to-b from-transparent to-[#161d2e] border-t" style={{ borderColor: "#2a3a50" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 sm:mb-16">
            Tout ce dont vous avez besoin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                icon: <BarChart3 size={20} className="sm:w-6 sm:h-6" />,
                title: "Statistiques en temps réel",
                desc: "Suivi détaillé de vos closes, commissions et taux de closing",
                color: "#0EFF9C",
              },
              {
                icon: <Users size={20} className="sm:w-6 sm:h-6" />,
                title: "Gestion de clients",
                desc: "Organisez vos prospects, offres et historique de ventes",
                color: "#EFB027",
              },
              {
                icon: <Zap size={20} className="sm:w-6 sm:h-6" />,
                title: "Performance optimisée",
                desc: "Tableaux de bord, objectifs et rapport détaillés pour progresser",
                color: "#3B82F6",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-4 sm:p-6 rounded-[14px] border-hair"
                style={{ background: "#0a0f1a", borderColor: "#2a3a50" }}
              >
                <div
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4"
                  style={{ background: `${f.color}18`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-[13px] sm:text-[16px] font-bold text-white mb-2">{f.title}</h3>
                <p style={{ color: "#8892a0", fontSize: "clamp(12px, 2.5vw, 14px)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="px-4 sm:px-8 py-12 sm:py-20 border-t" style={{ borderColor: "#2a3a50" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 sm:mb-16">
            Plans tarifaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Free Plan */}
            <div
              className="p-4 sm:p-8 rounded-[14px] border-hair"
              style={{ background: "#161d2e", borderColor: "#2a3a50" }}
            >
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">Starter</h3>
              <p style={{ color: "#8892a0", fontSize: "clamp(12px, 2vw, 14px)", marginBottom: "12px" }}>
                Idéal pour débuter
              </p>
              <div className="mb-4 sm:mb-6">
                <span className="text-2xl sm:text-4xl font-bold text-white">Gratuit</span>
                <span style={{ color: "#8892a0" }}>/mois</span>
              </div>
              <button
                onClick={() => navigate("/register")}
                className="w-full py-2 sm:py-3 rounded-lg text-[10px] sm:text-[12px] font-bold border-hair transition-150 mb-4 sm:mb-6"
                style={{ borderColor: "#0EFF9C", color: "#0EFF9C" }}
              >
                S'inscrire maintenant
              </button>
              <div className="space-y-2 sm:space-y-3">
                {[
                  "Jusqu'à 10 clients",
                  "Tableau de bord basique",
                  "Suivi des performances",
                  "Support email",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle size={14} className="sm:w-4 sm:h-4 flex-shrink-0" color="#0EFF9C" />
                    <span style={{ color: "#FFFFFF", fontSize: "clamp(12px, 2vw, 14px)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Plan (Coming Soon) */}
            <div
              className="p-4 sm:p-8 rounded-[14px] border-hair relative opacity-60"
              style={{ background: "#161d2e", borderColor: "#EFB027" }}
            >
              <div
                className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold"
                style={{ background: "#EFB027", color: "#0D1117" }}
              >
                Bientôt disponible
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">Professional</h3>
              <p style={{ color: "#8892a0", fontSize: "clamp(12px, 2vw, 14px)", marginBottom: "12px" }}>
                Pour les pros
              </p>
              <div className="mb-4 sm:mb-6">
                <span className="text-2xl sm:text-4xl font-bold text-white">29€</span>
                <span style={{ color: "#8892a0" }}>/mois</span>
              </div>
              <button
                disabled
                className="w-full py-2 sm:py-3 rounded-lg text-[10px] sm:text-[12px] font-bold transition-150 mb-4 sm:mb-6 cursor-not-allowed"
                style={{ background: "#EFB027", color: "#0D1117" }}
              >
                Indisponible
              </button>
              <div className="space-y-2 sm:space-y-3">
                {[
                  "Clients illimités",
                  "Analytics avancées",
                  "Rapports personnalisés",
                  "API access",
                  "Support prioritaire",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle size={14} className="sm:w-4 sm:h-4 flex-shrink-0" color="#EFB027" />
                    <span style={{ color: "#FFFFFF", fontSize: "clamp(12px, 2vw, 14px)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center mt-6 sm:mt-8" style={{ color: "#8892a0", fontSize: "clamp(12px, 2vw, 14px)" }}>
            Le plan Professional sera disponible prochainement. La plateforme est actuellement
            gratuite pendant la période de béta.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div
        className="px-4 sm:px-8 py-12 sm:py-20 text-center border-t"
        style={{ borderColor: "#2a3a50" }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
          Prêt à décoller?
        </h2>
        <p className="text-xs sm:text-sm md:text-base mb-6 sm:mb-8" style={{ color: "#8892a0" }}>
          Rejoignez des closers qui font confiance à Closing View
        </p>
        <button
          onClick={() => navigate("/register")}
          className="px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-[10px] sm:text-[13px] font-bold flex items-center justify-center gap-2 mx-auto transition-150 hover:scale-105"
          style={{ background: "#0EFF9C", color: "#0D1117" }}
        >
          Créer mon compte gratuitement <ArrowRight size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Footer */}
      <div
        className="px-4 sm:px-8 py-6 sm:py-8 text-center border-t"
        style={{ borderColor: "#2a3a50" }}
      >
        <p style={{ color: "#6b7a99", fontSize: "clamp(10px, 2vw, 12px)" }}>
          © 2026 Closing View. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default Landing;
