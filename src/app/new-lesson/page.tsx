"use client";
import BottomBar from "@/components/bottomBar";
import TopBar from "@/components/topBar";
import TypeAnswers from "@/components/typeAnswers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import TypeQuestion from "../../components/typeQuestion";
import QuestionText from "./questionText";
import QuestionVisual from "./questionVisual";
import TextResponseType from "./textResponseType";
import VisualResponseType from "./visualResponseType";

export default function NewLesson() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState([{ id: 1 }]);

  const [lessonId, setLessonId] = useState<string | null>(null);
  //teste
  const handleAddQuestion = () => {
    if (questions.length < 10) {
      setQuestions([...questions, { id: questions.length + 1 }]);
    }
  };

  const [formData, setFormData] = useState({
    questionTitle: "",
  });

  const [description, setDescription] = useState<string>("");

  const [selectedQuestionType, setSelectedQuestionType] =
    useState<string>("Textual");
  const [selectedAnswersType, setSelectedAnswersType] =
    useState<string>("Textual");

  const [responseLesson, setResponseLesson] = useState<{
    [key: string]: string;
  }>({
    text01: "",
    text02: "",
    text03: "",
    text04: "",
  });

  const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(
    "text01"
  );

  const saveResponseLesson = (responseLesson: { [key: string]: string }) => {
    setResponseLesson(responseLesson);
  };
  const saveCorrectAnswerId = (correctAnswerId: string | null) => {
    setCorrectAnswerId(correctAnswerId);
    console.log(correctAnswerId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { questionTitle } = formData;

    if (
      !lessonId ||
      !questionTitle ||
      !selectedQuestionType ||
      !selectedAnswersType ||
      !description
    ) {
      errorText("Preencha todos os campos obrigatórios");
      return;
    }
    const questionType = selectedQuestionType.toUpperCase();
    const answerType = selectedAnswersType.toUpperCase();

    try {
      const response = await fetch(`/api/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: lessonId,
          title: questionTitle,
          questionType: questionType,
          answerType: answerType,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar a questão");
      }

      const result = await response.json();
      const questionID = result.questionId;
      SuccessText(result.message);
      try {
        const answers = [];
        for (const [key, value] of Object.entries(responseLesson)) {
          answers.push({
            questionId: questionID,
            text: value,
            type: answerType,
            is_correct: key === correctAnswerId,
          });
        }

        const response = await fetch(`/api/answer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId: questionID,
            answers: answers,
          }),
        });

        if (!response.ok) {
          throw new Error("Falha ao salvar a resposta");
        }
      } catch (error) {
        console.error(error);
        errorText("Ocorreu um erro ao salvar a resposta");
      }
    } catch (error) {
      console.error(error);
      errorText("Ocorreu um erro ao salvar a questão");
    }
  };

  const renderQuestionType = () => {
    switch (selectedQuestionType) {
      case "Textual":
        return (
          <QuestionText
            description={description}
            setDescription={setDescription}
          />
        );
      case "Visual":
        return <QuestionVisual />;
      case "Auditivo":
        return <div>Componente Auditivo (a ser implementado)</div>;
      default:
        return null;
    }
  };

  const renderAnswersType = () => {
    switch (selectedAnswersType) {
      case "Textual":
        return (
          <TextResponseType
            saveCorrectAnswerId={saveCorrectAnswerId}
            saveResponseLesson={saveResponseLesson}
          />
        );
      case "Visual":
        return <VisualResponseType />;
      case "Auditivo":
        return <div>Componente Auditivo (a ser implementado)</div>;
      default:
        return null;
    }
  };

  useEffect(() => {
    const id = searchParams.get("lessonId");
    if (id) {
      setLessonId(id);
    }
  }, [searchParams]);

  return (
    <div className="w-full flex flex-col h-full">
      {/* Barra superior */}
      <TopBar />

      {/* Barra lateral */}
      <div className="w-full h-full flex">
        <div className="bg-[#D9D9D9] h-full w-[15%]">
          <div className="justify-between items-center flex flex-col h-full">
            {questions.map((question) => (
              <Button
                key={question.id}
                className="bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40 mt-4 hover:bg-[#8f9197]"
              >
                {`Questão ${question.id}`}
              </Button>
            ))}
            <Button
              onClick={handleAddQuestion}
              className="bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40 mb-56 mt-4 hover:bg-[#8f9197]"
            >
              Adicionar Questão
            </Button>
          </div>
        </div>
        {/*<div className="bg-[#D9D9D9] h-full w-[15%]">
          <div className="justify-between items-center flex flex-col h-full">
            <Button className="bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40 mt-20 hover:bg-[#8f9197]">
              Questão 1
            </Button>
            <Button className="bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40 mb-56 hover:bg-[#8f9197]">
              Adicionar Questão
            </Button>
          </div>
        </div>*/}

        {/* Conteúdo principal da tela */}
        <div className="flex flex-wrap flex-col gap-4 w-[85%] ml-10 mt-10">
          {/* Título da questão */}
          <div className=" bg-white w-4/5 ">
            <Label htmlFor="questionTitle">Título da questão</Label>
            <Input
              id="questionTitle"
              type="text"
              name="questionTitle"
              placeholder="Digite o título da questão"
              value={formData.questionTitle}
              onChange={handleChange}
            />
          </div>

          {/* Botões para escolher o tipo da questão */}
          <Label htmlFor="questionType">Tipo da questão</Label>
          <TypeQuestion
            selectedQuestionType={selectedQuestionType}
            setSelectedQuestionType={setSelectedQuestionType}
          />

          {/* Renderiza o tipo de questão escolhido */}
          {renderQuestionType()}

          {/* Respostas */}
          <div>
            <div className="text-left font-bold text-4xl text-black mb-5">
              <p>Respostas</p>
            </div>
            {/* Botões para escolher o tipo da resposta */}
            <TypeAnswers
              selectedAnswersType={selectedAnswersType}
              setSelectedResponseType={setSelectedAnswersType}
            />

            {/* Espaçamento de 5 entre o tipo de resposta e o conteúdo renderizado */}
            <div className="mt-5">
              {/* Renderiza o tipo de resposta escolhido */}
              {renderAnswersType()}
            </div>
          </div>

          {/* Botões para cancelar ou confirmar */}
          <div className="text-center flex gap-4 justify-end mr-64 mt-10">
            <Button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded w-40 hover:bg-red-400"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40 hover:bg-[#72c177]"
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
function errorText(error: string) {
  Swal.fire({
    icon: "error",
    title: "Ocorreu um erro",
    text: error,
  });
}

function SuccessText(text: string) {
  Swal.fire({
    icon: "success",
    title: "O procedimento foi efetuado!",
    text: text,
    confirmButtonText: "OK",
  });
}
