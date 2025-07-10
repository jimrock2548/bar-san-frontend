"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { CalendarRange, Table2, Users, CalendarDays } from "lucide-react"
import { DayPicker } from "react-day-picker"
import ReservationDetailModal from "@/app/components/reservationDetail"
import { useAdmin } from "@/app/admin/layout"
import Status from "@/app/components/status"
import axios from "axios"

export default function DashboardPage() {
  const {selectedCafe } = useAdmin()
  const [date, setDate] = useState<Date>()
  const [zoneFilter, setZoneFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [viewingReservation, setViewingReservation] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<{ [key: string]: string }>({})
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])

useEffect(() => {
  if (!selectedCafe) return

  const fetchDashboardData = async () => {
    try {
      // เปลี่ยนมาใช้ cookie เลย comment ไว้
      // const token = localStorage.getItem("token") // หรือดึงจาก context ถ้าเก็บไว้ที่อื่น

      const res = await axios.get(
        `http://myhostserver.sytes.net:5050/admin/dashboard/${selectedCafe}`,
        {
          // เปลี่ยนมาใช้ cookie เลย comment ไว้
          // headers: {
          //   Authorization: Bearer ${token}
          // }
          // เพื่อให้แน่ใจว่า axios จะส่ง cookie ไปด้วยเสมอ (โดยเฉพาะในตอนพัฒนาที่ client กับ server อาจจะอยู่คนละ port กัน) 
          withCredentials: true
        }
      )

      setDashboardData(res.data.stats)
      setReservations(res.data.recentReservations)
    } catch (err: any) {
      console.error("Error fetching dashboard data", err)
      if (err.response) {
        console.error("Response data:", err.response.data)
      }
    }
  }

  fetchDashboardData()
}, [selectedCafe])

  const filteredReservations = reservations.filter((r) => {
    const matchesDate = !date || r.date === format(date, "yyyy-MM-dd")
    const matchesStatus = statusFilter === "All" || r.status === statusFilter
    return matchesDate && matchesStatus
  })

  const handleOpenDetailModal = (id: string) => {
    setViewingReservation(id)
  }

  const handleSelectTable = (bookingId: string, tableId: string) => {
    setSelectedTable((prev) => ({ ...prev, [bookingId]: tableId }))
  }

  if (!dashboardData) return <div className="p-8">Loading...</div>

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-base text-gray-500">
            Overview - {format(new Date(), "d MMMM yyyy", { locale: th })}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-sm">Today Reservations</h2>
              <CalendarRange className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.todayReservations}</div>
            <p className="text-xs text-green-500">จำนวนการจองวันนี้</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-sm">Pending Reservations</h2>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.pendingReservations}</div>
            <p className="text-xs text-yellow-500">รอการตรวจสอบ</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-sm">Available Tables</h2>
              <Table2 className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.availableTables}</div>
            <p className="text-xs text-gray-500">จาก {dashboardData.totalTables} โต๊ะ</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-xl font-bold">Filter</h1>
      </div>

      <div className="flex gap-3 mt-6">
        <div className="w-xs">
          <button
            popoverTarget="rdp-popover"
            className="input input-border text-gray-400"
            style={{ anchorName: "--rdp" } as React.CSSProperties}
          >
            <CalendarDays className="h-4 w-4" />
            {date ? date.toLocaleDateString() : "Pick a date"}
          </button>
          <div
            popover="auto"
            id="rdp-popover"
            className="dropdown"
            style={{ positionAnchor: "--rdp" } as React.CSSProperties}
          >
            <DayPicker className="react-day-picker text-lg" mode="single" selected={date} onSelect={setDate} />
          </div>
        </div>

        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="seated">Seated</option>
        </select>
      </div>

      <div className="card bg-base-100 shadow mt-6">
        <div className="card-body">
          <h2 className="card-title">Reservation</h2>
          <div className="grid grid-cols-6 text-sm text-gray-400 mb-2">
            <div>Name</div>
            <div>Date</div>
            <div>Time</div>
            <div>Guests</div>
            <div>Status</div>
            <div></div>
          </div>
          {filteredReservations.map((booking) => (
            <div key={booking.id} className="grid grid-cols-6 items-center text-sm py-2 border-b border-b-gray-300">
              <div>{booking.guest_name}</div>
              <div>{booking.date}</div>
              <div>{booking.time}</div>
              <div>{booking.guests}</div>
              <div>
                <Status statusString={booking.status} />
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline text-blue-600"
                  onClick={() => handleOpenDetailModal(booking.id)}
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewingReservation && (
        <ReservationDetailModal
          reservation={filteredReservations.find((r) => r.id === viewingReservation)}
          onClose={() => setViewingReservation(null)}
        />
      )}
    </div>
  )
}
