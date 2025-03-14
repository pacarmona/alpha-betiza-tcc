"use server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Armazene em variável de ambiente em produção

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    // Comparar a senha fornecida com o hash no banco de dados
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    // Login bem-sucedido - Armazene apenas id e email
    const payload = {
      id: user.id,
      email: user.email,
    };

    // Gerar o token JWT sem expiração
    const token = jwt.sign(payload, SECRET_KEY!);

    // Retornar o token para o frontend
    return NextResponse.json(
      { message: "Login bem-sucedido", token, userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao autenticar:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
