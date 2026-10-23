import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Button, LogOutIcon, ShieldIcon, TicketIcon } from "../shared";
import { useState } from "react";

const linkClass = ({ isActive }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-surface-3 text-white" : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5",
  ].join(" ");

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/80 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 font-display text-sm font-bold text-white shadow-lg shadow-brand-950/50">
            E
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Eventra
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/events" className={linkClass}>
            Events
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-registrations" className={linkClass}>
              My Registrations
            </NavLink>
          )}
          {isAdmin && (
            <>
              <NavLink to="/admin/events" className={linkClass}>
                Manage Events
              </NavLink>
              <NavLink to="/admin/users" className={linkClass}>
                Users
              </NavLink>
              <NavLink to="/admin/registrations" className={linkClass}>
                Activity
              </NavLink>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-300 hover:bg-white/5"
              >
                {isAdmin ? (
                  <ShieldIcon className="h-4 w-4 text-brand-500" width={16} height={16} />
                ) : (
                  <TicketIcon className="h-4 w-4 text-brand-500" width={16} height={16} />
                )}
                <span className="max-w-[8rem] truncate font-medium">{user?.name}</span>
              </NavLink>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOutIcon width={16} height={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={NavLink} to="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button as={NavLink} to="/register" variant="primary" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-zinc-300 hover:bg-white/5 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-surface-border/80 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink to="/events" className={linkClass} onClick={() => setMenuOpen(false)}>
              Events
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/my-registrations"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                My Registrations
              </NavLink>
            )}
            {isAdmin && (
              <>
                <NavLink to="/admin/events" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Manage Events
                </NavLink>
                <NavLink to="/admin/users" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Users
                </NavLink>
                <NavLink
                  to="/admin/registrations"
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Activity
                </NavLink>
              </>
            )}
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-brand-400 hover:bg-white/5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
