import React, { useState } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContent";

export const Navbar: React.FC<{ appName?: string }> = ({ appName = "Attendance App" }) => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: App Name */}
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-red-600">{appName}</div>
        </div>

        {/* Right: Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setOpen(!open)}
            aria-haspopup="true"
            aria-expanded={open}
          >
            <User size={18} />
            <span className="hidden sm:inline capitalize">{user.name || "User"}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded shadow z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
