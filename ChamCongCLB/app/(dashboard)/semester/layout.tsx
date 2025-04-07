import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Quản lý học kỳ',
    description: 'Quản lý học kỳ',
    icons: ['./logo.png'],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>{children}</>);
}