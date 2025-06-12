export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[500px] h-[528px] bg-[#D9D9D9] rounded-lg flex flex-col justify-center items-center">
        <div className="text-center font-bold text-4xl text-[#53A85C] mb-10">
          <span>Alpha</span>
          <span className="text-black font-extralight"> - Betiza</span>
        </div>
        <div className="text-center font-bold text-2xl">Seja Bem-vindo(a)!</div>
        <div className="text-center text-base mt-4 mb-5">
          Ferramenta de auxilio para professores e alunos que tem como
          finalidade a alfabetização.
        </div>
        <div className="text-center">
          {/* <button className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40">
            Professor
          </button>
          <button className="bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40">
            Aluno
          </button> */}
          <div className="text-center">
            <a
              href="/authenticate"
              className="text-blue-600 text-base mt-14 block"
            >
              Entre com e-mail e senha
            </a>
            <a
              href="/new-register"
              className="text-blue-600 text-base mt-4 block"
            >
              Criar uma conta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
