"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";

interface LeaderboardUser {
  rank: number;
  id: number;
  username: string;
  avatar: string;
  level: number;
  xp: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-amber-500";
      case 2:
        return "from-gray-300 to-gray-400";
      case 3:
        return "from-orange-400 to-amber-600";
      default:
        return "from-slate-600 to-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Memuat Leaderboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">🏆 Leaderboard</h1>
          <p className="text-purple-200/80">Pemain Terbaik Fundamind</p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="flex justify-center items-end gap-4 mb-10">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-2 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-3xl border-4 border-gray-200">
                🥈
              </div>
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-t-xl p-4 h-24 flex flex-col justify-end">
                <p className="text-white font-bold truncate">
                  {leaderboard[1].username}
                </p>
                <p className="text-gray-300 text-sm">
                  Lv.{leaderboard[1].level}
                </p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center -mt-4">
              <div className="w-24 h-24 mx-auto mb-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-4xl border-4 border-yellow-300 shadow-lg">
                🥇
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-t-xl p-4 h-32 flex flex-col justify-end">
                <p className="text-white font-bold truncate">
                  {leaderboard[0].username}
                </p>
                <p className="text-yellow-100 text-sm">
                  Lv.{leaderboard[0].level}
                </p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-2 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full flex items-center justify-center text-3xl border-4 border-orange-300">
                🥉
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-t-xl p-4 h-20 flex flex-col justify-end">
                <p className="text-white font-bold truncate">
                  {leaderboard[2].username}
                </p>
                <p className="text-orange-100 text-sm">
                  Lv.{leaderboard[2].level}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-white/10 font-bold text-white/80 text-sm">
            <div className="col-span-2">Rank</div>
            <div className="col-span-6">Player</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-right">XP</div>
          </div>

          {leaderboard.map((user) => (
            <div
              key={user.id}
              className={`grid grid-cols-12 gap-4 p-4 border-t border-white/5 items-center transition ${
                user.rank <= 3
                  ? "bg-gradient-to-r " + getRankColor(user.rank) + "/10"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="col-span-2 text-xl">{getRankIcon(user.rank)}</div>
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-lg">
                  👤
                </div>
                <span className="text-white font-medium truncate">
                  {user.username}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm">
                  Lv.{user.level}
                </span>
              </div>
              <div className="col-span-2 text-right text-purple-200">
                {user.xp.toLocaleString()}
              </div>
            </div>
          ))}
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
