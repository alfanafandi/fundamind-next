import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

export async function GET() {
  try {
    const session = await getSession();

    const items = await prisma.shopItem.findMany({
      where: { tersedia: true },
      orderBy: { levelMinimal: "asc" },
      select: {
        id: true,
        namaItem: true,
        tipeItem: true,
        deskripsi: true,
        hargaCoin: true,
        fileIcon: true,
        levelMinimal: true,
        sekaliPakai: true,
      },
    });

    // If user is logged in, get their coin balance
    let userCoin = 0;
    let userLevel = 1;

    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { coin: true, level: true },
      });
      userCoin = user?.coin || 0;
      userLevel = user?.level || 1;
    }

    return NextResponse.json({
      success: true,
      items,
      userCoin,
      userLevel,
    });
  } catch (error) {
    console.error("Shop items API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
