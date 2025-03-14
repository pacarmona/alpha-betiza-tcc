"use server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { lessonId, title, questionType, answerType, description } =
    await req.json();

  try {
    const question = await prisma.question.create({
      data: {
        lessonId: lessonId,
        title: title,
        type: questionType,
        answer_type: answerType,
        description: description,
      },
    });

    if (question) {
      return NextResponse.json(
        { message: "Questão cadastrada com sucesso", questionId: question.id },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar a questão" },
      { status: 400 }
    );
  }
}
