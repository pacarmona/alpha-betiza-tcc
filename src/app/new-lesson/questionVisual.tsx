import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function QuestionVisual() {
  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Selecione uma imagem</Label>
        <Input id="picture" type="file" />
      </div>
    </div>
  );
}
