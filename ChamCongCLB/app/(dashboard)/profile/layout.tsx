import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Thông tin cá nhân',
    description: 'Thông tin cá nhân',
    icons: ['./logo.png'],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>{children}</>);
}