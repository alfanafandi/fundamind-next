"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";

interface Quest {
  id: number;
  judul: string;
  deskripsi: string | null;
  kategori: string;
  xpReward: number;
  coinReward: number;
  gambarIcon: string | null;
}

export default function QuestPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const res = await fetch("/api/quests");
      const data = await res.json();
      if (data.success) {
        setQuests(data.quests);
      }
    } catch (error) {
      console.error("Error fetching quests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getKategoriIcon = (kategori: string) => {
    switch (kategori) {
      case "story":
        return "📖";
      case "challenge":
        return "⏱️";
      case "boss_battle":
        return "👹";
      default:
        return "⚔️";
    }
  };

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case "story":
        return "from-emerald-500 to-teal-600";
      case "challenge":
        return "from-orange-500 to-red-600";
      case "boss_battle":
        return "from-purple-500 to-pink-600";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };

  const getQuestLink = (quest: Quest) => {
    switch (quest.kategori) {
      case "story":
        return `/quest/${quest.id}`;
      case "challenge":
        return `/quest/challenge`;
      case "boss_battle":
        return `/quest/boss`;
      default:
        return `/quest/${quest.id}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Memuat Quest..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">⚔️ Quest Box</h1>
          <p className="text-purple-200/80">Pilih petualanganmu!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {quests.map((quest) => (
            <Link
              key={quest.id}
              href={getQuestLink(quest)}
              className={`bg-gradient-to-br ${getKategoriColor(
                quest.kategori
              )} rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-xl`}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">
                  {getKategoriIcon(quest.kategori)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{quest.judul}</h3>
                  <p className="text-white/80 text-sm mb-4">
                    {quest.deskripsi}
                  </p>
                  <div className="flex gap-3 text-sm">
                    <span className="bg-white/20 px-2 py-1 rounded">
                      +{quest.xpReward} XP
                    </span>
                    <span className="bg-white/20 px-2 py-1 rounded">
                      +{quest.coinReward} 💰
                    </span>
                  </div>
                </div>
              </div>
            </Link>
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
