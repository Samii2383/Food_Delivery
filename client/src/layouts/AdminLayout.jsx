import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/30">
      <div className="flex">
        <AdminSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="min-h-screen flex-1">
          <AdminHeader user={user} onLogout={logout} onMenuClick={() => setMobileOpen(true)} />

          <motion.main
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="px-4 py-5 sm:px-6"
          >
            <Outlet />
            <AdminFooter />
          </motion.main>
        </div>
      </div>
    </div>
  );
}

