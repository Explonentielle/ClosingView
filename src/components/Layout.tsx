import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import SaisirModal from "./modals/SaisirModal";
import { ProfileDropdown } from "./ProfileDropdown";
import { responsiveClass } from "@/lib/responsive";
import { MessagingProvider } from "@/hooks/useMessaging";
import PrivateMessaging from "@/components/messaging/PrivateMessaging";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useProfile } from "@/hooks/useProfile";
import { usePresence } from "@/hooks/usePresence";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients":   "Mes clients",
  "/stats":     "Statistiques",
  "/network":   "Réseau",
  "/ecosystem": "Écosystème",
  "/profile":   "Profil",
  "/settings":  "Paramètres",
};

const Layout = () => {
  const { pathname } = useLocation();
  const title = titleMap[pathname] ?? "Closing View";
  const isDashboard = pathname.startsWith("/dashboard");
  const [openSaisir, setOpenSaisir] = useState(false);
  const { profile } = useProfile();
  usePresence();

  return (
    <MessagingProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: "#0D1117" }}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header
            className="h-[46px] border-hair flex items-center justify-between px-5 shrink-0"
            style={{ background: "#0a0f1a", borderColor: "#2a3a50" }}
          >
            <h1 className="text-[13px] font-semibold tracking-wide text-white">{title}</h1>

            <div className="flex items-center gap-3">
              {isDashboard && (
                <button
                  onClick={() => setOpenSaisir(true)}
                  className="h-[28px] px-3 rounded-[8px] text-[11px] font-bold tracking-wide transition-150"
                  style={{ background: "#0EFF9C", color: "#0D1117" }}
                >
                  + Saisir
                </button>
              )}
              <div
                className="h-[24px] px-2.5 rounded-full border-hair text-[10px] font-bold flex items-center gap-1.5"
                style={{ borderColor: "#0EFF9C55", color: "#0EFF9C", background: "#0EFF9C12" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#0EFF9C" }} />
                SCORE {profile?.close_score ?? 0}
              </div>
              <ProfileDropdown />
            </div>
          </header>

          <main className={`flex-1 overflow-y-auto ${responsiveClass.mainPadding}`} style={{ background: "#0D1117" }}>
            <Outlet />
          </main>
        </div>

        <SaisirModal open={openSaisir} onClose={() => setOpenSaisir(false)} />
        <PrivateMessaging />
        <OnboardingFlow />
      </div>
    </MessagingProvider>
  );
};

export default Layout;
