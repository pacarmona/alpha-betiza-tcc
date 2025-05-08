import { Input } from "@/components/ui/input";

interface InputBlockProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function InputBlock({
  id,
  value,
  onChange,
  placeholder,
}: InputBlockProps) {
  return (
    <div className="bg-white w-96 border border-gray-300 p-4 rounded-lg shadow-md">
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}
