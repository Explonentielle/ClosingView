import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
);

export default Layout;
