"use client";

import { useState } from "react";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: {
    a: string | null;
    b: string | null;
    c: string | null;
    d: string | null;
  };
  hint?: string | null;
  showHint?: boolean;
  onAnswer: (answer: "a" | "b" | "c" | "d") => void;
  disabled?: boolean;
  feedback?: {
    isCorrect: boolean;
    correctAnswer?: string;
    hint?: string;
  } | null;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  options,
  hint,
  showHint = false,
  onAnswer,
  disabled = false,
  feedback = null,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSelect = (answer: "a" | "b" | "c" | "d") => {
    if (disabled) return;
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const getOptionClass = (option: "a" | "b" | "c" | "d") => {
    const baseClass =
      "p-4 rounded-xl border-2 text-left transition-all cursor-pointer";

    if (feedback) {
      if (option === selectedAnswer && feedback.isCorrect) {
        return `${baseClass} bg-green-100 border-green-500 text-green-800`;
      }
      if (option === selectedAnswer && !feedback.isCorrect) {
        return `${baseClass} bg-red-100 border-red-500 text-red-800`;
      }
    }

    if (option === selectedAnswer) {
      return `${baseClass} bg-amber-100 border-amber-500`;
    }

    if (disabled) {
      return `${baseClass} bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed`;
    }

    return `${baseClass} bg-amber-50 border-amber-300 hover:bg-amber-100 hover:border-amber-400`;
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-4 border-amber-600 p-6 shadow-xl max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-amber-800 font-bold text-lg">
          Soal {questionNumber} dari {totalQuestions}
        </span>
        <div className="w-32 h-2 bg-amber-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-600 transition-all"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white/80 rounded-xl p-4 mb-6 border border-amber-200">
        <p className="text-gray-800 text-lg font-medium">{question}</p>
      </div>

      {/* Hint */}
      {showHint && hint && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-blue-800 text-sm">
            <span className="font-bold">💡 Petunjuk:</span> {hint}
          </p>
        </div>
      )}

      {/* Feedback hint on wrong answer */}
      {feedback && !feedback.isCorrect && feedback.hint && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <p className="text-orange-800 text-sm">
            <span className="font-bold">💡 Petunjuk:</span> {feedback.hint}
          </p>
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(["a", "b", "c", "d"] as const).map(
          (opt) =>
            options[opt] && (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={disabled}
                className={getOptionClass(opt)}
              >
                <span className="font-bold text-amber-700 mr-2">
                  {opt.toUpperCase()}.
                </span>
                {options[opt]}
              </button>
            )
        )}
      </div>
    </div>
  );
}
