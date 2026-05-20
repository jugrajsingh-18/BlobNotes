import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="h-screen w-full flex overflow-hidden">
      
      {/* Sidebar */}
      <div className="shrink-0">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

    </div>
  );
}