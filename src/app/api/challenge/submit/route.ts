import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { addXpToUser, addCoinsToUser } from "@/lib/game";

interface SubmitAnswer {
  questionId: number;
  answer: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { answers }: { answers: SubmitAnswer[] } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: "Answers are required" },
        { status: 400 }
      );
    }

    // Get all question IDs from answers
    const questionIds = answers.map((a) => a.questionId);

    // Get correct answers
    const questions = await prisma.questQuestion.findMany({
      where: { id: { in: questionIds } },
      select: {
        id: true,
        jawabanBenar: true,
      },
    });

    const questionMap = new Map(questions.map((q) => [q.id, q.jawabanBenar]));

    // Grade answers
    let correctCount = 0;
    for (const answer of answers) {
      const correctAnswer = questionMap.get(answer.questionId);
      if (correctAnswer === answer.answer.toLowerCase()) {
        correctCount++;
      }
    }

    // Score is based on correct answers (10 points each)
    const score = correctCount * 10;

    // XP and Coin rewards
    const xpEarned = score;
    const coinEarned = Math.floor(score / 2);

    // Add rewards
    const xpResult = await addXpToUser(session.userId, xpEarned);
    await addCoinsToUser(session.userId, coinEarned);

    // Save challenge score
    await prisma.challengeScore.create({
      data: {
        userId: session.userId,
        score,
      },
    });

    // Update last challenge date
    await prisma.user.update({
      where: { id: session.userId },
      data: { lastChallengeDate: new Date() },
    });

    return NextResponse.json({
      success: true,
      result: {
        score,
        correctCount,
        totalQuestions: answers.length,
        xpEarned,
        coinEarned,
        leveledUp: xpResult.leveledUp,
        newLevel: xpResult.newLevel,
      },
    });
  } catch (error) {
    console.error("Challenge submit API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
