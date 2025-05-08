import InputBlock from "@/components/inputBlock";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export default function TextResponseType({
  saveCorrectAnswerId,
  saveResponseLesson,
  initialAnswers,
  initialCorrectAnswer,
}: {
  saveCorrectAnswerId: (correctAnswerId: string | null) => void;
  saveResponseLesson: (responseLesson: { [key: string]: string }) => void;
  initialAnswers?: { [key: string]: string };
  initialCorrectAnswer?: string | null;
}) {
  const [responseLesson, setResponses] = useState<{ [key: string]: string }>(
    initialAnswers || {
      text01: "",
      text02: "",
      text03: "",
      text04: "",
    }
  );

  const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(
    initialCorrectAnswer || "text01"
  );

  useEffect(() => {
    if (initialAnswers) {
      setResponses(initialAnswers);
    }
    if (initialCorrectAnswer !== undefined) {
      setCorrectAnswerId(initialCorrectAnswer);
      saveCorrectAnswerId(initialCorrectAnswer);
    }
  }, [initialAnswers, initialCorrectAnswer]);

  const handleChange = (key: string) => (value: string) => {
    const newResponses = { ...responseLesson, [key]: value };
    setResponses(newResponses);
    saveResponseLesson(newResponses);
  };

  const handleSwitchChange = (key: string) => {
    setCorrectAnswerId(key);
    saveCorrectAnswerId(key);
  };

  return (
    <div className="text-left font-bold text-4xl text-black justify-center flex items-center flex-col">
      <div className="text-center flex gap-4 mb-2 ">
        <div className="flex flex-col items-start">
          <Label className="mb-2" htmlFor="text01">
            Resposta 01
          </Label>
          <InputBlock
            id="text01"
            value={responseLesson["text01"]}
            onChange={handleChange("text01")}
            placeholder="Digite a descrição da questão"
          />
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="text01-a"
              checked={correctAnswerId === "text01"}
              onCheckedChange={() => handleSwitchChange("text01")}
            />
            <Label htmlFor="text01-a">Resposta Correta</Label>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <Label className="mb-2" htmlFor="text02">
            Resposta 02
          </Label>
          <InputBlock
            id="text02"
            value={responseLesson["text02"]}
            onChange={handleChange("text02")}
            placeholder="Digite a descrição da questão"
          />
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="text02-a"
              checked={correctAnswerId === "text02"}
              onCheckedChange={() => handleSwitchChange("text02")}
            />
            <Label htmlFor="text02-a">Resposta Correta</Label>
          </div>
        </div>
      </div>
      <div className="text-center flex gap-4 mt-2">
        <div className="flex flex-col items-start">
          <Label className="mb-2" htmlFor="text03">
            Resposta 03
          </Label>
          <InputBlock
            id="text03"
            value={responseLesson["text03"]}
            onChange={handleChange("text03")}
            placeholder="Digite a descrição da questão"
          />
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="text03-a"
              checked={correctAnswerId === "text03"}
              onCheckedChange={() => handleSwitchChange("text03")}
            />
            <Label htmlFor="text03-a">Resposta Correta</Label>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <Label className="mb-2" htmlFor="text04">
            Resposta 04
          </Label>
          <InputBlock
            id="text04"
            value={responseLesson["text04"]}
            onChange={handleChange("text04")}
            placeholder="Digite a descrição da questão"
          />
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="text04-a"
              checked={correctAnswerId === "text04"}
              onCheckedChange={() => handleSwitchChange("text04")}
            />
            <Label htmlFor="text04-a">Resposta Correta</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
