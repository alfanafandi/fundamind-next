import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { buyItemSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = buyItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { itemId } = result.data;

    // Get item info
    const item = await prisma.shopItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { coin: true, level: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check level requirement
    if (user.level < item.levelMinimal) {
      return NextResponse.json(
        {
          success: false,
          error: `Level kamu belum cukup untuk membeli ${item.namaItem}. Butuh Level ${item.levelMinimal}.`,
        },
        { status: 400 }
      );
    }

    // Check coin balance
    if (user.coin < item.hargaCoin) {
      return NextResponse.json(
        {
          success: false,
          error: `Koin tidak cukup untuk membeli ${item.namaItem}. Butuh ${item.hargaCoin} coin.`,
        },
        { status: 400 }
      );
    }

    // Deduct coins
    await prisma.user.update({
      where: { id: session.userId },
      data: { coin: { decrement: item.hargaCoin } },
    });

    // Add item to user inventory
    const existingItem = await prisma.userItem.findFirst({
      where: {
        userId: session.userId,
        itemId: itemId,
      },
    });

    if (existingItem) {
      await prisma.userItem.update({
        where: { id: existingItem.id },
        data: { jumlah: { increment: 1 } },
      });
    } else {
      await prisma.userItem.create({
        data: {
          userId: session.userId,
          itemId: itemId,
          jumlah: 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil membeli ${item.namaItem}!`,
      newBalance: user.coin - item.hargaCoin,
    });
  } catch (error) {
    console.error("Buy item API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
