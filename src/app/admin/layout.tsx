"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, createContext, useContext } from "react"
import {
  CalendarRange,
  ChevronDown,
  Martini,
  LayoutDashboard,
  LogOut,
  Table2,
  UserCog,
  UserRoundSearch,
  LogInIcon as Logs,
} from "lucide-react"

import { cn } from "@/app/lib/utils"
import { NotificationPanel } from "@/app/components/nortification-panel"

interface AdminLayoutProps {
  children: ReactNode
}

interface AdminContextType {
  user: any
  selectedCafe: string
  setSelectedCafe: (cafeId: string) => void
}

const AdminContext = createContext<AdminContextType | null>(null)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminLayout")
  }
  return context
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCafe, setSelectedCafe] = useState<string>("")

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser")
    if (storedUser) {
      try {
        //const userData = JSON.parse(storedUser)
        //setUser(userData)
        //setSelectedCafe(userData.cafes[0]?.id || "")
        const userData = JSON.parse(storedUser)
        setUser(userData.admin)
        setSelectedCafe(userData.admin.roles[0]?.id || "")
      } catch (err) {
        console.error("Error parsing admin user data:", err)
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    router.push("/login")
  }

  const handleCafeChange = (cafeId: string) => {
    setSelectedCafe(cafeId)
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Reseravtion ", href: "/admin/reservation", icon: CalendarRange },
    { name: "Tables", href: "/admin/table", icon: Table2 },
    { name: "Member", href: "/admin/member", icon: UserRoundSearch },
    { name: "Role", href: "/admin/role", icon: UserCog },
    { name: "Log", href: "/admin/log", icon: Logs },
  ]

  return (
    <AdminContext.Provider value={{ user, selectedCafe, setSelectedCafe }}>
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
                {user?.role === "superadmin"
                  ? "Super Admin"
                  : user?.role === "admin"
                    ? "Admin"
                    : user?.role === "staff"
                      ? "Staff"
                      : "Viewer"}
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
                  ? user?.cafes?.find((c: any) => c.id === selectedCafe)?.displayName
                  : user?.role === "superadmin" && selectedCafe
                    ? user?.cafes?.find((c: any) => c.id === selectedCafe)?.displayName
                    : "Admin Panel"}
              </h1>

              <div className="flex items-center gap-4">
                {user?.role === "superadmin" && user?.cafes?.length > 1 && (
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-outline gap-2">
                      {user?.cafes?.find((c: any) => c.id === selectedCafe)?.displayName || "Select Cafe"}
                      <ChevronDown className="h-4 w-4" />
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li className="menu-title">เลือกร้าน</li>
                      {user.cafes.map((cafe: any) => (
                        <li key={cafe.id}>
                          <a onClick={() => handleCafeChange(cafe.id)}>{cafe.displayName}</a>
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
                    <li>
                      <a>โปรไฟล์</a>
                    </li>
                    <li>
                      <a>ตั้งค่า</a>
                    </li>
                    <li>
                      <hr />
                    </li>
                    <li>
                      <a onClick={handleLogout} className="text-red-600">
                        ออกจากระบบ
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </AdminContext.Provider>
  )
}
