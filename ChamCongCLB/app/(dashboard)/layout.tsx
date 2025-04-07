import Dashboard from '@/layout/Dashboard';
import { ThemeProvider } from '@/context/ThemeContext'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Trang chủ ',
    description: 'Trang chủ quản lý thông kê sinh viên',
    icons: ['./logo.png'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Dashboard>{children}</Dashboard>
    )
}
