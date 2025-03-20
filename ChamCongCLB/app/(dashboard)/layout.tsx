'use client'
import React, { useEffect } from 'react'
import { AppProvider, Router } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { extendTheme } from '@mui/material/styles'
import { NAVIGATION } from '@/layout/Sidebar'
import { BRANDING } from '@/layout/Header'
import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'

import { createTheme } from '@mui/material/styles'
import { deepmerge } from '@mui/utils'

const baseTheme = extendTheme({
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
  useEffect(() => {
    const modifyMenu = () => {
      // Tìm phần tử cha chứa nút menu
      const menuContainer = document.querySelector(
        '[aria-label="Collapse menu"]',
      )

      if (menuContainer) {
        // Kiểm tra xem label và logo đã được thêm chưa
        let logo = document.getElementById('spit-team-logo')
        let label = document.getElementById('spit-team-label')
        if (!label) {
          // Tạo label
          label = document.createElement('span')
          label.innerText = 'SPIT TEAM'
          label.style.fontWeight = 'bold'
          label.style.fontSize = '16px'
          label.style.marginRight = '8px'
          label.id = 'spit-team-label'
          menuContainer.prepend(label)
        }

        if (!logo) {
          // Tạo logo
          logo = document.createElement('img')
          logo.src = '/logo/logo-500x500.png' // Đổi thành đường dẫn logo của bạn
          logo.alt = 'SPIT TEAM Logo'
          logo.style.width = '30px'
          logo.style.height = '30px'
          logo.style.marginRight = '8px'
          logo.id = 'spit-team-logo' // Để tránh thêm lại nhiều lần
          menuContainer.prepend(logo)
        }
      }
    }

    const toggleLogoAndLabel = () => {
      // Tìm nút menu có aria-label="Expand menu"
      const expandedButton = document.querySelector(
        '.MuiBox-root.css-1dxxui [aria-label="Expand menu"]',
      )

      // Tìm logo & label
      const logo = document.getElementById('spit-team-logo')
      const label = document.getElementById('spit-team-label')

      if (logo && label) {
        if (expandedButton) {
          // Nếu menu mở rộng → Ẩn logo & label với hiệu ứng
          logo.style.transition = 'opacity 0.5s ease'
          label.style.transition = 'opacity 0.5s ease'
          logo.style.opacity = '0'
          label.style.opacity = '0'
          setTimeout(() => {
            logo.style.display = 'none'
            label.style.display = 'none'
          }, 0)
          console.log('Đã đóng menu')
        } else {
          console.log('Chưa đóng menu')
          // Nếu menu thu gọn → Hiện logo & label với hiệu ứng
          logo.style.display = 'inline-block'
          label.style.display = 'inline-block'
          setTimeout(() => {
            logo.style.transition = 'opacity 0.5s ease'
            label.style.transition = 'opacity 0.5s ease'
            logo.style.opacity = '1'
            label.style.opacity = '1'
          }, 0)
        }
      }
    }

    modifyMenu() // Chèn logo & label khi component render
    toggleLogoAndLabel() // Kiểm tra lần đầu

    // Dùng MutationObserver để theo dõi DOM thay đổi
    const observer = new MutationObserver(() => {
      modifyMenu()
      toggleLogoAndLabel()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect() // Cleanup khi component bị unmount
  }, [])

  const router = useDemoRouter('/part1')
  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={baseTheme}
      branding={BRANDING}
    >
      <DashboardLayout>
        <main style={{ padding: 15 }}>{children}</main>
      </DashboardLayout>
    </AppProvider>
  )
}
