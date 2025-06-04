"use client";
import TopBar from "@/components/topBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lesson } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await fetch("/api/lessons");
        if (!response.ok) {
          throw new Error("Erro ao buscar as lessons");
        }
        const data: Lesson[] = await response.json();
        setLessons(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLessons();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Barra superior */}
      <TopBar />
      <div className="w-full h-full flex flex-col ml-10 mt-10">
        <div className="flex flex-wrap gap-4">
          {lessons.map((activity, index) => (
            <Card key={index} className="w-[350px] bg-[#D9D9D9]">
              <CardHeader>
                <CardTitle>{activity.title}</CardTitle>
                <CardDescription>{}</CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  className="w-full bg-[#B6B8BF] hover:bg-[#8f9197]"
                  onClick={() => router.push(`/lesson?lessonId=${activity.id}`)}
                >
                  Ir para atividade
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {/* Barra superior */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
            {/* Ícone de Fechar (X) no canto superior direito */}
            <Button
              className="absolute top-2 right-2 text-gray-500 bg-white hover:bg-white hover:text-gray-800"
              onClick={toggleModal}
            >
              &times;
            </Button>

            <h2 className="text-lg font-bold mb-4">Criar nova atividade</h2>
            <Input
              type="text"
              className="border border-gray-300 p-2 rounded w-full mb-4"
              placeholder="Digite o título da atividade"
            />
            <div className="text-center flex gap-4">
              <Button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded w-40 hover:bg-red-400"
                onClick={toggleModal}
              >
                Cancelar
              </Button>
              <Button
                className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40 hover:bg-[#72c177]"
                onClick={() => router.push("/new-lesson")}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
