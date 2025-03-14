"use client";
import BottomBar from "@/components/bottomBar";
import TopBar from "@/components/topBar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewLesson() {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col h-full">
      {/* Barra superior */}
      <TopBar />

      {/* Barra lateral */}
      <div className="w-full h-full flex">
        <div className="bg-[#D9D9D9] h-full w-[15%]">
          <div className="justify-between items-center flex flex-col h-full">
            <Button className="bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40 mt-20 hover:bg-[#8f9197]">
              Questão 1
            </Button>
            <Button className="bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40 mb-56 hover:bg-[#8f9197]">
              Adicionar Questão
            </Button>
          </div>
        </div>

        {/* Conteúdo principal da tela */}
        <div className="flex flex-wrap flex-col gap-4 w-[85%] ml-10 mt-10">
          {/* Título da questão */}
          <div className=" bg-white w-4/5 "></div>

          {/*Respostas*/}
          <div>
            <div className="text-left font-bold text-4xl text-black mb-5">
              <p>Respostas</p>
            </div>
          </div>

          {/*Botões para cancelar ou confirmar*/}
          <div className="text-center flex gap-4 justify-end mr-64 mt-20">
            <Button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded w-40 hover:bg-red-400"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40 hover:bg-[#72c177]">
              Confirmar
            </Button>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
