"use server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { message: "ID do usuário é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }, // Utiliza o ID como string
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Retorna os dados do usuário (sem a senha)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      birthday: user.birthday,
      office: user.office,
      phone: user.phone,
      educational_institution: user.educational_institution,
    };

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { message: "ID do usuário é obrigatório" },
        { status: 400 }
      );
    }

    // Lê o corpo da requisição
    const body = await req.json();

    // Verifica se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza os campos permitidos
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name || existingUser.name,
        email: body.email || existingUser.email,
        birthday: body.birthday || existingUser.birthday,
        office: body.office || existingUser.office,
        phone: body.phone || existingUser.phone,
        educational_institution:
          body.educational_institution || existingUser.educational_institution,
      },
    });

    // Retorna os dados atualizados do usuário (sem a senha)
    const updatedUserData = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      birthday: updatedUser.birthday,
      office: updatedUser.office,
      phone: updatedUser.phone,
      educational_institution: updatedUser.educational_institution,
    };

    return NextResponse.json({ user: updatedUserData }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
