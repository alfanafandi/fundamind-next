import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { addXpToUser, addCoinsToUser } from "@/lib/game";

interface SubmitAnswer {
  questionId: number;
  answer: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bossId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bossId } = await params;
    const bossIdNum = parseInt(bossId);
    const body = await request.json();

    const { answers }: { answers: SubmitAnswer[] } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: "Answers are required" },
        { status: 400 }
      );
    }

    // Get boss info
    const boss = await prisma.bossQuest.findUnique({
      where: { id: bossIdNum },
    });

    if (!boss) {
      return NextResponse.json(
        { success: false, error: "Boss tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get all questions with correct answers
    const questions = await prisma.bossQuestion.findMany({
      where: { bossId: bossIdNum },
      select: {
        id: true,
        jawabanBenar: true,
      },
    });

    const questionMap = new Map(
      questions.map((q) => [q.id, q.jawabanBenar?.toLowerCase()])
    );

    // Grade answers
    let correctCount = 0;
    for (const answer of answers) {
      const correctAnswer = questionMap.get(answer.questionId);
      if (correctAnswer === answer.answer.toLowerCase()) {
        correctCount++;
      }
    }

    const totalQuestions = questions.length;
    const isVictory = correctCount === totalQuestions;

    // Calculate rewards (only on victory)
    let xpEarned = 0;
    let coinEarned = 0;

    if (isVictory) {
      xpEarned = boss.xpReward;
      coinEarned = boss.coinReward;

      await addXpToUser(session.userId, xpEarned);
      await addCoinsToUser(session.userId, coinEarned);
    }

    // Save result
    await prisma.bossResult.create({
      data: {
        userId: session.userId,
        bossId: bossIdNum,
        jumlahBenar: correctCount,
        totalSoal: totalQuestions,
        xpDidapat: xpEarned,
        coinDidapat: coinEarned,
      },
    });

    return NextResponse.json({
      success: true,
      result: {
        correctCount,
        totalQuestions,
        isVictory,
        xpEarned,
        coinEarned,
      },
    });
  } catch (error) {
    console.error("Boss submit API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
