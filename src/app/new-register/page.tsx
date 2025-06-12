"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Swal from "sweetalert2";
import { saveFormData } from "./actions";

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

export default function NewRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    birthday: "",
    phone: "",
    password: "",
    confirmPassword: "",
    school: "",
    occupation: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      name,
      email,
      birthday,
      phone,
      password,
      confirmPassword,
      school,
      occupation,
    } = formData;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (
      !name ||
      !email ||
      !birthday ||
      !phone ||
      !password ||
      !confirmPassword ||
      !school ||
      !occupation
    ) {
      errorText("Por favor, preencha todos os campos!");
      return;
    }

    // Validação de nome: Apenas letras, máximo 50 caracteres
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{1,50}$/;
    if (!nameRegex.test(name)) {
      errorText(
        "O nome deve conter apenas letras e ter no máximo 50 caracteres."
      );
      return;
    }

    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorText("Por favor, insira um e-mail válido!");
      return;
    }

    // Validação de telefone: Apenas números e exatamente 11 dígitos
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      errorText(
        "Por favor, insira um número de telefone válido com 11 dígitos (apenas números)."
      );
      return;
    }

    // Validação de senha: Apenas letras e números, exatamente 8 caracteres
    const passwordRegex = /^[A-Za-z0-9]{8}$/;
    if (!passwordRegex.test(password)) {
      errorText(
        "A senha deve conter apenas letras e números com exatamente 8 caracteres."
      );
      return;
    }

    // Verifica se as senhas são iguais
    if (password !== confirmPassword) {
      errorText("As senhas não coincidem!");
      return;
    }

    // Validação de instituição: Apenas letras, máximo 30 caracteres
    const schoolRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{1,30}$/;
    if (!schoolRegex.test(school)) {
      errorText(
        "O nome da instituição deve conter apenas letras e ter no máximo 30 caracteres."
      );
      return;
    }

    // Validação de cargo: Apenas letras, máximo 25 caracteres
    const occupationRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{1,25}$/;
    if (!occupationRegex.test(occupation)) {
      errorText(
        "O cargo deve conter apenas letras e ter no máximo 25 caracteres."
      );
      return;
    }

    try {
      await saveFormData(formData); // Chama a server action diretamente

      // Exibe o modal de sucesso e espera a confirmação do usuário
      Swal.fire({
        title: "Seu cadastrado foi efetuado!",
        text: "Formulário enviado com sucesso!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Redireciona o usuário após fechar o modal
        router.push("/authenticate"); // Redireciona para a tela de autenticação
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorText("Erro ao enviar o formulário: " + error.message);
      } else {
        errorText("Erro desconhecido ao enviar o formulário");
      }
    }
  };

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
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className=" bg-white w-4full mb-5 mt-5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Digite o seu E-mail"
                value={formData.email}
                onChange={handleChange}
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
                  value={formData.birthday}
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
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bg-white flex gap-4 mt-5 w-full">
              <div className="flex flex-col w-full">
                <Label htmlFor="password">Insira uma senha</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col w-full">
                <Label htmlFor="repetPassword">Confirme a sua senha</Label>
                <Input
                  id="repetPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirme a senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
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
                value={formData.school}
                onChange={handleChange}
              />
            </div>
            <div className=" bg-white w-4full mb-5 mt-5">
              <Label htmlFor="occupation">Cargo</Label>
              <Input
                id="occupation"
                type="text"
                name="occupation"
                placeholder="Digite o seu cargo"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="text-center flex gap-4 justify-end items-end mt-20">
            <Button className="bg-red-500 text-white font-bold py-2 px-4 rounded w-40 hover:bg-red-400">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40 hover:bg-[#72c177]"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function errorText(error: string) {
  Swal.fire({
    icon: "error",
    title: "Ocorreu um erro",
    text: error,
  });
}
