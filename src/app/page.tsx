"use client";
import BottomBar from "@/components/bottomBar";
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
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { userId } = useUser();

  const router = useRouter();
  const token = localStorage.getItem("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const listActivity = [
    {
      titleActivity: "Atividade 1",
      categoryActivity: "Sílabas",
      imageActivity: "",
    },
    {
      titleActivity: "Atividade 2",
      categoryActivity: "Sílabas",
      imageActivity: "",
    },
    {
      titleActivity: "Atividade 3",
      categoryActivity: "Sílabas",
      imageActivity: "",
    },
    {
      titleActivity: "Atividade 3",
      categoryActivity: "Sílabas",
      imageActivity: "",
    },
    {
      titleActivity: "Atividade 1",
      categoryActivity: "Sílabas",
      imageActivity: "",
    },
    {
      titleActivity: "Atividade 2",
      categoryActivity: "Sílabas",
      imageActivity: "",
    },
    {
      titleActivity: "Atividade 3",
      categoryActivity: "Sílabas",
      imageActivity: "",
    },
    {
      titleActivity: "Atividade 3",
      categoryActivity: "Sílabas",
      imageActivity: "",
    },
    {
      titleActivity: "Atividade 3",
      categoryActivity: "Sílabas",
      imageActivity: "",
    },
  ];
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

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
      {/* Barra superior */}
      <TopBar />
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
          {listActivity.map((activity, index) => (
            <Card key={index} className="w-[350px] bg-[#D9D9D9]">
              <CardHeader>
                <CardTitle>{activity.titleActivity}</CardTitle>
                <CardDescription>{activity.categoryActivity}</CardDescription>
              </CardHeader>
              <CardContent>
                {activity.imageActivity && (
                  <img
                    src={activity.imageActivity}
                    alt={activity.titleActivity}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button className="w-full bg-[#B6B8BF] hover:bg-[#8f9197]">
                  Ir para atividade
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {/* Barra superior */}
      <BottomBar />
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
