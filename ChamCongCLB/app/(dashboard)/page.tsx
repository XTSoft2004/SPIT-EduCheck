'use client'
import * as React from 'react'
import { AppProvider, Router } from '@toolpad/core/AppProvider'

const Part1 = () => (
  <div>
    <h1>Part 1</h1>
    <p>This is the first part of the content.</p>
  </div>
)
const Part2 = () => (
  <div>
    <h1>Part 2</h1>
    <p>This is the second part of the content.</p>
  </div>
)

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

export default function Page() {
  const router = useDemoRouter('/part1')
  return (
    <>
      {router.pathname === '/part1' && <Part1 />}
      {router.pathname === '/part2' && <Part2 />}
    </>
  )
}
