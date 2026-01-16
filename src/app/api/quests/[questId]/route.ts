import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ questId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { questId } = await params;
    const questIdNum = parseInt(questId);

    // Get quest with chapters
    const quest = await prisma.quest.findUnique({
      where: { id: questIdNum },
      include: {
        chapters: {
          orderBy: { nomorChapter: "asc" },
          select: {
            id: true,
            nomorChapter: true,
            judulChapter: true,
            deskripsi: true,
            xpReward: true,
            coinReward: true,
          },
        },
      },
    });

    if (!quest) {
      return NextResponse.json(
        { success: false, error: "Quest tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get user progress for each chapter
    const userProgress = await prisma.userChapterProgress.findMany({
      where: {
        userId: session.userId,
        chapterId: { in: quest.chapters.map((c) => c.id) },
      },
      select: {
        chapterId: true,
        nilai: true,
        sudahSelesai: true,
      },
    });

    const progressMap = new Map(userProgress.map((p) => [p.chapterId, p]));

    const chaptersWithProgress = quest.chapters.map((chapter) => ({
      ...chapter,
      progress: progressMap.get(chapter.id) || null,
    }));

    return NextResponse.json({
      success: true,
      quest: {
        ...quest,
        chapters: chaptersWithProgress,
      },
    });
  } catch (error) {
    console.error("Quest detail API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
