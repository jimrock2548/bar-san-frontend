"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Trash } from "lucide-react";


import { DayPicker } from "react-day-picker";
import Status from '@/app/components/status'
import { useRouter } from "next/navigation";

type Reservation = {
  id: number;
  customerName: string;
  date: string;
  time: string;
  table: string | null;
  zone: string;
  status: "confirmed" | "pending" | "cancelled";
};

const mockReservations: Reservation[] = [
  {
    id: 1,
    customerName: "John Doe",
    date: "2025-05-12",
    time: "19:00",
    table: null,
    zone: "A",
    status: "pending",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    date: "2025-05-13",
    time: "20:00",
    table: "T3",
    zone: "B",
    status: "confirmed",
  },
  {
    id: 3,
    customerName: "Bob Brown",
    date: "2025-05-14",
    time: "21:00",
    table: "T2",
    zone: "C",
    status: "cancelled",
  },
];

export default function AdminReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all");
 const router = useRouter()

  const filteredReservations = reservations.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const matchDate = selectedDate
      ? format(new Date(r.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      : true;
    return matchStatus && matchDate;
  });



  const handleOpenDetailModal = (id: string) => {
    router.push(`/admin/reservations/${id}`)
  }

  const handleDelete = (id: number) => {
    const updated = reservations.filter((res) => res.id !== id);
    setReservations(updated);
  };

  
 
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Reservation</h1>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
        {/* Search Input */}
        <div className="input input-bordered flex items-center gap-2 bg-white border border-gray-300 w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            className="grow"
            placeholder="Find from Name, Code reservation"
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
        <button
          className={`tab ${filter === "all" ? "tab-active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`tab ${filter === "confirmed" ? "tab-active" : ""}`}
          onClick={() => setFilter("confirmed")}
        >
          Confirm
        </button>
        <button
          className={`tab ${filter === "pending" ? "tab-active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Up-coming
        </button>
        <button
          className={`tab ${filter === "cancelled" ? "tab-active" : ""}`}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {/* กล่องพื้นหลังสีขาวครอบตาราง */}
      <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Table</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.customerName}</td>
                <td>{format(new Date(reservation.date), "dd/MM/yyyy")}</td>
                <td>{reservation.time}</td>
                <td>{reservation.zone}</td>
                <td>
                  <Status statusString={reservation.status} />
                </td>
                <td>
                  <div className="dropdown">
                    <label tabIndex={0} className="btn btn-sm ">
                      {reservation.table ?? "ยังไม่ได้เลือกโต๊ะ"}
                    </label>

                  </div>
                </td>

            
                <td>
                  <button
                    onClick={() => handleDelete(reservation.id)}
                    className="btn btn-ghost btn-sm text-red-600 hover:bg-red-100"
                    title="ลบรายการ"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
