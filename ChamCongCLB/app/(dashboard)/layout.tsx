import Dashboard from '@/layout/Dashboard';
import { ThemeProvider } from '@/context/ThemeContext'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Dashboard>{children}</Dashboard>
    )
}
