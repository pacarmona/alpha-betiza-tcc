"use client";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Switch } from "./ui/switch";

export default function TopBar() {
  const { userId, setUserId } = useUser();
  const router = useRouter();
  // const pathname = usePathname(); // Obtém a rota atual
  // const [isStudent, setIsStudent] = useState(false);

  // useEffect(() => {
  //   // Define o estado do switch com base na rota atual
  //   setIsStudent(pathname === "/student");
  // }, [pathname]);

  // const handleSwitchChange = (checked: boolean) => {
  //   if (checked) {
  //     router.push("/student");
  //   } else {
  //     router.push("/");
  //   }
  //   setIsStudent(checked);
  // };

  const handleLogout = () => {
    setUserId(null);
    router.push("/login");
  };

  return (
    <div className="w-full bg-[#D9D9D9] p-4 flex justify-between items-center">
      {/* Barra Superior */}
      <div
        className="cursor-pointer text-left font-bold text-4xl text-[#53A85C]"
        onClick={() => router.push("/")}
      >
        <span>Alpha</span>
        <span className="text-black font-extralight"> - Betiza</span>
      </div>
      <div className="flex gap-4">
        <a href={`/`} className="text-blue-600 text-base">
          Início
        </a>
        {userId && (
          <>
            <a
              href={`/view-register/${userId}`}
              className="text-blue-600 text-base"
            >
              Ver Cadastro
            </a>
            <button
              onClick={handleLogout}
              className="text-red-600 text-base hover:text-red-800"
            >
              Sair
            </button>
          </>
        )}
      </div>
      {/* <div className="flex gap-4 items-center">
        <Switch checked={isStudent} onCheckedChange={handleSwitchChange} />
        <span className="text-base">Área do Aluno</span>
      </div> */}
    </div>
  );
}
