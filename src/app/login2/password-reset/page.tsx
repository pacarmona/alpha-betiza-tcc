export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[500px] h-[528px] bg-[#D9D9D9] rounded-lg flex flex-col justify-center items-center">
        <div className="text-center font-bold text-4xl text-[#53A85C] mb-36">
          <span>Alpha</span>
          <span className="text-black font-extralight"> - Betiza</span>
        </div>
        <div className="text-center font-bold text-2xl">
          Senha redefinida com sucesso!
        </div>
        <div className="text-center mb-16">
          <a href="/" className="text-blue-600 text-base mt-4 block">
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
}
