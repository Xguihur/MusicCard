import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 检查是否已收藏
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "缺少URL参数" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.findFirst({
      where: { url },
    });

    return NextResponse.json({ 
      isFavorited: !!favorite,
      favoriteId: favorite?.id || null 
    });
  } catch (error) {
    console.error("检查收藏状态失败:", error);
    return NextResponse.json(
      { error: "检查收藏状态失败" },
      { status: 500 }
    );
  }
} 