"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingFullPage } from "@/components/Loading";

interface User {
  id: number;
  username: string;
  avatar: string;
  bio: string | null;
  level: number;
  xp: number;
  xpNext: number;
  coin: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingFullPage text="Loading Dashboard..." />;
  }

  if (!user) return null;

  const xpProgress = (user.xp / user.xpNext) * 100;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-5xl shadow-lg">
              👤
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                Selamat Datang, {user.username}! 👋
              </h1>
              <p className="text-purple-200/80">Level {user.level} Explorer</p>
            </div>
            <div className="flex gap-4">
              <StatBadge icon="💰" value={user.coin} label="Coins" />
              <StatBadge icon="⭐" value={user.level} label="Level" />
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-purple-200 mb-2">
              <span>XP Progress</span>
              <span>
                {user.xp} / {user.xpNext}
              </span>
            </div>
            <div className="h-3 bg-purple-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-white mb-4">Mulai Bermain</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ActionCard
            href="/quest"
            icon="📖"
            title="Story Quest"
            description="Lanjutkan petualanganmu"
            color="from-emerald-500 to-teal-600"
          />
          <ActionCard
            href="/quest/challenge"
            icon="⏱️"
            title="Challenge Quest"
            description="Tantangan harian!"
            color="from-orange-500 to-red-600"
          />
          <ActionCard
            href="/quest/boss"
            icon="👹"
            title="Boss Battle"
            description="Kalahkan boss!"
            color="from-purple-500 to-pink-600"
          />
        </div>

        {/* Other Navigation */}
        <div className="grid md:grid-cols-4 gap-4">
          <NavCard href="/shop" icon="🛒" title="Shop" />
          <NavCard href="/inventory" icon="🎒" title="Inventory" />
          <NavCard href="/leaderboard" icon="🏆" title="Leaderboard" />
          <NavCard href="/profile" icon="👤" title="Profile" />
        </div>
      </div>
    </div>
  );
}

function StatBadge({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[80px]">
      <div className="text-2xl">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-purple-200/70">{label}</div>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-lg`}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </Link>
  );
}

function NavCard({
  href,
  icon,
  title,
}: {
  href: string;
  icon: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-white font-medium">{title}</div>
    </Link>
  );
}
