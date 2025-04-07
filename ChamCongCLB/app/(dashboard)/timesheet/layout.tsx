import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Quản lý chấm công',
    description: 'Quản lý chấm công của kỳ hiện tại',
    icons: ['./logo.png'],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>{children}</>);
}