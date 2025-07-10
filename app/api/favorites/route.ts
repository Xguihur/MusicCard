import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 获取收藏列表
export async function GET() {
  try {
    const favorites = await prisma.favorite.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("获取收藏列表失败:", error);
    return NextResponse.json(
      { error: "获取收藏列表失败" },
      { status: 500 }
    );
  }
}

// 添加收藏
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, title, artist, coverUrl, duration } = body;

    if (!url || !title || !artist) {
      return NextResponse.json(
        { error: "缺少必要参数：url, title, artist" },
        { status: 400 }
      );
    }

    // 检查是否已经收藏过
    const existingFavorite = await prisma.favorite.findFirst({
      where: { url },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "该歌曲已经收藏过了" },
        { status: 400 }
      );
    }

    // 创建新收藏
    const favorite = await prisma.favorite.create({
      data: {
        url,
        title,
        artist,
        coverUrl: coverUrl || null,
        duration: duration || null,
      },
    });

    return NextResponse.json({ 
      message: "收藏成功", 
      favorite 
    });
  } catch (error) {
    console.error("添加收藏失败:", error);
    return NextResponse.json(
      { error: "添加收藏失败" },
      { status: 500 }
    );
  }
}

// 删除收藏
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "缺少收藏ID" },
        { status: 400 }
      );
    }

    await prisma.favorite.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: "取消收藏成功" });
  } catch (error) {
    console.error("取消收藏失败:", error);
    return NextResponse.json(
      { error: "取消收藏失败" },
      { status: 500 }
    );
  }
} 