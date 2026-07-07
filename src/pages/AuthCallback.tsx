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
        const expiresIn = hashParams.get("expires_in");

        if (!accessToken) {
          navigate("/dashboard");
          return;
        }

        // Définir la session avec le token
        if (refreshToken && expiresIn) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }

        // Rediriger selon le type de token
        if (type === "recovery") {
          // C'est un lien de reset password
          navigate(`/reset-password?access_token=${accessToken}`);
        } else if (type === "invite") {
          navigate("/dashboard");
        } else {
          // Par défaut, aller au dashboard
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
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
