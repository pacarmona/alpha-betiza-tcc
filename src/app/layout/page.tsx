import BottomBar from "@/components/bottomBar";
import TopBar from "@/components/topBar";

export default function Home() {
  return (
    <div className="w-full flex flex-col h-full">
      {/* Barra superior */}
      <TopBar />
      <div className="flex w-full h-full"></div>
      <BottomBar />
    </div>
  );
}
