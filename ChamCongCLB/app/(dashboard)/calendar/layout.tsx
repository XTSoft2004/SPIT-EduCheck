import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Lịch chấm công',
    description: 'Lịch chấm công của sinh viên',
    icons: ['./logo.png'],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>{children}</>);
}