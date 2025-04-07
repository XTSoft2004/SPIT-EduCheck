'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { ConfigProvider, theme as antTheme } from 'antd'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null
      setTheme(savedTheme || 'light')
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [theme, mounted])

  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
          token: {
            colorBgBase: theme === 'dark' ? '#1E2636' : '#ffffff',
            colorText: theme === 'dark' ? '#EEEEEE' : '#333333',
            colorPrimary: theme === 'dark' ? '#00ADB5' : '#1677FF',
            colorBgContainer: theme === 'dark' ? '#1E2636' : '#ffffff',
            colorTextLabel: theme === 'dark' ? '#FFFFFF' : '#000000',
            colorBorder: theme === 'dark' ? '#555555' : '#DDDDDD',
            colorTextSecondary: theme === 'dark' ? '#BBBBBB' : '#666666',
            colorFillContent: theme === 'dark' ? '#393E46' : '#F5F5F5',
            colorBgElevated: theme === "dark" ? "#2A2F45" : "#FFFFFF", // Màu nền cho popup
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
