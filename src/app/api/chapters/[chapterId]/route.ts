import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

export async function GET(
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

    // Get chapter info
    const chapter = await prisma.questChapter.findUnique({
      where: { id: chapterIdNum },
      select: {
        id: true,
        nomorChapter: true,
        judulChapter: true,
        deskripsi: true,
        xpReward: true,
        coinReward: true,
        questId: true,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { success: false, error: "Chapter tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get questions for this chapter
    const questions = await prisma.questQuestion.findMany({
      where: { chapterId: chapterIdNum },
      orderBy: { id: "asc" },
      select: {
        id: true,
        pertanyaan: true,
        pilihanA: true,
        pilihanB: true,
        pilihanC: true,
        pilihanD: true,
        petunjuk: true,
        // Note: jawabanBenar is NOT included for security
      },
    });

    // Check if user has completed this chapter
    const progress = await prisma.userChapterProgress.findFirst({
      where: {
        userId: session.userId,
        chapterId: chapterIdNum,
      },
    });

    return NextResponse.json({
      success: true,
      chapter,
      questions,
      isCompleted: progress?.sudahSelesai || false,
      previousScore: progress?.nilai || null,
    });
  } catch (error) {
    console.error("Chapter questions API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
