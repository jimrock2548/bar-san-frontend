"use client"

import withAuth from "@/app/lib/withauth"
import { useEffect, useState } from "react"
import { Edit, Plus } from "lucide-react"
import { useAdmin } from "@/app/admin/layout"
import axios from "axios"

interface Table {
  id: string
  number: number
  seats: number
  location: string
  zone: string
  status: string
  isActive: boolean
  bar: string
}

function AdminTablesPage() {
  const { selectedCafe } = useAdmin()
  const [tables, setTables] = useState<Table[]>([])
  const [editingTable, setEditingTable] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (selectedCafe) {
      axios.get(
        `http://myhostserver.sytes.net:5050/admin/tables/${selectedCafe}`,
        {
          withCredentials: true
        }
      )
        .then(res => {
          const fetchedTables = res.data.tables.map((t: any) => ({
            id: t.id,
            number: t.number,
            seats: t.seats,
            location: t.location,
            zone: t.zone.name,
            status: t.status,
            isActive: t.is_active,
            bar: t.cafe
          }))
          setTables(fetchedTables)
        })
        .catch(err => {
          console.error("Failed to fetch tables", err)
        })
    }
  }, [selectedCafe])

  const handleAddTable = () => {
    const existingNumbers = tables.map((t) => t.number)
    const nextNumber = Math.max(...existingNumbers, 0) + 1

    setEditingTable({
      id: null,
      number: nextNumber,
      seats: 2,
      location: "ริมหน้าต่าง",
      zone: "Zone A",
      status: "available",
      isActive: true,
      bar: tables[0]?.bar ?? "BarSan",
    })
    setIsDialogOpen(true)
  }

  const handleEditTable = (table: Table) => {
    setEditingTable({ ...table })
    setIsDialogOpen(true)
  }

  const handleSaveTable = () => {
    if (editingTable.id) {
      setTables(tables.map((t) => (t.id === editingTable.id ? editingTable : t)))
    } else {
      const newId = `tbl-${Date.now()}`
      setTables([...tables, { ...editingTable, id: newId }])
    }
    setIsDialogOpen(false)
    setEditingTable(null)
  }

  const handleToggleTableStatus = (tableId: string) => {
    setTables(tables.map((t) => (t.id === tableId ? { ...t, isActive: !t.isActive } : t)))
  }

  const handleDeleteTable = (tableId: string) => {
    if (confirm("Are you sure you want to delete this table?")) {
      setTables(tables.filter((t) => t.id !== tableId))
    }
  }

  const cafeDisplayName = tables[0]?.bar || "Selected Cafe"
  const zones = [...new Set(tables.map((table) => table.zone))]
  const locations = ["ริมหน้าต่าง", "กลางร้าน", "มุมร้าน", "โซนส่วนตัว", "Bar Counter", "Couple Table", "Large Group"]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Tables</h1>
          <p className="text-gray-500">Manage tables for {cafeDisplayName}</p>
        </div>
        <button className="btn btn-neutral" onClick={handleAddTable}>
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Tables</div>
          <div className="stat-value text-primary">{tables.length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Available</div>
          <div className="stat-value text-success">
            {tables.filter((t) => t.status === "available" && t.isActive).length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Booked</div>
          <div className="stat-value text-warning">{tables.filter((t) => t.status === "booked").length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Inactive</div>
          <div className="stat-value text-error">{tables.filter((t) => !t.isActive).length}</div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div key={table.id} className={`card bg-base-100 shadow ${!table.isActive && "opacity-60"}`}>
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title">Table {table.number}</h2>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    className="toggle toggle-sm"
                    checked={table.isActive}
                    onChange={() => handleToggleTableStatus(table.id)}
                    title={table.isActive ? "Deactivate table" : "Activate table"}
                  />
                  <button className="btn btn-ghost btn-xs" onClick={() => handleEditTable(table)} title="Edit table">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Location:</span> {table.location}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Zone:</span> {table.zone}
                </p>
              </div>

              <div className="flex justify-between mt-4">
                <div>
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-medium">{table.seats} ที่นั่ง</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`badge ${table.status === "available"
                      ? "badge-success"
                      : table.status === "booked"
                        ? "badge-warning"
                        : "badge-error"
                      }`}
                  >
                    {table.status === "available" ? "Available" : table.status === "booked" ? "Booked" : "Maintenance"}
                  </span>
                </div>
              </div>

              {!table.isActive && (
                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-error btn-outline w-full"
                    onClick={() => handleDeleteTable(table.id)}
                  >
                    Delete Table
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Table Modal */}
      {isDialogOpen && editingTable && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editingTable.id ? "Edit Table" : "Add New Table"}</h3>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Table Number</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={editingTable.number}
                    onChange={(e) => setEditingTable({ ...editingTable, number: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Seats</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={editingTable.seats}
                    onChange={(e) => setEditingTable({ ...editingTable, seats: Number.parseInt(e.target.value) })}
                  >
                    {[2, 4, 6, 8, 10].map((v) => (
                      <option key={v} value={v}>
                        {v} ที่นั่ง
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Zone</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editingTable.zone}
                  onChange={(e) => setEditingTable({ ...editingTable, zone: e.target.value })}
                >
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                  <option value="Zone D">Zone D (New)</option>
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editingTable.location}
                  onChange={(e) => setEditingTable({ ...editingTable, location: e.target.value })}
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editingTable.status}
                  onChange={(e) => setEditingTable({ ...editingTable, status: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="toggle"
                  checked={editingTable.isActive}
                  onChange={(e) => setEditingTable({ ...editingTable, isActive: e.target.checked })}
                />
                <span>Active</span>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-neutral" onClick={handleSaveTable}>
                {editingTable.id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}
export default AdminTablesPage