import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Quản lý lớp học',
    description: 'Quản lý lớp học của kỳ hiện tại',
    icons: ['./logo.png'],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>{children}</>);
}