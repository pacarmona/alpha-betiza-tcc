import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PutBlobResult } from "@vercel/blob";
import React, { useEffect, useRef, useState } from "react";

const TextareaBlock = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) => (
  <div className="bg-white w-4/5">
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md"
      rows={4}
    />
  </div>
);

export default function QuestionText({
  description,
  setDescription,
  setImageURL,
  initialImageURL,
}: {
  description: string;
  setDescription: (description: string) => void;
  setImageURL: (image: string) => void;
  initialImageURL?: string;
}) {
  const [showInput, setShowInput] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [currentImageURL, setCurrentImageURL] = useState<string>(
    initialImageURL || ""
  );

  useEffect(() => {
    if (initialImageURL) {
      setCurrentImageURL(initialImageURL);
    }
  }, [initialImageURL]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const toggleInput = () => {
    if (currentImageURL) {
      const confirmed = confirm(
        "Tem certeza que deseja remover a imagem selecionada?"
      );
      if (!confirmed) return;
      setCurrentImageURL("");
      setImageURL("");
      setShowInput(false);
    } else {
      setShowInput(!showInput);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Apenas atualiza o estado do input
      setShowInput(true);
    }
  };

  const upload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    const response = await fetch(`/api/upload?filename=${file.name}`, {
      method: "POST",
      body: file,
    });

    const newBlob = (await response.json()) as PutBlobResult;
    setCurrentImageURL(newBlob.url);
    setImageURL(newBlob.url);
    setShowInput(false);
  };

  return (
    <div>
      <Label htmlFor="description">Descrição</Label>
      <TextareaBlock
        placeholder="Digite a descrição da questão"
        value={description}
        onChange={handleChange}
      />

      <div className="mt-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleInput();
          }}
          className="text-blue-600 hover:underline"
        >
          {currentImageURL ? "Remover imagem" : "Adicionar imagem"}
        </a>
        {showInput && (
          <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
            <Input
              id="picture"
              type="file"
              onChange={handleFileChange}
              ref={inputFileRef}
            />
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={upload}
            >
              Enviar
            </Button>
          </div>
        )}
        {currentImageURL && (
          <div className="mt-4">
            <img
              src={currentImageURL}
              alt="Imagem da questão"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}
