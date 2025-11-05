"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User } from "lucide-react"
import { useState } from "react"
import Sidebar from "./sidebar"

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <header className="bg-medium-blue text-white p-4 flex items-center justify-between">
      <button
        onClick={toggleSidebar}
        className="text-primary-green hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={32} />
      </button>

      <Link href="/" className="flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Passion <span className="bg-primary-green text-medium-blue px-2 py-1 rounded">Lecture</span>
        </h1>
      </Link>

      <Link href="/profile" className="text-primary-green hover:text-white transition-colors">
        <User size={32} />
      </Link>

      {sidebarOpen && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
    </header>
  )
}
