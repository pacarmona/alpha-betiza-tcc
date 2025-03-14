"use client";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[500px] h-[528px] bg-[#D9D9D9] rounded-lg flex flex-col justify-center items-center">
        <div className="text-center font-bold text-4xl text-[#53A85C] mb-36">
          <span>Alpha</span>
          <span className="text-black font-extralight"> - Betiza</span>
        </div>
        <div className="text-center font-bold text-2xl">Redefinir senha</div>
        <div className="text-center text-base mt-4">
          Será enviado para seu e-mail um link para redefinir sua senha.
        </div>
        <div className="text-center mb-16">
          <a
            href="/new-password"
            className="text-blue-600 text-base mt-4 block"
          >
            Reenviar solicitação
          </a>
        </div>
        <div className="text-center">
          <button
            className="bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40"
            onClick={() => router.back()}
          >
            Voltar
          </button>
          <button
            className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40"
            onClick={() => router.push("/authenticate")}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
