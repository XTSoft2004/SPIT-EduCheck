'use client';
import { logout } from '@/actions/auth.actions';

export default function HomePage() {
  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <h1 className="text-3xl font-bold">Welcome to HomePage</h1>
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg"
        onClick={handleLogout}
      >
        Đăng xuất
      </button>
    </div>
  );
}
