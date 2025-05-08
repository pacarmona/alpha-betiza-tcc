const TypeButton = ({
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

export default function TypeQuestion({
  selectedQuestionType,
  setSelectedQuestionType,
  disabled,
}: {
  selectedQuestionType: string;
  setSelectedQuestionType: (type: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="text-center flex gap-4">
      <TypeButton
        label="Textual"
        selected={selectedQuestionType === "Textual"}
        onClick={() => setSelectedQuestionType("Textual")}
        disabled={disabled}
      />
      <TypeButton
        label="Visual"
        selected={selectedQuestionType === "Visual"}
        onClick={() => setSelectedQuestionType("Visual")}
        disabled={disabled}
      />
      <TypeButton
        label="Auditivo"
        selected={selectedQuestionType === "Auditivo"}
        onClick={() => setSelectedQuestionType("Auditivo")}
        disabled={disabled}
      />
    </div>
  );
}
