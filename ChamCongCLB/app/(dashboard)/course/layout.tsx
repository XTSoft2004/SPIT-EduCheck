import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Quản lý học phần',
    description: 'Quản lý học phần của kỳ hiện tại',
    icons: ['./logo.png'],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>{children}</>);
}