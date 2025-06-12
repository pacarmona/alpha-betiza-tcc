/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers } = body;

    // Criar as respostas
    await prisma.answer.createMany({
      data: answers.map((answer: any) => ({
        ...answer,
        image_url: answer.image_url || null,
      })),
    });

    return NextResponse.json(
      { message: "Respostas criadas com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar respostas:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { questionId, answers } = body;

    // Primeiro, excluir todas as respostas existentes da questão
    await prisma.answer.deleteMany({
      where: { questionId },
    });

    // Depois, criar as novas respostas
    await prisma.answer.createMany({
      data: answers.map((answer: any) => ({
        ...answer,
        image_url: answer.image_url || null,
      })),
    });

    return NextResponse.json(
      { message: "Respostas atualizadas com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao atualizar respostas:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
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
