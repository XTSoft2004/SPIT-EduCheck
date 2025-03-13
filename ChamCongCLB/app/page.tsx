'use client'
import { logout } from '@/actions/auth.actions'
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton'
export default function HomePage() {
  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Welcome to HomePage
      </h1>

      {/* Container chứa cả ThemeToggleButton và nút Đăng xuất */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <ThemeToggleButton />
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
