"use client";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Swal from "sweetalert2";

export default function Login() {
  const { setUserId } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const { email, password } = formData;

      if (!email || !password) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, preencha todos os campos!",
        });
        return;
      }

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setUserId(data.userId);
      if (response.ok) {
        // Armazenar o token no localStorage
        localStorage.setItem("authToken", data.token);

        // Redirecionar para a página inicial, por exemplo
        router.push("/");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "E-mail ou senha incorretos!";

      Swal.fire({
        icon: "error",
        title: "Erro de autenticação",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[500px] h-[528px] bg-[#D9D9D9] rounded-lg flex flex-col justify-center items-center">
        <div className="text-center font-bold text-4xl text-[#53A85C] mb-5">
          <span>Alpha</span>
          <span className="text-black font-extralight"> - Betiza</span>
        </div>
        <div className="text-center font-bold text-2xl">Seja Bem-vindo(a)!</div>
        <div className="text-center text-base mt-4 mb-5">
          Ferramenta de auxilio para professores e alunos que tem como
          finalidade a alfabetização.
        </div>
        <div className="mb-5 bg-white w-4/6">
          <Input
            type="email"
            name="email"
            placeholder="Digite seu e-mail"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="bg-white w-4/6">
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="text-center mb-5">
          <a
            href="/new-register"
            className="text-blue-600 text-base mt-4 block"
          >
            Criar uma conta
          </a>
        </div>
        <div className="text-center">
          <button
            className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40"
            onClick={handleSubmit}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
