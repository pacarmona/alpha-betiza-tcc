import InputBlock from "@/components/inputBlock";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

// Componente reutilizável para o toggle de upload de imagem
const ImageUpload = ({
  showInput,
  handleFileChange,
  inputId,
}: {
  showInput: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
}) => (
  <>
    {showInput && (
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
        <Input id={inputId} type="file" onChange={handleFileChange} />
      </div>
    )}
  </>
);

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

  // Estado unificado para gerenciar a exibição de todos os inputs de imagem
  const [showAllInputs, setShowAllInputs] = useState(false);

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    text01: null,
    text02: null,
    text03: null,
    text04: null,
  });

  useEffect(() => {
    if (initialAnswers) {
      setResponses(initialAnswers);
    }
    if (initialCorrectAnswer !== undefined) {
      setCorrectAnswerId(initialCorrectAnswer);
      saveCorrectAnswerId(initialCorrectAnswer);
    }
  }, [initialAnswers, initialCorrectAnswer, saveCorrectAnswerId]);

  const handleChange = (key: string) => (value: string) => {
    const newResponses = { ...responseLesson, [key]: value };
    setResponses(newResponses);
    saveResponseLesson(newResponses);
  };

  const handleSwitchChange = (key: string) => {
    setCorrectAnswerId(key);
    saveCorrectAnswerId(key);
  };

  const toggleAllInputs = () => {
    if (showAllInputs && Object.values(files).some((file) => file !== null)) {
      const confirmed = window.confirm(
        "Tem certeza que deseja remover todas as imagens selecionadas?"
      );
      if (!confirmed) return;
      setFiles({ text01: null, text02: null, text03: null, text04: null });
    }
    setShowAllInputs(!showAllInputs);
  };

  const handleFileChange =
    (key: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFiles((prev) => ({ ...prev, [key]: file }));
    };

  // Função para renderizar cada resposta
  const renderAnswer = (key: string, label: string) => (
    <div className="flex flex-col items-start">
      <Label className="mb-2" htmlFor={key}>
        {label}
      </Label>
      <InputBlock
        id={key}
        value={responseLesson[key]}
        onChange={handleChange(key)}
        placeholder="Digite a descrição da questão"
      />
      <ImageUpload
        showInput={showAllInputs}
        handleFileChange={handleFileChange(key)}
        inputId={`picture-${key}`}
      />
      <div className="flex items-center space-x-2 mt-2">
        <Switch
          id={`${key}-a`}
          checked={correctAnswerId === key}
          onCheckedChange={() => handleSwitchChange(key)}
        />
        <Label htmlFor={`${key}-a`}>Resposta Correta</Label>
      </div>
    </div>
  );

  return (
    <div className="text-left font-bold text-4xl text-black justify-center flex items-center flex-col">
      <div className="w-full text-left mb-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleAllInputs();
          }}
          className="text-blue-600 hover:underline text-base"
        >
          {showAllInputs ? "Remover imagens" : "Adicionar imagens"}
        </a>
      </div>
      <div className="text-center flex gap-4 mb-2">
        {renderAnswer("text01", "Resposta 01")}
        {renderAnswer("text02", "Resposta 02")}
      </div>
      <div className="text-center flex gap-4 mt-2">
        {renderAnswer("text03", "Resposta 03")}
        {renderAnswer("text04", "Resposta 04")}
      </div>
    </div>
  );
}
