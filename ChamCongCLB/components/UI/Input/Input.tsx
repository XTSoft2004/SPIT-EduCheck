interface InputProps {
    text: string;
    placeholder?: string;
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ text, placeholder, defaultValue, onChange }: InputProps) {
    return (
        <label className="block">
            <span className="text-gray-700">{text}</span>
            <input
                type="text"
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={onChange}
                className="w-full p-2 border rounded mt-2"
            />
        </label>
    );
}