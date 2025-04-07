import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  className?: string
  disabled?: boolean
}

export function Button({
  children,
  onClick,
  className = '',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 bg-blue-500 text-white rounded-[16px] text-sm font-bold ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
