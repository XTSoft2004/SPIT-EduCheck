import GridShape from '@/components/common/GridShape'
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
        {children}
        <div className="lg:w-1/2 w-full h-full bg-blue-950 dark:bg-white/5 lg:grid items-center hidden">
          <div className="relative items-center justify-center  flex z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link href="/" className="block mb-4 w-1/2">
                <div className="relative w-full">
                  <Image
                    src="/logo/bannerCLB.png"
                    alt="Logo"
                    width={1400}
                    height={1400}
                    className="w-full h-auto"
                  />
                </div>
              </Link>
              <p className="text-center text-xl font-bold text-gray-400 dark:text-white/60">
                SPIT here to fix
              </p>
            </div>
          </div>
        </div>
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  )
}
