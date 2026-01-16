import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const quests = await prisma.quest.findMany({
      where: { tersedia: true },
      orderBy: { id: "asc" },
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        kategori: true,
        xpReward: true,
        coinReward: true,
        gambarIcon: true,
        mulaiEvent: true,
        akhirEvent: true,
      },
    });

    return NextResponse.json({
      success: true,
      quests,
    });
  } catch (error) {
    console.error("Quests API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
