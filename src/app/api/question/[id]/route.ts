"use server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        Answers: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { message: "Questão não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Erro ao buscar questão:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Primeiro, excluir todas as respostas associadas à questão
    await prisma.answer.deleteMany({
      where: { questionId: params.id },
    });

    // Depois, excluir a questão
    const deletedQuestion = await prisma.question.delete({
      where: { id: params.id },
    });

    if (!deletedQuestion) {
      return NextResponse.json(
        { message: "Questão não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Questão excluída com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir questão:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, questionType, answerType, description, imageUrl } = body;

    // Atualizar a questão
    const updatedQuestion = await prisma.question.update({
      where: { id: params.id },
      data: {
        title,
        type: questionType,
        answer_type: answerType,
        description,
        image_url: imageUrl,
      },
    });

    if (!updatedQuestion) {
      return NextResponse.json(
        { message: "Questão não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Questão atualizada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao atualizar questão:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
