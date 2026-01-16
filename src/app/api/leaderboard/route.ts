import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get top users by level and XP
    const users = await prisma.user.findMany({
      orderBy: [{ level: "desc" }, { xp: "desc" }],
      take: 50,
      select: {
        id: true,
        username: true,
        avatar: true,
        level: true,
        xp: true,
      },
    });

    // Map avatar enum to filename
    const avatarMap: Record<string, string> = {
      Ellipse_1: "Ellipse_1.png",
      Ellipse_2: "Ellipse_2.png",
      Ellipse_3: "Ellipse_3.png",
      Ellipse_4: "Ellipse_4.png",
      Ellipse_5: "Ellipse_5.png",
    };

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      avatar: avatarMap[user.avatar] || "Ellipse_1.png",
      level: user.level,
      xp: user.xp,
    }));

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
