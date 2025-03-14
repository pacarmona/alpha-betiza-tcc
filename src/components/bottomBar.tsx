export default function BottomBar() {
  return (
    <div className="w-full bg-[#D9D9D9] p-4 flex justify-between items-center">
      {/*Barra inferior*/}
      <div className="text-left text-base text-black">
        <span>Plataforma de auxilio à alfabetização</span>
      </div>
      <div className="flex gap-4">
        <a href="#" className="text-blue-600 text-base">
          Contato
        </a>
        <a href="#" className="text-blue-600 text-base">
          Ajuda
        </a>
      </div>
    </div>
  );
}
