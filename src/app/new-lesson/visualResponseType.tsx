import { Input } from "../../components/ui/input";

const InputBlock = () => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <Input id="picture" type="file" />
  </div>
);

export default function VisualResponseType() {
  return (
    <div className="text-left font-bold text-4xl text-black justify-center flex items-center flex-col">
      <div className="flex gap-4 mb-2">
        <InputBlock />
        <InputBlock />
      </div>
      <div className="flex gap-4 mt-2">
        <InputBlock />
        <InputBlock />
      </div>
    </div>
  );
}
