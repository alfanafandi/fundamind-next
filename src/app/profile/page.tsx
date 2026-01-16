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

interface InventoryItem {
  id: number;
  namaItem: string;
  tipeItem: string | null;
  deskripsi: string | null;
  fileIcon: string | null;
  jumlah: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, inventoryRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/inventory"),
      ]);

      const userData = await userRes.json();
      const inventoryData = await inventoryRes.json();

      if (userData.success && userData.user) {
        setUser(userData.user);
      } else {
        router.push("/login");
        return;
      }

      if (inventoryData.success) {
        setInventory(inventoryData.inventory);
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const getRank = (level: number) => {
    if (level >= 50) return { name: "Grandmaster", color: "text-red-400" };
    if (level >= 40) return { name: "Master", color: "text-purple-400" };
    if (level >= 30) return { name: "Diamond", color: "text-cyan-400" };
    if (level >= 20) return { name: "Platinum", color: "text-emerald-400" };
    if (level >= 15) return { name: "Gold", color: "text-yellow-400" };
    if (level >= 10) return { name: "Silver", color: "text-gray-300" };
    if (level >= 5) return { name: "Bronze", color: "text-orange-400" };
    return { name: "Novice", color: "text-slate-400" };
  };

  if (loading) {
    return <LoadingFullPage text="Loading Profile..." />;
  }

  if (!user) return null;

  const rank = getRank(user.level);
  const xpProgress = (user.xp / user.xpNext) * 100;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-6xl shadow-xl border-4 border-white/20">
                👤
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1 rounded-full text-white font-bold text-sm">
                Lv.{user.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-1">
                {user.username}
              </h1>
              <p className={`text-lg font-medium ${rank.color} mb-4`}>
                🏅 {rank.name}
              </p>

              {user.bio && (
                <p className="text-purple-200/80 italic mb-4">"{user.bio}"</p>
              )}

              {/* Stats Grid */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <StatBox icon="⭐" value={user.level} label="Level" />
                <StatBox icon="💫" value={user.xp} label="XP" />
                <StatBox icon="💰" value={user.coin} label="Coins" />
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-purple-200 mb-2">
              <span>Progress ke Level {user.level + 1}</span>
              <span>
                {user.xp} / {user.xpNext} XP
              </span>
            </div>
            <div className="h-4 bg-purple-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">🎒 Inventory</h2>

          {inventory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-purple-200/60 mb-4">
                Kamu belum punya item apapun
              </p>
              <Link
                href="/shop"
                className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-400 hover:to-orange-400 transition"
              >
                Kunjungi Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 rounded-xl p-4 text-center border border-white/10"
                >
                  <div className="text-4xl mb-2">
                    {item.tipeItem === "booster"
                      ? "⚡"
                      : item.tipeItem === "hint"
                      ? "💡"
                      : item.tipeItem === "skip"
                      ? "⏭️"
                      : "📦"}
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1">
                    {item.namaItem}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                    x{item.jumlah}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatBox({
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
      <div className="text-xl">{icon}</div>
      <div className="text-xl font-bold text-white">
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-purple-200/70">{label}</div>
    </div>
  );
}
