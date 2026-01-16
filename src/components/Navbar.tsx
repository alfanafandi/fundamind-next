"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  coin: number;
  isAdmin?: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-xl text-white tracking-wider">
              FUNDAMIND
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavLink href="/dashboard" active={isActive("/dashboard")}>
                  🏠 Dashboard
                </NavLink>
                <NavLink href="/quest" active={isActive("/quest")}>
                  ⚔️ Quest
                </NavLink>
                <NavLink href="/shop" active={isActive("/shop")}>
                  🛒 Shop
                </NavLink>
                <NavLink href="/leaderboard" active={isActive("/leaderboard")}>
                  🏆 Leaderboard
                </NavLink>
                <NavLink href="/profile" active={isActive("/profile")}>
                  👤 Profile
                </NavLink>
              </>
            ) : (
              <>
                <NavLink href="/login" active={isActive("/login")}>
                  Login
                </NavLink>
                <NavLink href="/register" active={isActive("/register")}>
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* User Info & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {user && !loading && (
              <div className="hidden sm:flex items-center gap-3 text-sm">
                <span className="text-yellow-300 font-medium">
                  💰 {user.coin}
                </span>
                <span className="text-cyan-300 font-medium">
                  Lv.{user.level}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white p-2"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/20 mt-2 pt-2">
            {user ? (
              <>
                <MobileNavLink
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  🏠 Dashboard
                </MobileNavLink>
                <MobileNavLink href="/quest" onClick={() => setMenuOpen(false)}>
                  ⚔️ Quest
                </MobileNavLink>
                <MobileNavLink href="/shop" onClick={() => setMenuOpen(false)}>
                  🛒 Shop
                </MobileNavLink>
                <MobileNavLink
                  href="/leaderboard"
                  onClick={() => setMenuOpen(false)}
                >
                  🏆 Leaderboard
                </MobileNavLink>
                <MobileNavLink
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                >
                  👤 Profile
                </MobileNavLink>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20 px-2">
                  <div className="flex gap-4 text-sm">
                    <span className="text-yellow-300">💰 {user.coin}</span>
                    <span className="text-cyan-300">Lv.{user.level}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink href="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </MobileNavLink>
                <MobileNavLink
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </MobileNavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-white/20 text-white"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-2 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded"
    >
      {children}
    </Link>
  );
}
