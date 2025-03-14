const AnswerButton = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    className={`font-bold py-2 px-4 rounded-full w-40 border border-black ${
      selected
        ? "bg-blue-500 text-white"
        : "bg-white text-black hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default function TypeAnswers({
  selectedAnswersType,
  setSelectedResponseType,
}: {
  selectedAnswersType: string;
  setSelectedResponseType: (type: string) => void;
}) {
  return (
    <div className="text-center flex gap-4">
      <AnswerButton
        label="Textual"
        selected={selectedAnswersType === "Textual"}
        onClick={() => setSelectedResponseType("Textual")}
      />
      <AnswerButton
        label="Visual"
        selected={selectedAnswersType === "Visual"}
        onClick={() => setSelectedResponseType("Visual")}
      />
      <AnswerButton
        label="Auditivo"
        selected={selectedAnswersType === "Auditivo"}
        onClick={() => setSelectedResponseType("Auditivo")}
      />
    </div>
  );
}
