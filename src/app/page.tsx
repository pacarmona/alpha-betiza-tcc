"use client";
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
import { useUser } from "@/providers/UserProvider";
import { Lesson } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const { userId } = useUser();

  const router = useRouter();
  const token = localStorage.getItem("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const deleteActivity = async (lessonId: string) => {
    try {
      const result = await Swal.fire({
        title: "Tem certeza?",
        text: "Esta ação não poderá ser revertida!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`/api/lessons/${lessonId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao excluir a atividade");
        }

        // Atualiza a lista de atividades após a exclusão
        setLessons(lessons.filter((lesson) => lesson.id !== lessonId));

        Swal.fire({
          title: "Sucesso!",
          text: "Atividade excluída com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
      Swal.fire({
        title: "Erro!",
        text: "Não foi possível excluir a atividade. Por favor, tente novamente mais tarde.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

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

  const [activityTitle, setActivityTitle] = useState("");

  const createActivity = async () => {
    if (!activityTitle) {
      alert("O título da atividade não pode estar vazio.");
      return;
    }
    try {
      const response = await fetch(`/api/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, title: activityTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao criar atividade:", errorData.message);
        return;
      }

      const responseData = await response.json();
      console.log("Atividade criada:", responseData.message);
      router.push(`/new-lesson?lessonId=${responseData.lessonId}`);
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="w-full h-full flex flex-col ml-10 mt-10">
        {/*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">*/}
        <div className="flex flex-wrap gap-4">
          <Card className="w-[350px] bg-[#D9D9D9]">
            <CardHeader>
              <CardTitle>Criar Nova Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Crie uma nova atividade para a plataforma.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                className="w-full bg-[#53A85C] text-white hover:bg-[#72c177]"
                onClick={toggleModal}
              >
                Criar Atividade
              </Button>
            </CardFooter>
          </Card>
          {lessons.map((activity, index) => (
            <Card key={index} className="w-[350px] bg-[#D9D9D9] relative">
              <button
                onClick={() => deleteActivity(activity.id)}
                className="absolute top-2 right-2 text-white hover:text-gray-200 text-xl font-bold"
              >
                ×
              </button>
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
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
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
                onClick={createActivity}
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
