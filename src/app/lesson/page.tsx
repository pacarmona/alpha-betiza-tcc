"use client";

import BottomBar from "@/components/bottomBar";
import TopBar from "@/components/topBar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Answer as PrismaAnswer, Question } from "@prisma/client";
import { Sliders, Volume2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Answer = PrismaAnswer & {
  selected?: boolean;
};

export default function Lesson() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [isDescriptionAudioPlayed, setIsDescriptionAudioPlayed] =
    useState(false);
  const [highlightedAnswer, setHighlightedAnswer] = useState<string | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [isReading, setIsReading] = useState<{ [key: string]: boolean }>({});
  const [scanInterval, setScanInterval] = useState<number>(2000); // Default to 2 seconds

  useEffect(() => {
    async function fetchQuestions() {
      if (!lessonId) return;

      try {
        const response = await fetch(`/api/question?lessonId=${lessonId}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar as questões");
        }
        const data: Question[] = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [lessonId]);

  const handleQuestionSelection = (question: Question) => {
    setSelectedQuestion(question);
  };

  useEffect(() => {
    if (questions.length === 0) return;

    if (!selectedQuestion) {
      setSelectedQuestion(questions[0]);
      return;
    }

    async function fetchAnswers() {
      try {
        if (!selectedQuestion) return;
        const response = await fetch(
          `/api/answer?questionId=${selectedQuestion.id}`
        );
        if (!response.ok) {
          throw new Error(
            `Erro ao buscar as respostas da questão ${selectedQuestion.id}`
          );
        }
        const data: Answer[] = await response.json();
        setAnswers(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAnswers();
  }, [questions, selectedQuestion]);

  useEffect(() => {
    if (!isScanningActive) {
      setHighlightedAnswer(null);
      return;
    }

    const intervalId = setInterval(() => {
      if (answers.length === 0) return;

      const currentIndex = answers.findIndex(
        (answer) => answer.id === highlightedAnswer
      );
      const nextIndex = (currentIndex + 1) % answers.length;

      setHighlightedAnswer(answers[nextIndex].id);
      readText(answers[nextIndex].text, answers[nextIndex].id);
    }, scanInterval);

    const handleMouseClick = () => {
      if (isScanningActive && highlightedAnswer) {
        setSelectedAnswer(highlightedAnswer);
        const selectedAnswerObj = answers.find(
          (answer) => answer.id === highlightedAnswer
        );

        if (selectedAnswerObj) {
          if (selectedAnswerObj.is_correct) {
            successText("Resposta correta!").then(() => {
              const currentIndex = questions.findIndex(
                (q) => q.id === selectedQuestion?.id
              );
              if (currentIndex < questions.length - 1) {
                setSelectedQuestion(questions[currentIndex + 1]);
                setSelectedAnswer(null);
                setHighlightedAnswer(null);
              } else {
                Swal.fire({
                  icon: "success",
                  title: "Parabéns!",
                  text: "Você completou todas as questões!",
                  confirmButtonText: "Continuar",
                }).then(() => {
                  router.push("/");
                });
              }
            });
          } else {
            errorText("Resposta incorreta. Tente novamente!").then(() => {
              setSelectedAnswer(null);
              setHighlightedAnswer(null);
            });
          }
        }
        clearInterval(intervalId);
      }
    };

    document.addEventListener("click", handleMouseClick);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("click", handleMouseClick);
    };
  }, [
    answers,
    highlightedAnswer,
    isScanningActive,
    questions,
    selectedQuestion,
    router,
    scanInterval,
  ]);

  const handleAnswerSelection = (selectedAnswerId: string) => {
    if (!isScanningActive) {
      setSelectedAnswer(selectedAnswerId);
    }
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) => ({
        ...answer,
        selected: answer.id === selectedAnswerId,
      }))
    );

    const selectedAnswerObj = answers.find(
      (answer) => answer.id === selectedAnswerId
    );
    if (selectedAnswerObj) {
      if (selectedAnswerObj.is_correct) {
        successText("Resposta correta!").then(() => {
          const currentIndex = questions.findIndex(
            (q) => q.id === selectedQuestion?.id
          );
          if (currentIndex < questions.length - 1) {
            setSelectedQuestion(questions[currentIndex + 1]);
            setSelectedAnswer(null);
            setHighlightedAnswer(null);
          } else {
            Swal.fire({
              icon: "success",
              title: "Parabéns!",
              text: "Você completou todas as questões!",
              confirmButtonText: "Continuar",
            }).then(() => {
              router.push("/");
            });
          }
        });
      } else {
        errorText("Resposta incorreta. Tente novamente!").then(() => {
          setSelectedAnswer(null);
          setHighlightedAnswer(null);
        });
      }
    }
  };

  const readText = (text: string, answerId: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const newReadingState = { ...isReading };
      Object.keys(newReadingState).forEach((key) => {
        newReadingState[key] = false;
      });
      newReadingState[answerId] = true;
      setIsReading(newReadingState);

      if (selectedQuestion && answerId === selectedQuestion.id) {
        setIsDescriptionAudioPlayed(true);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";

      utterance.onend = () => {
        setIsReading((prev) => ({
          ...prev,
          [answerId]: false,
        }));
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleScanIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setScanInterval(Number(event.target.value));
  };

  return (
    <div className="w-full flex flex-col h-full">
      <TopBar />
      <div className="w-full h-full flex">
        <div className="flex flex-col gap-4 w-[85%] ml-10 mt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              {questions.map((question, index) => (
                <Button
                  key={question.id}
                  className={`font-bold py-2 px-4 rounded ${
                    selectedQuestion?.id === question.id
                      ? "bg-blue-700 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-400"
                  }`}
                  onClick={() => handleQuestionSelection(question)}
                >
                  Questão {index + 1}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-gray-500" />
                <Label htmlFor="scan-interval">Tempo de Varredura:</Label>
                <select
                  id="scan-interval"
                  value={scanInterval}
                  onChange={handleScanIntervalChange}
                  className="border rounded p-1 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2000}>Tempo de Varredura: 2s</option>
                  <option value={4000}>Tempo de Varredura: 4s</option>
                  <option value={6000}>Tempo de Varredura: 6s</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="scanning-mode"
                  checked={isScanningActive}
                  onCheckedChange={setIsScanningActive}
                  disabled={!isDescriptionAudioPlayed}
                />
                <Label htmlFor="scanning-mode">Varredura de Tela</Label>
              </div>
            </div>
          </div>

          {loading ? (
            <p>Carregando questões...</p>
          ) : questions.length > 0 ? (
            <div>
              {selectedQuestion && (
                <div className="border p-4 rounded shadow-md bg-white w-full">
                  <p className="text-sm text-gray-500 mt-2">
                    Tipo: {selectedQuestion.type} | Resposta:{" "}
                    {selectedQuestion.answer_type}
                  </p>
                  <h2 className="text-lg font-bold">
                    {selectedQuestion.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">
                      {selectedQuestion.description}
                    </p>
                    {selectedQuestion.image_url && (
                      <img
                        src={selectedQuestion.image_url}
                        alt="Imagem da questão"
                        className="max-w-full h-auto rounded mt-2"
                      />
                    )}
                    <button
                      onClick={() =>
                        readText(
                          selectedQuestion.description,
                          selectedQuestion.id
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Volume2
                        className={`w-5 h-5 ${
                          isReading[selectedQuestion.id]
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-md font-semibold">Respostas:</h3>
                    {answers.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="flex flex-col items-start mt-4"
                      >
                        <Label className="mb-2" htmlFor={`text0${index + 1}`}>
                          Resposta {index + 1}
                        </Label>
                        <div
                          id={`text0${index + 1}`}
                          className={`border p-2 rounded w-full text-gray-700 cursor-pointer 
                            ${
                              isScanningActive &&
                              highlightedAnswer === answer.id
                                ? "border-blue-500 border-2"
                                : ""
                            } ${
                            selectedAnswer === answer.id
                              ? answer.is_correct
                                ? "bg-green-100"
                                : "bg-red-100"
                              : ""
                          }`}
                          onClick={() => handleAnswerSelection(answer.id)}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm">{answer.text}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                readText(answer.text, answer.id);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Volume2
                                className={`w-5 h-5 ${
                                  isReading[answer.id]
                                    ? "text-blue-500"
                                    : "text-gray-500"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Nenhuma questão encontrada para esta atividade.</p>
          )}

          <div className="text-center flex gap-4 justify-end mr-64 mt-20">
            <Button
              className="bg-[#B6B8BF] text-white font-bold py-2 px-4 rounded w-40 hover:bg-gray-300"
              onClick={() => router.push("/")}
            >
              Voltar
            </Button>
            <Button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-40 hover:bg-blue-400"
              onClick={() => router.push(`/new-lesson?lessonId=${lessonId}`)}
            >
              Editar
            </Button>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}

function errorText(error: string) {
  return Swal.fire({
    icon: "error",
    title: "Ocorreu um erro",
    text: error,
    confirmButtonText: "Tentar novamente",
  });
}

function successText(text: string) {
  return Swal.fire({
    icon: "success",
    title: "Muito bem!",
    text: text,
    confirmButtonText: "Continuar",
  });
}
