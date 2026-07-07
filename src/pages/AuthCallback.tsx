import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Extraire les paramètres du hash fragment (#access_token=...)
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");
        const refreshToken = hashParams.get("refresh_token");

        if (!accessToken) {
          console.error("No access token found");
          navigate("/login", { replace: true });
          return;
        }

        console.log("Auth callback: type=", type, "token exists=", !!accessToken);

        // Définir la session avec le token
        const sessionData: any = {
          access_token: accessToken,
        };

        if (refreshToken) {
          sessionData.refresh_token = refreshToken;
        }

        const { error: sessionError, data } = await supabase.auth.setSession(sessionData);

        if (sessionError) {
          console.error("Session error:", sessionError);
          // Pour signup/email_change, on continue quand même
          if (type !== "signup" && type !== "email_change") {
            navigate("/login", { replace: true });
            return;
          }
        }

        // Vérifier que la session est bien établie
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session after setSession:", !!session);

        // Attendre un peu pour que la session soit prête
        await new Promise(resolve => setTimeout(resolve, 500));

        // Rediriger selon le type de token
        if (type === "recovery") {
          // C'est un lien de reset password
          navigate(`/reset-password?access_token=${accessToken}`, { replace: true });
        } else if (type === "signup" || type === "email_change") {
          // Après inscription ou changement d'email, aller au dashboard
          navigate("/dashboard", { replace: true });
        } else {
          // Par défaut, aller au dashboard
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, location.hash]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0D1117]">
      <div className="text-center">
        {loading && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0EFF9C] mx-auto mb-4" />
            <p style={{ color: "#8892a0" }}>Vérification de votre session...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
