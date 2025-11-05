"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Edit, BookOpen, Layers } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Create",
      href: "/create",
      icon: <Edit className="w-6 h-6 mr-2" />,
    },
    {
      name: "Categories",
      href: "/categories",
      icon: <Layers className="w-6 h-6 mr-2" />,
    },
    {
      name: "My Books",
      href: "/my-books",
      icon: <BookOpen className="w-6 h-6 mr-2" />,
    },
  ]

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`} onClick={onClose}>
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-medium-blue p-4 z-50" onClick={(e) => e.stopPropagation()}>
        <nav className="flex flex-col space-y-4 mt-16">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center p-4 rounded-md text-white ${
                pathname === item.href ? "bg-dark-blue" : "hover:bg-dark-blue transition-colors"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
