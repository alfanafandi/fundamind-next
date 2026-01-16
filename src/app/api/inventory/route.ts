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

    const items = await prisma.userItem.findMany({
      where: {
        userId: session.userId,
        jumlah: { gt: 0 },
      },
      include: {
        item: {
          select: {
            id: true,
            namaItem: true,
            tipeItem: true,
            deskripsi: true,
            fileIcon: true,
            sekaliPakai: true,
          },
        },
      },
    });

    const inventory = items.map((ui) => ({
      id: ui.item.id,
      namaItem: ui.item.namaItem,
      tipeItem: ui.item.tipeItem,
      deskripsi: ui.item.deskripsi,
      fileIcon: ui.item.fileIcon,
      sekaliPakai: ui.item.sekaliPakai,
      jumlah: ui.jumlah,
    }));

    return NextResponse.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Inventory API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
