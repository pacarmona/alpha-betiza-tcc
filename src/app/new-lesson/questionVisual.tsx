import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QuestionText from "./questionText";

export default function QuestionVisual({
  description,
  setDescription,
}: {
  description: string;
  setDescription: (description: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <QuestionText description={description} setDescription={setDescription} />

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Selecione uma imagem</Label>
        <Input id="picture" type="file" accept="image/*" />
      </div>
    </div>
  );
}
