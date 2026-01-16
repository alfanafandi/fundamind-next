"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import QuestionCard from "@/components/QuestionCard";

interface Question {
  id: number;
  pertanyaan: string;
  pilihanA: string | null;
  pilihanB: string | null;
  pilihanC: string | null;
  pilihanD: string | null;
  petunjuk: string | null;
}

interface Chapter {
  id: number;
  judulChapter: string;
  xpReward: number;
  coinReward: number;
}

interface Answer {
  questionId: number;
  answer: string;
}

interface Result {
  score: number;
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  coinEarned: number;
  leveledUp: boolean;
  newLevel: number;
  isReplay: boolean;
}

export default function QuestPlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const chapterId = params.chapterId as string;
  const isReplay = searchParams.get("replay") === "1";

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchChapterQuestions();
  }, [chapterId]);

  const fetchChapterQuestions = async () => {
    try {
      const res = await fetch(`/api/chapters/${chapterId}`);
      const data = await res.json();

      if (data.success) {
        setChapter(data.chapter);
        setQuestions(data.questions);
      } else {
        setError(data.error || "Gagal memuat soal");
      }
    } catch {
      setError("Gagal memuat soal");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: "a" | "b" | "c" | "d") => {
    const currentQuestion = questions[currentIndex];

    // Save answer
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, answer }]);

    // Move to next question or submit
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 300);
    } else {
      // All questions answered, submit
      submitAnswers([...answers, { questionId: currentQuestion.id, answer }]);
    }
  };

  const submitAnswers = async (allAnswers: Answer[]) => {
    setSubmitting(true);

    try {
      const res = await fetch(`/api/chapters/${chapterId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: allAnswers, isReplay }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Gagal submit jawaban");
      }
    } catch {
      setError("Gagal submit jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Memuat Soal..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-cyan-400 hover:underline"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Menghitung Skor..." />
      </div>
    );
  }

  // Show result
  if (result) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-4 border-amber-600 p-8 shadow-xl max-w-lg w-full text-center">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            🎉 Hasil Quest
          </h1>

          <div className="text-6xl font-bold text-green-600 mb-2">
            {result.score}/100
          </div>

          <p className="text-amber-700 mb-6">
            {result.correctCount} dari {result.totalQuestions} soal benar
          </p>

          <div className="flex justify-center gap-6 mb-6">
            <div className="bg-cyan-100 px-4 py-3 rounded-xl">
              <div className="text-2xl font-bold text-cyan-700">
                +{result.xpEarned}
              </div>
              <div className="text-sm text-cyan-600">XP</div>
            </div>
            <div className="bg-yellow-100 px-4 py-3 rounded-xl">
              <div className="text-2xl font-bold text-yellow-700">
                +{result.coinEarned}
              </div>
              <div className="text-sm text-yellow-600">Coin</div>
            </div>
          </div>

          {result.leveledUp && (
            <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6">
              <p className="text-purple-700 font-bold text-lg">
                🎊 Level Up! Sekarang Level {result.newLevel}
              </p>
            </div>
          )}

          {result.isReplay && (
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-blue-700 text-sm">
                <strong>Replay Mode:</strong> Reward dikurangi 50%
              </p>
            </div>
          )}

          <button
            onClick={() => router.push("/quest")}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition"
          >
            ← Kembali ke Quest
          </button>
        </div>
      </div>
    );
  }

  // Show current question
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {chapter && (
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              {chapter.judulChapter}
            </h1>
            {isReplay && (
              <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                Replay Mode
              </span>
            )}
          </div>
        )}

        <QuestionCard
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          question={currentQuestion.pertanyaan}
          options={{
            a: currentQuestion.pilihanA,
            b: currentQuestion.pilihanB,
            c: currentQuestion.pilihanC,
            d: currentQuestion.pilihanD,
          }}
          hint={currentQuestion.petunjuk}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}
