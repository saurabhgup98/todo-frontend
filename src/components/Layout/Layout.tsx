import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-red-100 dark:bg-gray-900 lg:pt-0 pt-16 overflow-x-hidden">
      {children}
    </div>
  )
}

export default Layout
