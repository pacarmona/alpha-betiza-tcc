import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PutBlobResult } from "@vercel/blob";
import React, { useRef, useState } from "react";

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
}: {
  description: string;
  setDescription: (description: string) => void;
  setImageURL: (image: string) => void;
}) {
  const [showInput, setShowInput] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const toggleInput = () => {
    if (showInput && file) {
      const confirmed = confirm(
        "Tem certeza que deseja remover a imagem selecionada?"
      );
      if (!confirmed) return;
      setFile(null);
    }
    setShowInput(!showInput);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const upload = async (event: any) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    const response = await fetch(`/api/upload?filename=${file.name}`, {
      method: "POST",
      body: file,
    });
    console.log("response", response);

    const newBlob = (await response.json()) as PutBlobResult;

    setBlob(newBlob);
    setImageURL(newBlob.url);
  };

  return (
    <div>
      <Label htmlFor="description">Descrição</Label>
      <TextareaBlock
        placeholder="Digite a descrição da questão"
        value={description}
        onChange={handleChange}
      />

      <div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleInput();
          }}
          className="text-blue-600 hover:underline"
        >
          {showInput ? "Remover imagem" : "Adicionar imagem"}
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
              enviar
            </Button>
          </div>
        )}{" "}
        {blob && (
          <div>
            Blob url: <a href={blob.url}>{blob.url}</a>
          </div>
        )}
      </div>
    </div>
  );
}
