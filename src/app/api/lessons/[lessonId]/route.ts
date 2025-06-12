import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: params.lessonId,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        {
          error:
            "Ops! Não conseguimos encontrar esta atividade. Ela pode ter sido removida ou não existe mais.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Erro ao buscar atividade:", error);
    return NextResponse.json(
      {
        error:
          "Desculpe, ocorreu um erro ao buscar a atividade. Por favor, tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lessonId = params.lessonId;

    // Verifica se a atividade existe
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        questions: {
          include: {
            Answers: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        {
          message:
            "Ops! Não conseguimos encontrar esta atividade para excluí-la.",
        },
        { status: 404 }
      );
    }

    // Primeiro, exclui todas as respostas das questões
    for (const question of lesson.questions) {
      await prisma.answer.deleteMany({
        where: { questionId: question.id },
      });
    }

    // Depois, exclui todas as questões
    await prisma.question.deleteMany({
      where: { lessonId: lessonId },
    });

    // Por fim, exclui a atividade
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json(
      {
        message: "Atividade excluída com sucesso!",
        title: "Sucesso!",
        icon: "success",
        confirmButtonText: "OK",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir atividade:", error);
    return NextResponse.json(
      {
        message:
          "Ops! Não foi possível excluir a atividade. Por favor, tente novamente mais tarde.",
        title: "Erro!",
        icon: "error",
        confirmButtonText: "OK",
      },
      { status: 500 }
    );
  }
}
