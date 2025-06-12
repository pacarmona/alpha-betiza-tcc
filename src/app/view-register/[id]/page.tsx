"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewRegister() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [user, setUser] = useState({
    name: "",
    email: "",
    birthday: "",
    phone: "",
    educational_institution: "",
    office: "",
  });

  // Função para buscar dados do usuário por ID
  const fetchUserById = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user); // Preencher os dados do usuário no estado
      } else {
        console.error("Erro ao buscar usuário:", data.message);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  // useEffect para buscar os dados do usuário quando a página carregar
  useEffect(() => {
    // Obter o ID do usuário do cookie
    // Aqui usamos js-cookie para pegar o ID do cookie

    if (typeof id === "string") {
      fetchUserById(id); // Buscar os dados do usuário com o ID
    } else {
      console.error("ID do usuário não encontrado no cookie");
    }
  }, [id]);

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex w-full h-full flex-col">
        <div className="flex flex-wrap flex-col gap-4 w-[85%] ml-10 mt-10">
          <div className="text-left font-bold text-4xl text-black">
            <p>Criar Conta</p>
          </div>
          <div className="text-left font-bold text-lg text-black">
            <p>Dados Pessoais</p>

            <div className=" bg-white w-4full mb-5 mt-5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Digite o seu nome"
                value={user.name}
                readOnly
              />
            </div>
            <div className=" bg-white w-4full mb-5 mt-5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Digite o seu E-mail"
                value={user.email}
                readOnly
              />
            </div>

            <div className="bg-white flex gap-4 mt-5 w-full">
              <div className="flex flex-col w-full">
                <Label htmlFor="date">Data de nascimento</Label>
                <Input
                  id="date"
                  type="date"
                  name="birthday"
                  placeholder="Data de Nascimento"
                  value={user.birthday}
                  readOnly
                />
              </div>
              <div className="flex flex-col w-full">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="phone"
                  name="phone"
                  placeholder="Digite seu número de telefone"
                  value={user.phone}
                  readOnly
                />
              </div>
            </div>

            <div className="bg-white flex gap-4 mt-5">
              <a href="/new-password" className="text-blue-600 text-base block">
                Redefinir senha
              </a>
            </div>
          </div>
          <div className="text-left font-bold text-lg text-black mb-5">
            <p>Dados Profissionais</p>

            <div className=" bg-white w-4full mb-5 mt-5">
              <Label htmlFor="school">Instituição de ensino</Label>
              <Input
                id="school"
                type="text"
                name="school"
                placeholder="Digite o nome da instituição de ensino"
                value={user.educational_institution}
                readOnly
              />
            </div>
            <div className=" bg-white w-4full mb-5 mt-5">
              <Label htmlFor="occupation">Cargo</Label>
              <Input
                id="occupation"
                type="text"
                name="occupation"
                placeholder="Digite o seu cargo"
                value={user.office}
                readOnly
              />
            </div>
          </div>
          <div className="text-center flex gap-4 justify-end items-end mt-20">
            <Button
              className="bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40 hover:bg-gray-300"
              onClick={() => router.push("/")}
            >
              Voltar
            </Button>
            <Button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-40 hover:bg-blue-400"
              onClick={() => router.push(`/edit-register/${id}`)}
            >
              Editar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
