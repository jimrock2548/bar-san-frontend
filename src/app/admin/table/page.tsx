"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Plus } from "lucide-react"

export default function AdminTablesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCafe, setSelectedCafe] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tables, setTables] = useState<any[]>([])
  const [editingTable, setEditingTable] = useState<any>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  /*useEffect(() => {
    const adminUser = localStorage.getItem("adminUser")
    if (!adminUser) {
      router.push("/admin/login")
      return
    }

    const userData = JSON.parse(adminUser)
    setUser(userData)

    if (userData.role === "admin") {
      setSelectedCafe(userData.cafeId)
    } else if (userData.role === "superadmin" && userData.cafes?.length > 0) {
      setSelectedCafe(userData.cafes[0].id)
    }

    setIsLoading(false)
  }, [router])*/

  useEffect(() => {
    if (selectedCafe) {
      const mockTables = [
        { id: 1, number: 1, seats: 2, location: "ริมหน้าต่าง", status: "available", isActive: true },
        { id: 2, number: 2, seats: 2, location: "ริมหน้าต่าง", status: "available", isActive: true },
        { id: 3, number: 3, seats: 2, location: "ริมหน้าต่าง", status: "booked", isActive: true },
        { id: 4, number: 4, seats: 4, location: "กลางร้าน", status: "available", isActive: true },
        { id: 5, number: 5, seats: 4, location: "กลางร้าน", status: "booked", isActive: true },
        { id: 6, number: 6, seats: 4, location: "มุมร้าน", status: "available", isActive: true },
        { id: 7, number: 7, seats: 4, location: "มุมร้าน", status: "booked", isActive: true },
        { id: 8, number: 8, seats: 6, location: "โซนส่วนตัว", status: "available", isActive: true },
        { id: 9, number: 9, seats: 6, location: "โซนส่วนตัว", status: "available", isActive: true },
      ]
      setTables(mockTables)
    }
  }, [selectedCafe])

  const handleAddTable = () => {
    setEditingTable({ id: null, number: tables.length + 1, seats: 2, location: "", status: "available", isActive: true })
    setIsDialogOpen(true)
  }

  const handleEditTable = (table) => {
    setEditingTable({ ...table })
    setIsDialogOpen(true)
  }

  const handleSaveTable = () => {
    if (editingTable.id) {
      setTables(tables.map((t) => (t.id === editingTable.id ? editingTable : t)))
    } else {
      setTables([...tables, { ...editingTable, id: Math.max(...tables.map((t) => t.id)) + 1 }])
    }
    setIsDialogOpen(false)
    setEditingTable(null)
  }

  const handleToggleTableStatus = (tableId) => {
    setTables(tables.map((t) => (t.id === tableId ? { ...t, isActive: !t.isActive } : t)))
  }

  /*if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }*/

  //if (!user) return null

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">จัดการโต๊ะ</h1>
          <p className="text-gray-500">จัดการโต๊ะทั้งหมดในร้าน</p>
        </div>
        <button className="btn btn-neutral" onClick={handleAddTable}>
          <Plus className="w-4 h-4 mr-2 " />
          เพิ่มโต๊ะใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div key={table.id} className={`card bg-base-100 shadow ${!table.isActive && "opacity-60"}`}>
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title">โต๊ะ {table.number}</h2>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    className="toggle toggle-sm"
                    checked={table.isActive}
                    onChange={() => handleToggleTableStatus(table.id)}
                  />
                  <button className="btn btn-ghost btn-xs" onClick={() => handleEditTable(table)}>
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">{table.location || "ไม่ระบุตำแหน่ง"}</p>
              <div className="flex justify-between mt-4">
                <div>
                  <p className="text-sm text-gray-500">ที่นั่ง</p>
                  <p>{table.seats} ที่นั่ง</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">สถานะ</p>
                  <span className={`badge ${table.status === "available" ? "badge-success" : "badge-error"}`}>
                    {table.status === "available" ? "ว่าง" : "ไม่ว่าง"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isDialogOpen && editingTable && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editingTable.id ? "แก้ไขโต๊ะ" : "เพิ่มโต๊ะใหม่"}</h3>
            <div className="py-4 space-y-4">
              <input
                type="number"
                placeholder="หมายเลขโต๊ะ"
                className="input input-bordered w-full"
                value={editingTable.number}
                onChange={(e) => setEditingTable({ ...editingTable, number: parseInt(e.target.value) })}
              />
              <select
                className="select select-bordered w-full"
                value={editingTable.seats}
                onChange={(e) => setEditingTable({ ...editingTable, seats: parseInt(e.target.value) })}
              >
                {[2, 4, 6, 8].map((v) => (
                  <option key={v} value={v}>
                    {v} ที่นั่ง
                  </option>
                ))}
              </select>
              <select
                className="select select-bordered w-full"
                value={editingTable.location}
                onChange={(e) => setEditingTable({ ...editingTable, location: e.target.value })}
              >
                <option value="ริมหน้าต่าง">ริมหน้าต่าง</option>
                <option value="กลางร้าน">กลางร้าน</option>
                <option value="มุมร้าน">มุมร้าน</option>
                <option value="โซนส่วนตัว">โซนส่วนตัว</option>
              </select>
              <select
                className="select select-bordered w-full"
                value={editingTable.status}
                onChange={(e) => setEditingTable({ ...editingTable, status: e.target.value })}
              >
                <option value="available">ว่าง</option>
                <option value="booked">ไม่ว่าง</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="toggle"
                  checked={editingTable.isActive}
                  onChange={(e) => setEditingTable({ ...editingTable, isActive: e.target.checked })}
                />
                <span>เปิดใช้งาน</span>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-outline" onClick={() => setIsDialogOpen(false)}>
                ยกเลิก
              </button>
              <button className="btn btn-primary" onClick={handleSaveTable}>
                บันทึก
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}
