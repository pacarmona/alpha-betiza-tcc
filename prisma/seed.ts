import { PrismaClient } from "@prisma/client";

import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "João da Silva",
      email: "joao@example.com",
      birthday: "1990-05-15",
      phone: "11999999999",
      password: "senhaSegura123", // idealmente criptografar
      educational_institution: "Universidade Federal de Exemplo",
      office: "Professor",
    },
  });

  const lesson = await prisma.lesson.create({
    data: {
      title: "Introdução à Matemática",
      userId: user.id,
    },
  });

  const question = await prisma.question.create({
    data: {
      title: "Quanto é 2 + 2?",
      description: "Escolha a alternativa correta",
      answer_type: "TEXTUAL",
      type: "TEXTUAL",
      lessonId: lesson.id,
      Answers: {
        create: [
          {
            text: "3",
            type: "TEXTUAL",
            is_correct: false,
          },
          {
            text: "2",
            type: "TEXTUAL",
            is_correct: false,
          },
          {
            text: "4",
            type: "TEXTUAL",
            is_correct: true,
          },
          {
            text: "5",
            type: "TEXTUAL",
            is_correct: false,
          },
        ],
      },
    },
  });

  console.log("Seed concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
