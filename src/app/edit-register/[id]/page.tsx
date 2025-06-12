"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function EditRegister() {
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
    if (typeof id === "string") {
      fetchUserById(id); // Buscar os dados do usuário com o ID
    } else {
      console.error("ID do usuário não encontrado");
    }
  }, [id]);

  // Atualiza os valores de user ao alterar os campos
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Função para salvar alterações
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH", // PATCH ou PUT, dependendo de como sua API lida com atualizações
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user), // Enviar os dados atualizados
      });

      if (response.ok) {
        router.push(`/view-register/${id}`); // Redireciona após o sucesso
      } else {
        const data = await response.json();
        console.error("Erro ao atualizar usuário:", data.message);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex w-full h-full flex-col">
        <div className="flex flex-wrap flex-col gap-4 w-[85%] ml-10 mt-10">
          <div className="text-left font-bold text-4xl text-black">
            <p>Editar Conta</p>
          </div>
          <div className="text-left font-bold text-lg text-black">
            <p>Dados Pessoais</p>

            <div className="bg-white w-full mb-5 mt-5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Digite o seu nome"
                value={user.name}
                onChange={handleChange}
              />
            </div>
            <div className="bg-white w-full mb-5 mt-5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Digite o seu E-mail"
                value={user.email}
                onChange={handleChange}
              />
            </div>

            <div className="bg-white flex gap-4 mt-5 w-full">
              <div className="flex flex-col w-full">
                <Label htmlFor="birthday">Data de nascimento</Label>
                <Input
                  id="birthday"
                  type="date"
                  name="birthday"
                  placeholder="Data de Nascimento"
                  value={user.birthday}
                  onChange={handleChange}
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
                  onChange={handleChange}
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

            <div className="bg-white w-full mb-5 mt-5">
              <Label htmlFor="educational_institution">
                Instituição de ensino
              </Label>
              <Input
                id="educational_institution"
                type="text"
                name="educational_institution"
                placeholder="Digite o nome da instituição de ensino"
                value={user.educational_institution}
                onChange={handleChange}
              />
            </div>
            <div className="bg-white w-full mb-5 mt-5">
              <Label htmlFor="office">Cargo</Label>
              <Input
                id="office"
                type="text"
                name="office"
                placeholder="Digite o seu cargo"
                value={user.office}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="text-center flex gap-4 justify-end items-end mt-20">
            <Button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded w-40 hover:bg-red-400"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40 hover:bg-[#72c177]"
              onClick={handleSave}
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
