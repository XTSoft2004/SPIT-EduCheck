import { ReactNode, MouseEventHandler } from 'react';

interface ModalProps {
    children: ReactNode;
    onClose: MouseEventHandler<HTMLButtonElement>;
}

export function Modal({ children, onClose }: ModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                {children}
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-400 text-white rounded">Close</button>
            </div>
        </div>
    );
}