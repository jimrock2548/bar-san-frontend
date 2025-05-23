"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { CalendarRange, ChevronDown, Table2, Users, CalendarDays } from "lucide-react"
import { useState } from "react"
import Status from '@/app/components/status'
import { DayPicker } from "react-day-picker"
import ReservationDetailModal from "@/app/components/reservationDetail"

export default function Page() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [zoneFilter, setZoneFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [viewingReservation, setViewingReservation] = useState<string | null>(null)

  const user = {
    role: "superadmin",
    cafes: [
      { id: "cafe-1", name: "Bar San" },
      { id: "cafe-2", name: "Noir" },
    ],
  }

  const [selectedCafe, setSelectedCafe] = useState<string>(user.cafes[0].id)
  const [selectedTable, setSelectedTable] = useState<{ [key: string]: string }>({})

  const tables = [
    { id: 'z1t1', zone: 'Zone A', number: 1, isBooked: false, isOpen: true },
    { id: 'z1t2', zone: 'Zone A', number: 2, isBooked: true, isOpen: true },
    { id: 'z2t1', zone: 'Zone B', number: 1, isBooked: false, isOpen: false },
    { id: 'z3t1', zone: 'Zone C', number: 1, isBooked: false, isOpen: true },
  ]

  const currentCafeName =
    user.role === "superadmin"
      ? user.cafes.find((c) => c.id === selectedCafe)?.name
      : user.cafes[0]?.name ?? ""

  const dashboardData = selectedCafe === "cafe-1"
    ? { todayReservations: 10, reservationChange: "+15%", pendingReservations: 3, availableTables: 6 }
    : { todayReservations: 5, reservationChange: "-10%", pendingReservations: 1, availableTables: 8 }

  const allReservations = selectedCafe === "cafe-1"
    ? [
      { id: "1", bar: "NOIR",name: "คุณเอ", date: "2025-05-09", time: "18:00", status: "confirmed", zone: "Zone A" },
      { id: "2", bar: "BarSan", name: "คุณบี", date: "2025-05-09", time: "19:30", status: "pending", zone: "Zone B" },
    ]
    : [
      { id: "3", bar: "NOIR",name: "คุณดี", date: "2025-05-09", time: "17:00", status: "confirmed", zone: "Zone C" },
    ]

  const filteredReservations = allReservations.filter((r) => {
    const matchesDate = !date || r.date === format(date, 'yyyy-MM-dd')
    const matchesZone = !zoneFilter || r.zone === zoneFilter
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter
    return matchesDate && matchesZone && matchesStatus
  })

  const handleOpenDetailModal = (id: string) => {
  setViewingReservation(id)
}

  const handleSelectTable = (bookingId: string, tableId: string) => {
    setSelectedTable((prev) => ({ ...prev, [bookingId]: tableId }))
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-base text-gray-500">
            Overview of {currentCafeName} - {format(new Date(), "d MMMM yyyy", { locale: th })}
          </p>
        </div>

        {user.role === "superadmin" && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-outline">
              {currentCafeName} <ChevronDown className="ml-2 h-4 w-4" />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-2 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">เลือกร้าน</li>
              {user.cafes.map((cafe) => (
                <li key={cafe.id}>
                  <a onClick={() => setSelectedCafe(cafe.id)}>{cafe.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-sm">Today Reservations</h2>
              <CalendarRange className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.todayReservations}</div>
            <p className="text-xs text-green-500">{dashboardData.reservationChange} จากเมื่อวาน</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-sm">Up coming</h2>
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
            <p className="text-xs text-gray-500">From 9 table</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-xl font-bold">Filter</h1>
      </div>

      <div className="flex gap-3 mt-6">
        <div className='w-xs'>
          <button popoverTarget="rdp-popover" className="input input-border text-gray-400" style={{ anchorName: "--rdp" } as React.CSSProperties}>
            <CalendarDays className="h-4 w-4" />
            {date ? date.toLocaleDateString() : "Pick a date"}
          </button>
          <div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
            <DayPicker className="react-day-picker text-lg" mode="single" selected={date} onSelect={setDate} />
          </div>
        </div>

        <select className="select select-bordered" value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
          <option value="">All Zones</option>
          <option value="Zone A">Zone A</option>
          <option value="Zone B">Zone B</option>
          <option value="Zone C">Zone C</option>
        </select>

        <select className="select select-bordered" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="confirmed">Table confirmed</option>
          <option value="pending">No table reserved yet</option>
        </select>
      </div>

      <div className="card bg-base-100 shadow mt-6">
        <div className="card-body">
          <h2 className="card-title">Reservation</h2>
          <div className="grid grid-cols-7 text-sm text-gray-400 mb-2">
            <div>Name</div>
            <div>Date</div>
            <div>Time</div>
            <div>Zone</div>
            <div>Table</div>
            <div>Status</div>
            <div></div>
          </div>
          {filteredReservations.map((booking) => (
            <div key={booking.id} className="grid grid-cols-7 items-center text-sm py-2 border-b border-b-gray-300">
              <div>{booking.name}</div>
              <div>{booking.date}</div>
              <div>{booking.time}</div>
              <div>{booking.zone}</div>
              <div>
                <select
                  className="select select-bordered select-sm w-35 "
                  value={selectedTable[booking.id] || ""}
                  onChange={(e) => handleSelectTable(booking.id, e.target.value)}
                >
                  <option value="">เลือกโต๊ะ</option>
                  {tables.filter(table => table.zone === booking.zone)
                  .map((table) => (
                    <option
                      key={table.id}
                      value={`${table.zone} - โต๊ะ ${table.number}`}
                      disabled={table.isBooked || !table.isOpen}
                    >
                      {table.zone} - โต๊ะ {table.number}
                    </option>
                  ))}
                </select>
              </div>
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
    reservation={{
      id: viewingReservation,
      bar: allReservations.find(r => r.id === viewingReservation)?.bar || "",
      reservationNumber: "RSV" + viewingReservation.padStart(4, '0'),
      date: allReservations.find(r => r.id === viewingReservation)?.date || "",
      time: allReservations.find(r => r.id === viewingReservation)?.time || "",
      guests: 2,
      zone: allReservations.find(r => r.id === viewingReservation)?.zone || "",
      name: allReservations.find(r => r.id === viewingReservation)?.name || "",
      email: "example@example.com",
      phone: "123-456-789"
    }}
    onClose={() => setViewingReservation(null)}
  />
)}
    </div>
  )
}
