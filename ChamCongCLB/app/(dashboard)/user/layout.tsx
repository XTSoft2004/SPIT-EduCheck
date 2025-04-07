import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Quản lý tài khoản',
    description: 'Quản lý tài khoản',
    icons: ['./logo.png'],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>{children}</>);
}