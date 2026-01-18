import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wrench,
  FolderOpen,
  Phone,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "About", path: "/admin/about", icon: Users },
    // { name: "Services", path: "/admin/services", icon: Wrench },
    { name: "Projects", path: "/admin/projects", icon: FolderOpen },
    { name: "Contact", path: "/admin/contact", icon: Phone },
    { name: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
  ];

  return (
    <>
      {/* MOBILE TOP BAR - Enhanced */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow-lg border-b border-gray-800">
        <span className="font-bold text-xl tracking-tight">RK Admin</span>
        <button 
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* OVERLAY - Smoother animation */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR - Optimized mobile styles */}
      <aside
        className={`
          fixed md:static top-12 md:top-0 left-0 z-50
          h-[calc(100vh-3rem)] md:h-screen w-72 md:w-64 bg-gray-900 text-white
          shadow-2xl md:shadow-none border-r border-gray-800
          transform transition-all duration-300 ease-in-out
          ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"}
          md:translate-x-0
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* HEADER - Better mobile spacing */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
          <div>
            <h2 className="font-bold text-xl leading-tight">
              RK Constructions
            </h2>
            {/* <span className="block text-xs text-gray-400 font-medium tracking-wide uppercase mt-1">
              Admin Panel
            </span> */}
          </div>
          <button 
            onClick={() => setOpen(false)} 
            className="md:hidden p-2 rounded-xl hover:bg-gray-800 transition-colors duration-200"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* NAV - Improved touch targets & spacing */}
        <nav className="px-4 py-6 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {links.map(({ name, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={name}
                to={path}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-medium
                  transition-all duration-200 group min-h-[56px]
                  ${active
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-200 hover:bg-gray-800/50 hover:text-white hover:shadow-md"
                  }
                  active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                `}
                role="menuitem"
              >
                <Icon size={22} className={`${active ? 'drop-shadow-sm' : ''} flex-shrink-0`} />
                <span className="whitespace-nowrap">{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT - Better prominence */}
        <div className="p-6 pt-0 border-t border-gray-800 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl
                       bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-200 
                       hover:from-red-600/30 hover:to-red-700/30 hover:text-red-100
                       border border-red-500/30 hover:border-red-500/50
                       transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/20
                       active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900
                       min-h-[56px]"
          >
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Prevent body scroll on mobile when sidebar open */}
      <style >{`
        @media (max-width: 768px) {
          body:has(.sidebar-open) {
            overflow: hidden;
            position: fixed;
            width: 100%;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
