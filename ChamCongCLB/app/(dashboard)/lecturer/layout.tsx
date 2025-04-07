import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Quản lý giáo viên',
    description: 'Quản lý giáo viên',
    icons: ['./logo.png'],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>{children}</>);
}