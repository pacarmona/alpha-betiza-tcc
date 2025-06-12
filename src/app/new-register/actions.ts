"use server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

interface FormData {
  name: string;
  email: string;
  birthday: string;
  phone: string;
  password: string;
  confirmPassword: string;
  school: string;
  occupation: string;
}

export async function saveFormData(formData: FormData) {
  const { password, confirmPassword, email, ...userData } = formData;

  // Verificação se a confirmação de senha está correta
  if (password !== confirmPassword) {
    throw new Error("As senhas não coincidem.");
  }

  // Verificar se o e-mail já existe no banco de dados
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Este e-mail já está registrado.");
  }
  // Acessar o salt armazenado na variável de ambiente
  const salt = process.env.SALT;
  console.log(salt);

  if (!salt) {
    throw new Error("Erro ao realizar cadastro");
  }

  // Criptografar a senha usando o salt definido
  const hashedPassword = await bcrypt.hash(password, salt);
  // Salvando os dados no banco de dados sem criptografia da senha
  try {
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: email,
        birthday: userData.birthday,
        phone: userData.phone,
        password: hashedPassword, // Sem criptografia por enquanto
        educational_institution: userData.school,
        office: userData.occupation,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
    throw new Error("Falha ao salvar os dados.");
  } finally {
    await prisma.$disconnect();
  }
}
