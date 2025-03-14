import { Label } from "@/components/ui/label";

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
}: {
  description: string;
  setDescription: (description: string) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <div>
      <Label htmlFor="description">Descrição</Label>
      <TextareaBlock
        placeholder="Digite a descrição da questão"
        value={description}
        onChange={handleChange}
      />
    </div>
  );
}
