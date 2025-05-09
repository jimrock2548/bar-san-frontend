"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Clock, Calendar, AlertCircle, X, ChevronRight, Settings } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { th } from "date-fns/locale"
import { cn } from "@/app/lib/utils"

interface Notification {
  id: string
  type: "reservation" | "cancellation" | "modification" | "reminder" | "alert" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "high" | "medium" | "low"
  data?: {
    reservationId?: string
    customerId?: string
    customerName?: string
    tableId?: string
    tableNumber?: number
    date?: string
    time?: string
    guests?: number
  }
}

export function NotificationPanel({ cafeId }: { cafeId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "n1",
        type: "reservation",
        title: "การจองใหม่",
        message: "คุณสมชาย ใจดี ได้ทำการจองโต๊ะ 5 สำหรับ 4 ท่าน",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
        priority: "high",
        data: {
          reservationId: "RSV1234",
          customerId: "C001",
          customerName: "สมชาย ใจดี",
          tableId: "T005",
          tableNumber: 5,
          date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          time: "18:00",
          guests: 4,
        },
      },
      {
        id: "n2",
        type: "cancellation",
        title: "การยกเลิกการจอง",
        message: "คุณวิภา มีสุข ได้ยกเลิกการจองโต๊ะ 3 สำหรับวันนี้",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
        priority: "medium",
        data: {
          reservationId: "RSV1235",
          customerId: "C002",
          customerName: "วิภา มีสุข",
          tableId: "T003",
          tableNumber: 3,
          date: new Date().toISOString(),
          time: "19:30",
          guests: 2,
        },
      },
      {
        id: "n3",
        type: "reminder",
        title: "เตือนการจองที่กำลังจะมาถึง",
        message: "มีการจอง 3 รายการที่กำลังจะมาถึงในอีก 1 ชั่วโมง",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        read: true,
        priority: "medium",
        data: {
          date: new Date().toISOString(),
        },
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [cafeId])

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !n.read
    if (activeTab === "reservations") return ["reservation", "modification"].includes(n.type)
    if (activeTab === "alerts") return ["alert", "system"].includes(n.type)
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reservation":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "cancellation":
        return <X className="h-4 w-4 text-red-500" />
      case "modification":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "reminder":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "alert":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "system":
        return <Settings className="h-4 w-4 text-gray-400" />
      default:
        return <Bell className="h-4 w-4 text-gray-400" />
    }
  }

  const formatNotificationTime = (timestamp: string) =>
    formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: th })

  return (
    <div className="relative">
      <button className="btn btn-ghost btn-circle" onClick={() => setIsOpen(!isOpen)}>
        <div className="indicator">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="indicator-item badge badge-error text-white text-xs">{unreadCount}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-md shadow-lg z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium text-lg">การแจ้งเตือน</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead} className="btn btn-xs btn-ghost">
                  <Check className="h-3 w-3 mr-1" />
                  อ่านทั้งหมด
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="btn btn-xs btn-circle btn-ghost">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div role="tablist" className="tabs tabs-bordered w-full px-2">
            {["all", "unread", "reservations", "alerts"].map((tab) => (
              <a
                key={tab}
                role="tab"
                className={cn("tab text-xs", activeTab === tab && "tab-active")}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "all"
                  ? "ทั้งหมด"
                  : tab === "unread"
                  ? `ยังไม่อ่าน ${unreadCount > 0 ? `(${unreadCount})` : ""}`
                  : tab === "reservations"
                  ? "การจอง"
                  : "แจ้งเตือน"}
              </a>
            ))}
          </div>

          {/* Notifications */}
          <div className="h-96 overflow-y-auto divide-y">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-base-100",
                    !n.read && "bg-blue-50"
                  )}
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  <div className="flex gap-3">
                    <div>{getNotificationIcon(n.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className={cn("text-sm", !n.read && "font-bold")}>{n.title}</p>
                        <span className="text-xs text-gray-400 ml-2">{formatNotificationTime(n.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.message}</p>

                      {n.data?.reservationId && (
                        <div className="mt-1 flex items-center text-xs text-blue-600 hover:text-blue-800">
                          <span>ดูรายละเอียดการจอง</span>
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </div>
                      )}

                      {n.priority === "high" && !n.read && (
                        <div className="badge badge-error badge-outline mt-2">สำคัญ</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">ไม่มีการแจ้งเตือน</div>
            )}
          </div>

          {/* Settings */}
          <div className="p-4 border-t bg-gray-50 text-xs">
            <div className="flex justify-between items-center">
              <span>การตั้งค่าการแจ้งเตือน</span>
              <button className="btn btn-xs btn-ghost">
                <Settings className="h-4 w-4 mr-1" />
                ตั้งค่า
              </button>
            </div>
            <div className="form-control mt-3 space-y-2">
              <label className="label cursor-pointer justify-between">
                <span>แจ้งเตือนเมื่อมีการจองใหม่</span>
                <input type="checkbox" className="toggle toggle-sm" defaultChecked />
              </label>
              <label className="label cursor-pointer justify-between">
                <span>แจ้งเตือนเมื่อมีการยกเลิก</span>
                <input type="checkbox" className="toggle toggle-sm" defaultChecked />
              </label>
              <label className="label cursor-pointer justify-between">
                <span>แจ้งเตือนเมื่อมีการแก้ไข</span>
                <input type="checkbox" className="toggle toggle-sm" defaultChecked />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
