import type { Metadata } from 'next'
import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import '@/styles/globals.css'

import '@mantine/core/styles.css';       // ✅ MUST HAVE
import '@mantine/charts/styles.css';     // ✅ MUST HAVE if using charts

import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'SPIT TEAM WEBSITE',
  description: 'Trang chủ quản lý thông kê sinh viên',
  icons: ['./logo.png'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className="dark:bg-gray-900">
        <AuthProvider>
          <ThemeProvider>
            <MantineProvider theme={{}}>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </MantineProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
