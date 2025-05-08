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

interface Question {
  id: string;
  title: string;
  description: string;
  type: string;
  answer_type: string;
  Answers: Answer[];
}

interface Answer {
  id: string;
  text: string;
  type: string;
  is_correct: boolean;
  questionId: string;
}

export default function NewLesson() {
  const router = useRouter();
  //const params = useParams();
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState<{ id: string; title: string }[]>(
    []
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [lessonId, setLessonId] = useState<string | null>(null);

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

  const fetchQuestions = async () => {
    if (!lessonId) return;
    try {
      const response = await fetch(`/api/question?lessonId=${lessonId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar as questões");
      }
      const data: Question[] = await response.json();
      // Transformar os dados para manter o padrão de numeração
      const formattedQuestions = data.map(
        (question: Question, index: number) => ({
          id: question.id,
          title: `Questão ${index + 1}`,
        })
      );
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error(error);
      errorText("Erro ao carregar as questões");
    }
  };

  useEffect(() => {
    const id = searchParams.get("lessonId");
    if (id) {
      setLessonId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (lessonId) {
      fetchQuestions();
    }
  }, [lessonId]);

  const handleQuestionClick = async (questionId: string) => {
    setSelectedQuestionId(questionId);
    setIsEditing(false);
    setIsFormDisabled(true);
    setIsCreatingNew(false);

    try {
      // Buscar os dados da questão
      const response = await fetch(`/api/question/${questionId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar os dados da questão");
      }
      const questionData: Question = await response.json();

      // Atualizar o formulário com os dados da questão
      setFormData({ questionTitle: questionData.title });
      setDescription(questionData.description);

      // Converter o tipo da questão para o formato esperado
      const questionType = questionData.type.toLowerCase();
      const formattedQuestionType =
        questionType.charAt(0).toUpperCase() + questionType.slice(1);
      setSelectedQuestionType(formattedQuestionType);

      // Converter o tipo de resposta para o formato esperado
      const answerType = questionData.answer_type.toLowerCase();
      const formattedAnswerType =
        answerType.charAt(0).toUpperCase() + answerType.slice(1);
      setSelectedAnswersType(formattedAnswerType);

      // Atualizar o estado das respostas
      const responseLesson: { [key: string]: string } = {
        text01: questionData.Answers[0]?.text || "",
        text02: questionData.Answers[1]?.text || "",
        text03: questionData.Answers[2]?.text || "",
        text04: questionData.Answers[3]?.text || "",
      };
      setResponseLesson(responseLesson);

      // Encontrar a resposta correta
      const correctAnswer = questionData.Answers.find(
        (a: Answer) => a.is_correct
      );
      if (correctAnswer) {
        const correctIndex = questionData.Answers.indexOf(correctAnswer);
        setCorrectAnswerId(`text0${correctIndex + 1}`);
      }

      console.log("Dados carregados:", {
        questionData,
        responseLesson,
        correctAnswerId: correctAnswer
          ? `text0${questionData.Answers.indexOf(correctAnswer) + 1}`
          : null,
      });
    } catch (error) {
      console.error(error);
      errorText("Erro ao carregar os dados da questão");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const result = await Swal.fire({
        title: "Tem certeza?",
        text: "Esta ação não poderá ser revertida!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`/api/question/${questionId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao excluir a questão");
        }

        // Atualizar a lista de questões
        setQuestions(questions.filter((q) => q.id !== questionId));

        // Se a questão excluída era a selecionada, limpar o formulário
        if (selectedQuestionId === questionId) {
          setSelectedQuestionId(null);
          setFormData({ questionTitle: "" });
          setDescription("");
          setResponseLesson({
            text01: "",
            text02: "",
            text03: "",
            text04: "",
          });
          setCorrectAnswerId("text01");
        }

        SuccessText(data.message || "Questão excluída com sucesso!");
      }
    } catch (error) {
      console.error(error);
      errorText(
        error instanceof Error ? error.message : "Erro ao excluir a questão"
      );
    }
  };

  const handleEditClick = () => {
    if (isEditing) {
      // Se estiver editando, salva as alterações
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      setIsEditing(false);
      setIsFormDisabled(true);
    } else {
      // Se não estiver editando, habilita a edição
      setIsEditing(true);
      setIsFormDisabled(false);
    }
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

    if (questions.length >= 10 && !selectedQuestionId) {
      errorText("Limite máximo de 10 questões atingido");
      return;
    }

    const questionType = selectedQuestionType.toUpperCase();
    const answerType = selectedAnswersType.toUpperCase();

    try {
      let response;
      let questionID;

      if (selectedQuestionId) {
        // Atualizar questão existente
        response = await fetch(`/api/question/${selectedQuestionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: questionTitle,
            questionType: questionType,
            answerType: answerType,
            description: description,
          }),
        });

        if (!response.ok) {
          throw new Error("Falha ao atualizar a questão");
        }

        const result = await response.json();
        questionID = selectedQuestionId;
        SuccessText(result.message);
      } else {
        // Criar nova questão
        response = await fetch(`/api/question`, {
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
        questionID = result.questionId;
        SuccessText(result.message);

        // Adicionar a nova questão à lista de questões
        setQuestions([
          ...questions,
          {
            id: questionID,
            title: `Questão ${questions.length + 1}`,
          },
        ]);
      }

      // Atualizar as respostas
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
          method: selectedQuestionId ? "PUT" : "POST",
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

      // Limpar o formulário apenas se for uma nova questão
      if (!selectedQuestionId) {
        setFormData({ questionTitle: "" });
        setDescription("");
        setResponseLesson({
          text01: "",
          text02: "",
          text03: "",
          text04: "",
        });
        setCorrectAnswerId("text01");
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
            initialAnswers={responseLesson}
            initialCorrectAnswer={correctAnswerId}
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

  const handleAddNewQuestion = () => {
    if (isCreatingNew) {
      // Se já estiver criando, salva a questão
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      setIsCreatingNew(false);
      setIsFormDisabled(true);
    } else {
      // Se não estiver criando, prepara para criar uma nova
      setSelectedQuestionId(null);
      setIsEditing(false);
      setIsFormDisabled(false);
      setIsCreatingNew(true);
      setFormData({ questionTitle: "" });
      setDescription("");
      setResponseLesson({
        text01: "",
        text02: "",
        text03: "",
        text04: "",
      });
      setCorrectAnswerId("text01");
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Barra superior */}
      <TopBar />

      {/* Barra lateral */}
      <div className="w-full h-full flex">
        <div className="bg-[#D9D9D9] h-full w-[15%]">
          <div className="flex flex-col items-center gap-2 pt-4">
            {questions.map((question) => (
              <div key={question.id} className="flex items-center gap-2">
                <Button
                  className={`bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40 hover:bg-[#8f9197] ${
                    selectedQuestionId === question.id ? "bg-[#53A85C]" : ""
                  }`}
                  onClick={() => handleQuestionClick(question.id)}
                >
                  {question.title}
                </Button>
                <Button
                  className="bg-red-500 text-white font-bold py-2 px-2 rounded hover:bg-red-600"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo principal da tela */}
        <div className="flex flex-wrap flex-col gap-4 w-[85%] ml-10 mt-10">
          {/* Título da questão */}
          <div className="bg-white w-4/5">
            <Label htmlFor="questionTitle">Título da questão</Label>
            <Input
              id="questionTitle"
              type="text"
              name="questionTitle"
              placeholder="Digite o título da questão"
              value={formData.questionTitle}
              onChange={handleChange}
              disabled={isFormDisabled}
            />
          </div>

          {/* Botões para escolher o tipo da questão */}
          <Label htmlFor="questionType">Tipo da questão</Label>
          <TypeQuestion
            selectedQuestionType={selectedQuestionType}
            setSelectedQuestionType={setSelectedQuestionType}
            disabled={isFormDisabled}
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
              disabled={isFormDisabled}
            />

            {/* Espaçamento de 5 entre o tipo de resposta e o conteúdo renderizado */}
            <div className="mt-5">
              {/* Renderiza o tipo de resposta escolhido */}
              {renderAnswersType()}
            </div>
          </div>

          {/* Botões para cancelar ou confirmar */}
          <div className="text-center flex gap-4 justify-between mr-64 mt-10">
            <div>
              {selectedQuestionId && (
                <Button
                  className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40 hover:bg-[#72c177]"
                  onClick={handleAddNewQuestion}
                >
                  {isCreatingNew ? "Salvar" : "Adicionar Questão"}
                </Button>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded w-40 hover:bg-red-400"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              {!selectedQuestionId && (
                <Button
                  className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40 hover:bg-[#72c177]"
                  onClick={handleAddNewQuestion}
                >
                  {isCreatingNew ? "Salvar" : "Adicionar Questão"}
                </Button>
              )}
              {selectedQuestionId && (
                <Button
                  onClick={handleEditClick}
                  className="bg-[#53A85C] text-white font-bold py-2 px-4 rounded w-40 hover:bg-[#72c177]"
                >
                  {isEditing ? "Salvar" : "Editar"}
                </Button>
              )}
            </div>
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
