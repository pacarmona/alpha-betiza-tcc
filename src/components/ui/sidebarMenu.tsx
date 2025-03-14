"use client";
import { useState } from "react";

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Menu lateral */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#D9D9D9] p-4 transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <button
          className="text-black mb-4 focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? "<" : ">"}
        </button>

        {/* Conteúdo do menu */}
        <nav className={`flex flex-col gap-4 ${isOpen ? "block" : "hidden"}`}>
          <a href="#" className="text-blue-600 text-base">
            Dashboard
          </a>
          <a href="#" className="text-blue-600 text-base">
            Minhas Atividades
          </a>
          <a href="#" className="text-blue-600 text-base">
            Configurações
          </a>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div
        className={`ml-${isOpen ? "64" : "16"} p-4 transition-all duration-300`}
      >
        <h1 className="text-2xl font-bold">Conteúdo Principal</h1>
        <p>Aqui está o conteúdo da página.</p>
      </div>
    </div>
  );
}
