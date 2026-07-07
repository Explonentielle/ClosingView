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
        const token = hashParams.get("access_token");
        const type = hashParams.get("type");
        const email = hashParams.get("email");
        const refreshToken = hashParams.get("refresh_token");

        if (!token) {
          console.error("No token found");
          navigate("/login", { replace: true });
          return;
        }

        console.log("Auth callback: type=", type, "token=", token, "email=", email);

        // Si c'est un OTP (6 chiffres) et type=signup, utiliser verifyOtp
        if (type === "signup" && email && /^\d{6}$/.test(token)) {
          console.log("Verifying OTP for signup...");
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: "email",
          });

          if (error) {
            console.error("OTP verification error:", error);
            navigate("/login", { replace: true });
            return;
          }

          console.log("OTP verified, user logged in");
          await new Promise(resolve => setTimeout(resolve, 500));
          navigate("/dashboard", { replace: true });
          return;
        }

        // Sinon, c'est un vrai token - faire setSession
        const sessionData: any = {
          access_token: token,
        };

        if (refreshToken) {
          sessionData.refresh_token = refreshToken;
        }

        const { error: sessionError } = await supabase.auth.setSession(sessionData);

        if (sessionError) {
          console.error("Session error:", sessionError);
          if (type !== "recovery" && type !== "email_change") {
            navigate("/login", { replace: true });
            return;
          }
        }

        // Rediriger selon le type de token
        if (type === "recovery") {
          navigate(`/reset-password?access_token=${token}`, { replace: true });
        } else if (type === "email_change") {
          navigate("/dashboard", { replace: true });
        } else {
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
