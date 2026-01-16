"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/Loading";

interface ChapterProgress {
  chapterId: number;
  nilai: number;
  sudahSelesai: boolean;
}

interface Chapter {
  id: number;
  nomorChapter: number;
  judulChapter: string;
  deskripsi: string | null;
  xpReward: number;
  coinReward: number;
  progress: ChapterProgress | null;
}

interface Quest {
  id: number;
  judul: string;
  deskripsi: string | null;
  chapters: Chapter[];
}

export default function QuestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const questId = params.questId as string;

  useEffect(() => {
    fetchQuestDetail();
  }, [questId]);

  const fetchQuestDetail = async () => {
    try {
      const res = await fetch(`/api/quests/${questId}`);
      const data = await res.json();

      if (data.success) {
        setQuest(data.quest);
      } else {
        setError(data.error || "Quest tidak ditemukan");
      }
    } catch {
      setError("Gagal memuat quest");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Memuat Chapter..." />
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/quest" className="text-cyan-400 hover:underline">
            Kembali ke Quest
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Quest Header */}
        <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-2">
            📖 {quest.judul}
          </h1>
          <p className="text-purple-200/80">{quest.deskripsi}</p>
        </div>

        {/* Chapter List */}
        <h2 className="text-2xl font-bold text-white mb-4">Daftar Chapter</h2>
        <div className="space-y-4">
          {quest.chapters.map((chapter, index) => {
            const isCompleted = chapter.progress?.sudahSelesai;
            const isLocked =
              index > 0 && !quest.chapters[index - 1].progress?.sudahSelesai;

            return (
              <div
                key={chapter.id}
                className={`rounded-xl border p-5 transition ${
                  isLocked
                    ? "bg-gray-800/50 border-gray-700 opacity-60"
                    : isCompleted
                    ? "bg-green-900/30 border-green-500/50"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {isLocked ? "🔒" : isCompleted ? "✅" : "📚"}
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        Chapter {chapter.nomorChapter}: {chapter.judulChapter}
                      </h3>
                    </div>
                    <p className="text-purple-200/70 text-sm mb-3">
                      {chapter.deskripsi}
                    </p>
                    <div className="flex gap-3 text-sm">
                      <span className="text-cyan-400">
                        +{chapter.xpReward} XP
                      </span>
                      <span className="text-yellow-400">
                        +{chapter.coinReward} 💰
                      </span>
                      {isCompleted && chapter.progress && (
                        <span className="text-green-400">
                          Skor: {chapter.progress.nilai}/100
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {isLocked ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed"
                      >
                        Terkunci
                      </button>
                    ) : isCompleted ? (
                      <Link
                        href={`/quest/play/${chapter.id}?replay=1`}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition"
                      >
                        Ulangi
                      </Link>
                    ) : (
                      <Link
                        href={`/quest/play/${chapter.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg transition"
                      >
                        Mainkan
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/quest"
            className="inline-block px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
          >
            ← Kembali ke Quest Box
          </Link>
        </div>
      </div>
    </div>
  );
}
