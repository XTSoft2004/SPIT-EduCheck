import GridShape from '@/components/common/GridShape'
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo'
import BackgroundLogin from '@/components/login/BackgroundLogin'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-[var(--bg-dark-mode)] sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-[var(--bg-dark-mode)] sm:p-0">
        <div className="lg:w-1/2 w-full h-full bg-blue-950 dark:bg-white/5 lg:grid items-center hidden">
          <div className="relative items-center justify-center flex z-1">
            <BackgroundLogin />
          </div>
        </div>
        {children}
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  )
}