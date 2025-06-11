"use client";
import BottomBar from "@/components/bottomBar";
import TopBar from "@/components/topBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import QuestionText from "./questionText";
import TextResponseType from "./textResponseType";

interface Question {
  id: string;
  title: string;
  description: string;
  type: string;
  answer_type: string;
  Answers: Answer[];
  image_url?: string;
}

interface Answer {
  id: string;
  text: string;
  type: string;
  is_correct: boolean;
  questionId: string;
  image_url?: string;
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
  const [imageURL, setImageURL] = useState<string>("");
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

  const [answerImages, setAnswerImages] = useState<{
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

  const saveAnswerImages = (images: { [key: string]: string }) => {
    setAnswerImages(images);
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
      setImageURL(questionData.image_url || "");

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

      // Atualizar o estado das imagens das respostas
      const answerImages: { [key: string]: string } = {
        text01: questionData.Answers[0]?.image_url || "",
        text02: questionData.Answers[1]?.image_url || "",
        text03: questionData.Answers[2]?.image_url || "",
        text04: questionData.Answers[3]?.image_url || "",
      };
      setAnswerImages(answerImages);

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
        answerImages,
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
          setAnswerImages({
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
        console.log(imageURL);
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
            imageUrl: imageURL,
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
        console.log(imageURL);
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
            imageUrl: imageURL,
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
            image_url: answerImages[key] || null,
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
        setAnswerImages({
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
            setImageURL={setImageURL}
            initialImageURL={imageURL}
          />
        );

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
            saveAnswerImages={saveAnswerImages}
            initialAnswers={responseLesson}
            initialAnswerImages={answerImages}
            initialCorrectAnswer={correctAnswerId}
          />
        );

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
      setAnswerImages({
        text01: "",
        text02: "",
        text03: "",
        text04: "",
      });
      setCorrectAnswerId("text01");
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Barra superior */}
      <TopBar />

      {/* Conteúdo principal */}
      <div className="w-full flex flex-col lg:flex-row flex-grow">
        {/* Barra lateral */}
        <div className="bg-[#D9D9D9] w-full lg:w-[15%] p-4">
          <div className="flex flex-wrap lg:flex-col items-center gap-2">
            {questions.map((question) => (
              <div key={question.id} className="flex items-center gap-2 mb-2">
                <Button
                  className={`bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-full lg:w-40 hover:bg-[#8f9197] ${
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
        <div className="flex flex-col gap-4 w-full lg:w-[85%] p-4 lg:p-10">
          {/* Título da questão */}
          <div className="bg-white w-full lg:w-4/5">
            <div className="flex justify-end mb-4">
              <Button
                className={`w-full lg:w-40 ${
                  questions.length > 0 && lessonId
                    ? "bg-blue-500 hover:bg-blue-400"
                    : "bg-[#B6B8BF] hover:bg-[#8f9197]"
                }`}
                onClick={() => {
                  if (lessonId) {
                    router.push(`/lesson?lessonId=${lessonId}`);
                  } else {
                    errorText(
                      "Erro ao navegar para a atividade. ID da atividade não encontrado."
                    );
                  }
                }}
                disabled={questions.length === 0 || !lessonId}
              >
                {!lessonId
                  ? "Erro: ID da atividade não encontrado"
                  : questions.length > 0
                  ? "Ir para atividade"
                  : "Adicione pelo menos uma questão"}
              </Button>
            </div>
            <Label htmlFor="questionTitle">Título da questão</Label>
            <Input
              id="questionTitle"
              type="text"
              name="questionTitle"
              placeholder="Digite o título da questão"
              value={formData.questionTitle}
              onChange={handleChange}
              disabled={isFormDisabled}
              className="w-full"
            />
          </div>

          {/* Renderiza o tipo de questão escolhido */}
          {renderQuestionType()}

          {/* Respostas */}
          <div className="w-full">
            <div className="text-left font-bold text-2xl lg:text-4xl text-black mb-5">
              <p>Respostas</p>
            </div>

            {/* Espaçamento de 5 entre o tipo de resposta e o conteúdo renderizado */}
            <div className="mt-5">
              {/* Renderiza o tipo de resposta escolhido */}
              {renderAnswersType()}
            </div>
          </div>

          {/* Botões para cancelar ou confirmar */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between w-full lg:w-auto mt-10">
            <div className="w-full lg:w-auto">
              {selectedQuestionId && (
                <Button
                  className="w-full lg:w-40 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-400"
                  onClick={handleAddNewQuestion}
                >
                  {isCreatingNew ? "Salvar" : "Adicionar Questão"}
                </Button>
              )}
            </div>
            <div className="flex flex-col lg:flex-row gap-2 justify-end items-end w-full lg:w-auto">
              <Button
                className="w-full lg:w-40 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-400"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              {!selectedQuestionId && (
                <Button
                  className="w-full lg:w-40 bg-[#53A85C] text-white font-bold py-2 px-4 rounded hover:bg-[#72c177]"
                  onClick={handleAddNewQuestion}
                >
                  {isCreatingNew ? "Salvar" : "Adicionar Questão"}
                </Button>
              )}
              {selectedQuestionId && (
                <Button
                  onClick={handleEditClick}
                  className="w-full lg:w-40 bg-[#53A85C] text-white font-bold py-2 px-4 rounded hover:bg-[#72c177]"
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
