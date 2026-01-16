import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

export async function GET(
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

    // Get boss info
    const boss = await prisma.bossQuest.findUnique({
      where: { id: bossIdNum },
      include: {
        quest: {
          select: { judul: true },
        },
      },
    });

    if (!boss) {
      return NextResponse.json(
        { success: false, error: "Boss tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if user already defeated this boss
    const existingResult = await prisma.bossResult.findFirst({
      where: {
        userId: session.userId,
        bossId: bossIdNum,
      },
      orderBy: { tanggal: "desc" },
    });

    const alreadyDefeated =
      existingResult && existingResult.jumlahBenar === existingResult.totalSoal;

    // Get questions without answers
    const questions = await prisma.bossQuestion.findMany({
      where: { bossId: bossIdNum },
      select: {
        id: true,
        pertanyaan: true,
        pilihanA: true,
        pilihanB: true,
        pilihanC: true,
        pilihanD: true,
        // No correct answer for security
      },
    });

    // Shuffle questions
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      success: true,
      boss: {
        id: boss.id,
        namaBoss: boss.namaBoss,
        deskripsiBoss: boss.deskripsiBoss,
        backgroundImage: boss.backgroundImage,
        bossImage: boss.bossImage,
        xpReward: boss.xpReward,
        coinReward: boss.coinReward,
        questName: boss.quest?.judul,
      },
      questions: shuffledQuestions,
      alreadyDefeated,
    });
  } catch (error) {
    console.error("Boss API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
