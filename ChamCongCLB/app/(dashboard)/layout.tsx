'use client'
import * as React from 'react'
import { AppProvider, Router } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { extendTheme } from '@mui/material/styles'
import { NAVIGATION } from '@/layout/Sidebar'
import { BRANDING } from '@/layout/Header'
import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
})

function useDemoRouter(initialPath: string): Router {
  const [pathname, setPathname] = React.useState(initialPath)
  return React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => setPathname(String(path)),
    }),
    [pathname],
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useDemoRouter('/part1')
  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={BRANDING}
    >
      <DashboardLayout>
        <main style={{ padding: 15 }}>{children}</main>
      </DashboardLayout>
    </AppProvider>
  )
}
