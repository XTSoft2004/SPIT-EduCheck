import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Quản lý sinh viên',
    description: 'Quản lý sinh viên',
    icons: ['./logo.png'],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>{children}</>);
}