import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export default function CancelAndConfirmButtons({ page }: { page: string }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div>
      {/*Barra inferior*/}
      <div className="text-center flex gap-4">
        <Button
          className="bg-red-500 text-white font-bold py-2 px-4 rounded w-40 hover:bg-red-400"
          onClick={toggleModal}
        >
          Cancelar
        </Button>
        <Button
          className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40 hover:bg-[#72c177]"
          onClick={() => router.push(page)}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
