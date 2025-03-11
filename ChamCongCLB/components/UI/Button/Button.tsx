import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick: () => void;
    className?: string;
}

export function Button({ children, onClick, className = "" }: ButtonProps) {
    return (
        <button onClick={onClick} className={`px-4 py-2 bg-blue-500 text-white rounded ${className}`}>
            {children}
        </button>
    );
}