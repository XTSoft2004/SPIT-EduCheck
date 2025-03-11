import { ChangeEvent } from 'react';

interface SelectProps {
    defaultValue: string;
    options: string[];
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({ defaultValue, options, onChange }: SelectProps) {
    return (
        <select defaultValue={defaultValue} onChange={onChange} className="w-full p-2 border rounded mt-2">
            {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
    );
}