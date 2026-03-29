import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell } from "lucide-react";

const Layout = () => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-border/50 bg-card/60 backdrop-blur-md flex items-center justify-end px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-card" />
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">Julien De Bonnières</p>
              <p className="text-[11px] text-muted-foreground">Senior Closer</p>
            </div>
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              JDB
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default Layout;
