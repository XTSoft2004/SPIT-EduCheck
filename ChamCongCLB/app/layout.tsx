// app/layout.tsx
import type { Metadata } from 'next'
import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import '@/styles/globals.css'

import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'

import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { AuthProvider } from '@/context/AuthContext'

import { siteMetadata } from './lib/metadata'
export const metadata: Metadata = siteMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <head>
        <ColorSchemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SPIT EduCheck",
              "url": "https://chamcong.spit-husc.io.vn/",
              "logo": "https://chamcong.spit-husc.io.vn/logo/logo-500x500.png",
              "description":
                "SPIT EduCheck - Hệ thống quản lý chấm công dành cho sinh viên hỗ trợ giảng dạy tại Khoa CNTT, Đại học Khoa học Huế (HUSC).",
              "sameAs": [
                "https://www.facebook.com/clbhtlt.ithusc",
                "https://discord.gg/nEH7uvsBA4",
                "https://it.husc.edu.vn/"
              ]
            }),
          }}
        />
      </head>
      <body className="dark:bg-gray-900">
        <AuthProvider>
          <ThemeProvider>
            <MantineProvider theme={{}}>
              <SidebarProvider>{children}</SidebarProvider>
            </MantineProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
