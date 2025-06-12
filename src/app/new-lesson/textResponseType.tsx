/* eslint-disable @next/next/no-img-element */
import InputBlock from "@/components/inputBlock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PutBlobResult } from "@vercel/blob";
import { useEffect, useRef, useState } from "react";

type AnswerKey = "text01" | "text02" | "text03" | "text04";

// Componente reutilizável para o toggle de upload de imagem
const ImageUpload = ({
  showInput,
  handleFileChange,
  inputId,
  inputRef,
  onUpload,
  blob,
}: {
  showInput: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onUpload: (event: React.MouseEvent<HTMLButtonElement>) => void;
  blob: PutBlobResult | null;
}) => (
  <>
    {showInput && (
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
        <Input
          id={inputId}
          type="file"
          onChange={handleFileChange}
          ref={inputRef}
        />
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onUpload}
        >
          Enviar
        </Button>
        {blob && (
          <div className="mt-2">
            <img
              src={blob.url}
              alt="Imagem enviada"
              className="max-w-full h-auto"
            />
          </div>
        )}
      </div>
    )}
  </>
);

export default function TextResponseType({
  saveCorrectAnswerId,
  saveResponseLesson,
  saveAnswerImages,
  initialAnswers,
  initialAnswerImages,
  initialCorrectAnswer,
}: {
  saveCorrectAnswerId: (correctAnswerId: string | null) => void;
  saveResponseLesson: (responseLesson: { [key: string]: string }) => void;
  saveAnswerImages: (images: { [key: string]: string }) => void;
  initialAnswers?: { [key: string]: string };
  initialAnswerImages?: { [key: string]: string };
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

  const [imageUrls, setImageUrls] = useState<{ [key in AnswerKey]: string }>(
    (initialAnswerImages as {
      text01: string;
      text02: string;
      text03: string;
      text04: string;
    }) || {
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

  const [, setFiles] = useState<{ [key in AnswerKey]: File | null }>({
    text01: null,
    text02: null,
    text03: null,
    text04: null,
  });

  const [blobs, setBlobs] = useState<{
    [key in AnswerKey]: PutBlobResult | null;
  }>({
    text01: null,
    text02: null,
    text03: null,
    text04: null,
  });

  const inputRefs: { [key in AnswerKey]: React.RefObject<HTMLInputElement> } = {
    text01: useRef<HTMLInputElement>(null),
    text02: useRef<HTMLInputElement>(null),
    text03: useRef<HTMLInputElement>(null),
    text04: useRef<HTMLInputElement>(null),
  };

  // Verifica se existem imagens nas alternativas
  const hasImages = Object.values(imageUrls).some((url) => url !== "");

  useEffect(() => {
    if (initialAnswers) {
      setResponses(initialAnswers);
    }
    if (initialAnswerImages) {
      setImageUrls(initialAnswerImages as { [key in AnswerKey]: string });
    }
    if (initialCorrectAnswer !== undefined) {
      setCorrectAnswerId(initialCorrectAnswer);
      saveCorrectAnswerId(initialCorrectAnswer);
    }
  }, [
    initialAnswers,
    initialAnswerImages,
    initialCorrectAnswer,
    saveCorrectAnswerId,
  ]);

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
    if (hasImages) {
      const confirmed = window.confirm(
        "Tem certeza que deseja remover todas as imagens das alternativas?"
      );
      if (!confirmed) return;

      // Limpar todas as imagens
      const emptyImages: { [key in AnswerKey]: string } = {
        text01: "",
        text02: "",
        text03: "",
        text04: "",
      };

      setBlobs({ text01: null, text02: null, text03: null, text04: null });
      setImageUrls(emptyImages);
      saveAnswerImages(emptyImages);
      setShowAllInputs(false);
    } else {
      setShowAllInputs(!showAllInputs);
    }
  };

  const handleFileChange =
    (key: AnswerKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFiles((prev) => ({ ...prev, [key]: file }));
    };

  const handleUpload =
    (key: AnswerKey) => async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (!inputRefs[key].current?.files) {
        throw new Error("Nenhum arquivo selecionado");
      }

      const file = inputRefs[key].current.files[0];

      try {
        const response = await fetch(`/api/upload?filename=${file.name}`, {
          method: "POST",
          body: file,
        });

        if (!response.ok) {
          throw new Error("Erro ao fazer upload do arquivo");
        }

        const newBlob = (await response.json()) as PutBlobResult;
        setBlobs((prev) => ({ ...prev, [key]: newBlob }));
        setImageUrls((prev) => ({ ...prev, [key]: newBlob.url }));
        saveAnswerImages({ ...imageUrls, [key]: newBlob.url });
      } catch (error) {
        console.error("Erro no upload:", error);
        alert("Erro ao fazer upload da imagem");
      }
    };

  // Função para renderizar cada resposta
  const renderAnswer = (key: AnswerKey, label: string) => (
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
        inputRef={inputRefs[key]}
        onUpload={handleUpload(key)}
        blob={blobs[key]}
      />
      {imageUrls[key] && !blobs[key] && (
        <div className="mt-2">
          <img
            src={imageUrls[key]}
            alt="Imagem da resposta"
            className="max-w-full h-auto"
          />
        </div>
      )}
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
          {hasImages ? "Remover imagens" : "Adicionar imagens"}
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
