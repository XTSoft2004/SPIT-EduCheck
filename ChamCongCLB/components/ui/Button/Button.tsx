import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  className?: string
}

export function Button({ children, onClick, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 bg-blue-500 text-white rounded-[16px] text-sm font-bold ${className}`}
    >
      {children}
    </button>
  )
}
