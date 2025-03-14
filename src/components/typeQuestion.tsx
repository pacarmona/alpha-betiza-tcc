const TypeButton = ({
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

export default function TypeQuestion({
  selectedQuestionType,
  setSelectedQuestionType,
}: {
  selectedQuestionType: string;
  setSelectedQuestionType: (type: string) => void;
}) {
  return (
    <div className="text-center flex gap-4">
      <TypeButton
        label="Textual"
        selected={selectedQuestionType === "Textual"}
        onClick={() => setSelectedQuestionType("Textual")}
      />
      <TypeButton
        label="Visual"
        selected={selectedQuestionType === "Visual"}
        onClick={() => setSelectedQuestionType("Visual")}
      />
      <TypeButton
        label="Auditivo"
        selected={selectedQuestionType === "Auditivo"}
        onClick={() => setSelectedQuestionType("Auditivo")}
      />
    </div>
  );
}
