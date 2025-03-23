import Dashboard from '@/layout/Dashboard';
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Dashboard>{children}</Dashboard>
    )
}
