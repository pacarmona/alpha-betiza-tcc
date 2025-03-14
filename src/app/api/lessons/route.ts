"use server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id, title } = await req.json();

  try {
    const lesson = await prisma.lesson.create({
      data: {
        title,
        userId: id,
      },
    });
    if (lesson) {
      return NextResponse.json(
        { message: "Foi cadastrado", lessonId: lesson.id },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar atividade" },
      { status: 400 }
    );
  }
}
