import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[500px] h-[528px] bg-[#D9D9D9] rounded-lg flex flex-col justify-center items-center">
        <div className="text-center font-bold text-4xl text-[#53A85C] mb-36">
          <span>Alpha</span>
          <span className="text-black font-extralight"> - Betiza</span>
        </div>
        <div className="mb-5 bg-white w-4/6">
          <Input type="email" placeholder="Digite a nova senha" />
        </div>
        <div className="mb-10 bg-white w-4/6">
          <Input type="password" placeholder="Confirme a nova senha" />
        </div>
        <div className="text-center">
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded w-40">
            Cancelar
          </button>
          <button className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40">
            Confirma
          </button>
          <div className="text-center mb-16">
            <a
              href="/password-reset"
              className="text-blue-600 text-base mt-4 block"
            >
              teste
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
