import type { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Thay đổi mật khẩu',
    description: 'Thay đổi mật khẩu của sinh viên',
    icons: ['./logo.png'],
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>{children}</>);
}