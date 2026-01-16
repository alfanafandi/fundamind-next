import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user already played today
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        level: true,
        lastChallengeDate: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    const lastPlayed = user.lastChallengeDate?.toISOString().split("T")[0];

    if (lastPlayed === today) {
      return NextResponse.json({
        success: true,
        alreadyPlayed: true,
        message: "Kamu sudah menyelesaikan Challenge hari ini!",
      });
    }

    // Get random 10 questions based on user level
    const questions = await prisma.questQuestion.findMany({
      where: {
        minLevel: { lte: user.level },
      },
      select: {
        id: true,
        pertanyaan: true,
        pilihanA: true,
        pilihanB: true,
        pilihanC: true,
        pilihanD: true,
        // No correct answer for security
      },
      take: 100, // Get more for randomization
    });

    // Shuffle and take 10
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 10);

    return NextResponse.json({
      success: true,
      alreadyPlayed: false,
      questions: shuffled,
      timeLimit: 180, // 3 minutes in seconds
    });
  } catch (error) {
    console.error("Challenge start API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
