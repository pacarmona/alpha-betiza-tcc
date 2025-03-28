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
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) {
    return NextResponse.json(
      { error: "lessonId é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const questions = await prisma.question.findMany({
      where: { lessonId },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Erro ao buscar questões:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
