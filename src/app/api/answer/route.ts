"use server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { questionId, answers } = await req.json();

  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    console.log(questionId);
    if (!question) {
      return NextResponse.json(
        { message: "Questão não encontrada" },
        { status: 404 }
      );
    }
    const createdAnswers = await prisma.answer.createMany({
      data: answers.map(
        (answer: { text: unknown; type: unknown; is_correct: unknown }) => ({
          questionId: questionId,
          text: answer.text,
          type: answer.type,
          is_correct: answer.is_correct,
        })
      ),
    });

    if (createdAnswers) {
      return NextResponse.json(
        { message: "Respostas cadastradas com sucesso" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao cadastrar as respostas" },
      { status: 400 }
    );
  }
}
export async function GET(req: Request) {
  const url = new URL(req.url);
  const questionId = url.searchParams.get("questionId");

  try {
    if (!questionId) {
      return NextResponse.json(
        { message: "ID da questão não fornecido" },
        { status: 400 }
      );
    }

    const answers = await prisma.answer.findMany({
      where: { questionId: questionId },
    });

    if (answers.length === 0) {
      return NextResponse.json(
        { message: "Nenhuma resposta encontrada para esta questão" },
        { status: 404 }
      );
    }

    return NextResponse.json(answers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar as respostas" },
      { status: 500 }
    );
  }
}
