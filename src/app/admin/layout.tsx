"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarRange,
  ChevronDown,
  Martini,
  LayoutDashboard,
  LogOut,
  Settings,
  Table2,
  Users,
  UserCog,
  UserRoundSearch,
  Logs,
} from "lucide-react"

import { cn } from "@/app/lib/utils"
import { NotificationPanel } from "@/app/components/nortification-panel"

interface AdminLayoutProps {
  children: ReactNode
  user: any
  selectedCafe: string | null
  onCafeChange?: (cafeId: string) => void
}

export default function AdminLayout({ children, user, selectedCafe, onCafeChange }: AdminLayoutProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    window.location.href = "/admin/login"
  }
  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Reseravtion ", href: "/admin/reservations", icon: CalendarRange },
    { name: "Tables", href: "/admin/tables", icon: Table2 },
    { name: "Member", href: "/admin/tables", icon: UserRoundSearch },
    { name: "Role", href: "/admin/tables", icon: UserCog },
    { name: "Log", href: "/admin/tables", icon: Logs },
  ]

  /*if (user?.role === "superadmin") {
    navigation.push({ name: "จัดการผู้ใช้", href: "/admin/users", icon: Users })
  }*/

  navigation.push({ name: "ตั้งค่า", href: "/admin/settings", icon: Settings })

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <Martini className="h-6 w-6" />
            <span className="font-bold text-xl">ADMIN</span>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="mb-4">
            <p className="text-sm text-gray-400">เข้าสู่ระบบในฐานะ</p>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">
              {user?.role === "superadmin" ? "Super Admin" : user?.role === "admin" ? "Admin" : "Staff"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost w-full justify-start text-gray-300 hover:text-white gap-3"
          >
            <LogOut className="h-5 w-5" />
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">
              {user?.role === "admin"
                ? user?.cafeName
                : user?.role === "superadmin" && selectedCafe
                  ? selectedCafe === "barsan"
                    ? "BarSan."
                    : "NOIR"
                  : ""}
            </h1>

            <div className="flex items-center gap-4">
              {user?.role === "superadmin" && user?.cafes?.length > 0 && (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-outline gap-2">
                    {selectedCafe === "barsan" ? "BarSan." : "NOIR"}
                    <ChevronDown className="h-4 w-4" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li className="menu-title">เลือกร้าน</li>
                    {user.cafes.map((cafe) => (
                      <li key={cafe.id}>
                        <a onClick={() => onCafeChange && onCafeChange(cafe.id)}>{cafe.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notification */}
              <NotificationPanel cafeId={selectedCafe || ""} />

              {/* User Dropdown */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-medium text-sm">{user?.name?.charAt(0)}</span>
                  </div>
                  {user?.name}
                  <ChevronDown className="h-4 w-4" />
                </label>
                <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                  <li><a>โปรไฟล์</a></li>
                  <li><a>ตั้งค่า</a></li>
                  <li><hr /></li>
                  <li>
                    <a onClick={handleLogout} className="text-red-600">ออกจากระบบ</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
