import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { getUserById } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const user = await getUserById(session.userId);

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    // Map avatar enum to filename
    const avatarMap: Record<string, string> = {
      Ellipse_1: "Ellipse_1.png",
      Ellipse_2: "Ellipse_2.png",
      Ellipse_3: "Ellipse_3.png",
      Ellipse_4: "Ellipse_4.png",
      Ellipse_5: "Ellipse_5.png",
    };

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        avatar: avatarMap[user.avatar] || "Ellipse_1.png",
        isAdmin: session.isAdmin || false,
      },
    });
  } catch (error) {
    console.error("Me API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
