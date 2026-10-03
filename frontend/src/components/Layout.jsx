import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-content">
        <Navbar />

        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
