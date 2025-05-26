"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { CalendarRange, ChevronDown, Table2, Users, CalendarDays } from "lucide-react"
import { useState } from "react"
import Status from "@/app/components/status"
import { DayPicker } from "react-day-picker"
import ReservationDetailModal from "@/app/components/reservationDetail"
import {
  mockCafes,
  getReservationsByBar,
  getTablesByBar,
  getTodayReservationsCount,
  getPendingReservationsCount,
  getAvailableTablesCount,
  getAvailableTablesByZone,
} from "@/app/lib/mockData"

export default function Page() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [zoneFilter, setZoneFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [viewingReservation, setViewingReservation] = useState<string | null>(null)

  const user = {
    role: "superadmin",
    cafes: mockCafes,
  }

  const [selectedCafe, setSelectedCafe] = useState<string>(user.cafes[0].id)
  const [selectedTable, setSelectedTable] = useState<{ [key: string]: string }>({})

  const currentCafeName = mockCafes.find((c) => c.id === selectedCafe)?.displayName || ""

  // Get data for selected cafe
  const cafeReservations = getReservationsByBar(currentCafeName === "BarSan." ? "BarSan" : "NOIR")
  const cafeTables = getTablesByBar(currentCafeName === "BarSan." ? "BarSan" : "NOIR")

  const dashboardData = {
    todayReservations: getTodayReservationsCount(currentCafeName === "BarSan." ? "BarSan" : "NOIR"),
    reservationChange: selectedCafe === "cafe-1" ? "+15%" : "-10%",
    pendingReservations: getPendingReservationsCount(currentCafeName === "BarSan." ? "BarSan" : "NOIR"),
    availableTables: getAvailableTablesCount(currentCafeName === "BarSan." ? "BarSan" : "NOIR"),
  }

  const filteredReservations = cafeReservations.filter((r) => {
    const matchesDate = !date || r.date === format(date, "yyyy-MM-dd")
    const matchesZone = !zoneFilter || r.zone === zoneFilter
    const matchesStatus = statusFilter === "All" || r.status === statusFilter
    return matchesDate && matchesZone && matchesStatus
  })

  const handleOpenDetailModal = (id: string) => {
    setViewingReservation(id)
  }

  const handleSelectTable = (bookingId: string, tableId: string) => {
    setSelectedTable((prev) => ({ ...prev, [bookingId]: tableId }))
  }

  const zones = [...new Set(cafeTables.map((table) => table.zone))]

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
            <ul tabIndex={0} className="menu dropdown-content mt-2 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">เลือกร้าน</li>
              {user.cafes.map((cafe) => (
                <li key={cafe.id}>
                  <a onClick={() => setSelectedCafe(cafe.id)}>{cafe.displayName}</a>
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
            <p className="text-xs text-gray-500">From {cafeTables.length} tables</p>
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

        <select className="select select-bordered" value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
          <option value="">All Zones</option>
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="confirmed">Table confirmed</option>
          <option value="pending">No table reserved yet</option>
          <option value="cancelled">Cancelled</option>
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
              <div>{booking.customerName}</div>
              <div>{booking.date}</div>
              <div>{booking.time}</div>
              <div>{booking.zone}</div>
              <div>
                <select
                  className="select select-bordered select-sm w-35"
                  value={selectedTable[booking.id] || booking.table || ""}
                  onChange={(e) => handleSelectTable(booking.id, e.target.value)}
                >
                  <option value="">เลือกโต๊ะ</option>
                  {getAvailableTablesByZone(currentCafeName === "BarSan." ? "BarSan" : "NOIR", booking.zone).map(
                    (table) => (
                      <option
                        key={table.id}
                        value={`${table.zone} - โต๊ะ ${table.number}`}
                        disabled={table.status === "booked" || !table.isActive}
                      >
                        {table.zone} - โต๊ะ {table.number}
                      </option>
                    ),
                  )}
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
            bar: filteredReservations.find((r) => r.id === viewingReservation)?.bar || "",
            reservationNumber: filteredReservations.find((r) => r.id === viewingReservation)?.reservationNumber || "",
            date: filteredReservations.find((r) => r.id === viewingReservation)?.date || "",
            time: filteredReservations.find((r) => r.id === viewingReservation)?.time || "",
            guests: filteredReservations.find((r) => r.id === viewingReservation)?.guests || 2,
            zone: filteredReservations.find((r) => r.id === viewingReservation)?.zone || "",
            name: filteredReservations.find((r) => r.id === viewingReservation)?.customerName || "",
            email: filteredReservations.find((r) => r.id === viewingReservation)?.email || "",
            phone: filteredReservations.find((r) => r.id === viewingReservation)?.phone || "",
          }}
          onClose={() => setViewingReservation(null)}
        />
      )}
    </div>
  )
}
