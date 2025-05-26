"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Search, Trash } from "lucide-react"
import { DayPicker } from "react-day-picker"
import Status from "@/app/components/status"
import { useRouter } from "next/navigation"
import { mockReservations, type Reservation } from "@/app/lib/mockData"

export default function AdminReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredReservations = reservations.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter
    const matchDate = selectedDate
      ? format(new Date(r.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      : true
    const matchSearch =
      searchQuery === "" ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reservationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchDate && matchSearch
  })

  const handleOpenDetailModal = (id: string) => {
    router.push(`/admin/reservations/${id}`)
  }

  const handleDelete = (id: string) => {
    const updated = reservations.filter((res) => res.id !== id)
    setReservations(updated)
  }

  const handleStatusChange = (id: string, newStatus: "confirmed" | "pending" | "cancelled") => {
    setReservations((prev) => prev.map((res) => (res.id === id ? { ...res, status: newStatus } : res)))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">Reservation Management</h1>
          <p className="text-gray-500">Manage all reservations across your restaurants</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {reservations.length} | Showing: {filteredReservations.length}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
        {/* Search Input */}
        <div className="input input-bordered flex items-center gap-2 bg-white border border-gray-300 w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            className="grow"
            placeholder="Search by name, reservation code, or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date Picker */}
        <div className="w-full md:w-60">
          <button
            popoverTarget="rdp-popover"
            className="input input-bordered w-full"
            style={{ anchorName: "--rdp" } as React.CSSProperties}
          >
            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Pick a date"}
          </button>
          <div
            popover="auto"
            id="rdp-popover"
            className="dropdown"
            style={{ positionAnchor: "--rdp" } as React.CSSProperties}
          >
            <DayPicker
              className="react-day-picker rounded-lg p-2"
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
            <div className="flex justify-end mt-2">
              <button className="btn btn-xs" onClick={() => setSelectedDate(undefined)}>
                Clear date
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mt-4">
        <button className={`tab ${filter === "all" ? "tab-active" : ""}`} onClick={() => setFilter("all")}>
          All ({reservations.length})
        </button>
        <button className={`tab ${filter === "confirmed" ? "tab-active" : ""}`} onClick={() => setFilter("confirmed")}>
          Confirmed ({reservations.filter((r) => r.status === "confirmed").length})
        </button>
        <button className={`tab ${filter === "pending" ? "tab-active" : ""}`} onClick={() => setFilter("pending")}>
          Pending ({reservations.filter((r) => r.status === "pending").length})
        </button>
        <button className={`tab ${filter === "cancelled" ? "tab-active" : ""}`} onClick={() => setFilter("cancelled")}>
          Cancelled ({reservations.filter((r) => r.status === "cancelled").length})
        </button>
      </div>

      {/* Reservations Table */}
      <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Reservation #</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Date & Time</th>
              <th>Guests</th>
              <th>Zone</th>
              <th>Bar</th>
              <th>Status</th>
              <th>Table</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="font-mono text-sm">{reservation.reservationNumber}</td>
                <td>
                  <div>
                    <div className="font-medium">{reservation.customerName}</div>
                    <div className="text-xs text-gray-500">{reservation.email}</div>
                  </div>
                </td>
                <td className="text-sm">{reservation.phone}</td>
                <td>
                  <div>
                    <div>{format(new Date(reservation.date), "dd/MM/yyyy")}</div>
                    <div className="text-sm text-gray-500">{reservation.time}</div>
                  </div>
                </td>
                <td>{reservation.guests} people</td>
                <td>{reservation.zone}</td>
                <td>
                  <Status statusString={reservation.bar} />
                </td>
                <td>
                  <div className="dropdown">
                    <select
                      className="select select-sm select-bordered"
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value as any)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
                <td>
                  <span className="text-sm">{reservation.table || "No table assigned"}</span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-outline" onClick={() => handleOpenDetailModal(reservation.id)}>
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.id)}
                      className="btn btn-ghost btn-sm text-red-600 hover:bg-red-100"
                      title="Delete reservation"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center text-gray-500">
                  No reservations found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
