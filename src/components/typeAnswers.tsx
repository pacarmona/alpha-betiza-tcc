const AnswerButton = ({
  label,
  selected,
  onClick,
  disabled,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    className={`font-bold py-2 px-4 rounded-full w-40 border border-black ${
      selected
        ? "bg-blue-500 text-white"
        : "bg-white text-black hover:bg-gray-100"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

export default function TypeAnswers({
  selectedAnswersType,
  setSelectedResponseType,
  disabled,
}: {
  selectedAnswersType: string;
  setSelectedResponseType: (type: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="text-center flex gap-4">
      <AnswerButton
        label="Textual"
        selected={selectedAnswersType === "Textual"}
        onClick={() => setSelectedResponseType("Textual")}
        disabled={disabled}
      />
      <AnswerButton
        label="Visual"
        selected={selectedAnswersType === "Visual"}
        onClick={() => setSelectedResponseType("Visual")}
        disabled={disabled}
      />
    </div>
  );
}
