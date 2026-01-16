import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { calculateRewards, addXpToUser, addCoinsToUser } from "@/lib/game";

interface SubmitAnswer {
  questionId: number;
  answer: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { chapterId } = await params;
    const chapterIdNum = parseInt(chapterId);
    const body = await request.json();

    const {
      answers,
      isReplay = false,
    }: { answers: SubmitAnswer[]; isReplay?: boolean } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: "Answers are required" },
        { status: 400 }
      );
    }

    // Get chapter info
    const chapter = await prisma.questChapter.findUnique({
      where: { id: chapterIdNum },
      select: {
        id: true,
        questId: true,
        xpReward: true,
        coinReward: true,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { success: false, error: "Chapter tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get all questions with correct answers
    const questions = await prisma.questQuestion.findMany({
      where: { chapterId: chapterIdNum },
      select: {
        id: true,
        jawabanBenar: true,
      },
    });

    const questionMap = new Map(questions.map((q) => [q.id, q.jawabanBenar]));

    // Grade answers
    let correctCount = 0;
    const gradedAnswers: {
      questionId: number;
      userAnswer: string;
      isCorrect: boolean;
    }[] = [];

    for (const answer of answers) {
      const correctAnswer = questionMap.get(answer.questionId);
      const isCorrect = correctAnswer === answer.answer.toLowerCase();

      if (isCorrect) correctCount++;

      gradedAnswers.push({
        questionId: answer.questionId,
        userAnswer: answer.answer,
        isCorrect,
      });

      // Save answer to database
      await prisma.userAnswer.create({
        data: {
          userId: session.userId,
          chapterId: chapterIdNum,
          questionId: answer.questionId,
          jawabanUser: answer.answer.toLowerCase(),
        },
      });
    }

    const totalQuestions = questions.length;
    const score = Math.round(
      (correctCount / Math.max(1, totalQuestions)) * 100
    );

    // Calculate rewards
    const rewards = calculateRewards(
      chapter.xpReward,
      chapter.coinReward,
      correctCount,
      totalQuestions,
      isReplay
    );

    // Add XP and coins to user
    const xpResult = await addXpToUser(session.userId, rewards.xp);
    await addCoinsToUser(session.userId, rewards.coin);

    // Save or update progress
    if (!isReplay) {
      await prisma.userChapterProgress.upsert({
        where: {
          idProgress_userId_chapterId: {
            idProgress: chapter.questId,
            userId: session.userId,
            chapterId: chapterIdNum,
          },
        },
        create: {
          idProgress: chapter.questId,
          userId: session.userId,
          chapterId: chapterIdNum,
          nilai: score,
          sudahSelesai: true,
          xpDidapat: rewards.xp,
          coinDidapat: rewards.coin,
        },
        update: {
          nilai: score,
          sudahSelesai: true,
          waktuSelesai: new Date(),
          xpDidapat: rewards.xp,
          coinDidapat: rewards.coin,
        },
      });
    } else {
      // Update replay rewards
      await prisma.userChapterProgress.updateMany({
        where: {
          userId: session.userId,
          chapterId: chapterIdNum,
        },
        data: {
          xpReplayReward: { increment: rewards.xp },
          coinReplayReward: { increment: rewards.coin },
        },
      });
    }

    return NextResponse.json({
      success: true,
      result: {
        score,
        correctCount,
        totalQuestions,
        xpEarned: rewards.xp,
        coinEarned: rewards.coin,
        leveledUp: xpResult.leveledUp,
        newLevel: xpResult.newLevel,
        isReplay,
      },
    });
  } catch (error) {
    console.error("Submit answers API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
