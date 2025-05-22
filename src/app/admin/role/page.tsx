"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Grip, Plus, Save, Trash2 } from "lucide-react"
import { cn } from "@/app/lib/utils"
import { view } from "framer-motion/client"

// Sample data for roles
const initialRoles = [
  {
    id: 1,
    name: "Super Admin",
    color: "#FF5733",
    position: 1,
    permissions: {
      dashboard: {
        viewDashboard: true,
        assignTable: true,
        manageSettings: true,
      },
      reservation: {
        viewReservation: true,
        updateStatus: true,
        reservationDelete: true,
      },
      table: {
        viewTable: true,
        addTable: true,
        editTable: true,
      },
      member: {
        viewMember: true,
        editMember: true,
        addRoleToMember: true,
        addNewAdminAccount: true,
      },
      role: {
        roleManage: true,
      },
      log: {
        viewReport: true,
      },
    },
    memberCount: 3,
  },
  {
    id: 2,
    name: "Staff",
    color: "#CC5733",
    position: 2,
    permissions: {
      dashboard: {
        viewDashboard: true,
        assignTable: true,
        manageSettings: true,
      },
      reservation: {
        viewReservation: true,
        updateStatus: true,
        reservationDelete: true,
      },
      table: {
        viewTable: true,
        addTable: true,
        editTable: true,
      },
      member: {
        viewMember: true,
        editMember: true,
        addRoleToMember: true,
        addNewAdminAccount: true,
      },
      role: {
        roleManage: true,
      },
      log: {
        viewReport: true,
      },
    },
    memberCount: 3,
  },
]

// กลุ่มของ permission ที่มีในระบบ
const permissionGroups = {
  dashboard: {
    label: "Dashboard",
    permissions: {
      viewDashboard: "ดูข้อมูลหน้า Dashboard",
      assignTable: "กำหนดโต๊ะให้ลูกค้า",
    },
  },
  reservation: {
    label: "Manage Reservation",
    permissions: {
      viewReservation: "ดูข้อมูลการจอง",
      updateStatus: "อัพเดทสถานะให้ลูกค้า",
      reservationDelete: "ลบข้อมูลการจอง",
    },
  },
  table: {
    label: "Manage Table",
    permissions: {
      viewTable: "ดูข้อมูลโต๊ะ",
      addTable: "เพิ่มโต๊ะ",
      editTable: "จัดการโต๊ะ",
    },
  },
  member: {
    label: "Manage Member",
    permissions: {
      viewMember: "ดูข้อมูล Admin ในร้าน",
      editMember: "จัดการข้อมูล Admin",
      addRoleToMember: "สามารถใส่บทบาทให้คนอื่นได้",
      addNewAdminAccount: "สร้าง ID Admin ใหม่ได้",
    },
  },
  role: {
    label: "Role Management",
    permissions: {
      roleManage: "จัดการบทบาททั้งหมดได้",
    },
  },
  log: {
    label: "Log",
    permissions: {
      viewReport: "ดูรายงานทั้งหมด",
    },
  },
}


export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleColor, setNewRoleColor] = useState("#6E56CF")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const selectedRole = selectedRoleId ? roles.find((role) => role.id === selectedRoleId) : null

  // สร้าง role ใหม่
  const handleCreateRole = () => {
    if (newRoleName.trim() === "") return

    const newRole = {
      id: Math.max(...roles.map((r) => r.id)) + 1,
      name: newRoleName,
      color: newRoleColor,
      position: roles.length + 1,
      permissions: Object.fromEntries(
        Object.keys(permissionGroups).map((group) => [
          group,
          Object.fromEntries(
            Object.keys(permissionGroups[group as keyof typeof permissionGroups].permissions).map((perm) => [
              perm,
              false,
            ]),
          ),
        ]),
      ),
      memberCount: 0,
    }

    setRoles([...roles, newRole])
    setSelectedRoleId(newRole.id)
    setIsCreatingRole(false)
    setNewRoleName("")
  }

  // ลบ role
  const handleDeleteRole = () => {
    if (!selectedRoleId) return
    setRoles(roles.filter((role) => role.id !== selectedRoleId))
    setSelectedRoleId(null)
    setDeleteConfirmOpen(false)
  }

  // อัพเดต permission
  const updatePermission = (group: string, permission: string, value: boolean) => {
    if (!selectedRoleId) return

    setRoles(
      roles.map((role) => {
        if (role.id === selectedRoleId) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [group]: {
                ...role.permissions[group],
                [permission]: value,
              },
            },
          }
        }
        return role
      }),
    )
  }

  // เปลี่ยนตำแหน่งของ role
  const moveRole = (roleId: number, direction: "up" | "down") => {
    const roleIndex = roles.findIndex((r) => r.id === roleId)
    if ((direction === "up" && roleIndex === 0) || (direction === "down" && roleIndex === roles.length - 1)) {
      return
    }

    const newRoles = [...roles]
    const targetIndex = direction === "up" ? roleIndex - 1 : roleIndex + 1

      // สลับตำแหน่ง
      ;[newRoles[roleIndex], newRoles[targetIndex]] = [newRoles[targetIndex], newRoles[roleIndex]]

    // อัพเดตค่า position
    newRoles.forEach((role, index) => {
      role.position = index + 1
    })

    setRoles(newRoles)
  }

  // อัพเดตชื่อ role
  const updateRoleName = (roleId: number, newName: string) => {
    setRoles(roles.map((role) => (role.id === roleId ? { ...role, name: newName } : role)))
  }

  // อัพเดตสี role
  const updateRoleColor = (roleId: number, newColor: string) => {
    setRoles(roles.map((role) => (role.id === roleId ? { ...role, color: newColor } : role)))
  }
  return (
    <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Role</h1>
        <p className="text-gray-500 mt-1">
          Create and set access rights for different roles in the system.
        </p>
      </div>
      <button
        className="btn btn-neutral"
        onClick={() => {
          setIsCreatingRole(true)
          setSelectedRoleId(null)
        }}
      >
        <Plus size={16} />
        Create New Role
      </button>
    </div>

    <div className="grid grid-cols-12 gap-6">
      {/* Sidebar */}
      <div className="col-span-12 md:col-span-4 lg:col-span-3 card bg-base-100 shadow">
        <div className="card-body ">
          <h2 className="card-title">All Roles</h2>
          <div className="overflow-y-scroll h-[calc(150vh-400px)] space-y-2 mt-4 overflow-hidden">
            {roles
              .sort((a, b) => a.position - b.position)
              .map((role) => (
                <div
                  key={role.id}
                  className={cn(
                    "flex justify-between items-center p-3 rounded-lg border cursor-pointer hover:bg-base-200",
                    selectedRoleId === role.id ? "border-primary bg-primary/10" : "border-base-300"
                  )}
                  onClick={() => {
                    setSelectedRoleId(role.id)
                    setIsCreatingRole(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                    <span className="font-medium">{role.name}</span>
                    <span className="badge badge-outline text-xs">{role.memberCount}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveRole(role.id, "up")
                      }}
                      disabled={role.position === 1}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveRole(role.id, "down")
                      }}
                      disabled={role.position === roles.length}
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-12 md:col-span-8 lg:col-span-9">
        <div className="card bg-base-100 shadow h-fit">
          <div className="card-body">
            {isCreatingRole ? (
              <>
                <h2 className="card-title">Create New Role</h2>
                <div className="form-control w-full max-w-md flex flex-col">
                  <label className="label mb-4">
                    <span className="label-text">Role Name</span>
                  </label>
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="input input-bordered"
                    placeholder="e.g. Manager, Staff"
                  />
                </div>

                <div className="form-control w-full max-w-md mt-4">
                  <label className="label">
                    <span className="label-text">Role Color</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg border"
                      style={{ backgroundColor: newRoleColor }}
                    />
                    <input
                      type="color"
                      value={newRoleColor}
                      onChange={(e) => setNewRoleColor(e.target.value)}
                      className="input w-20 h-10 p-1"
                    />
                    <div className="dropdown">
                      <label tabIndex={0} className="btn btn-sm btn-outline">
                        Recommended Colors <ChevronDown size={14} className="ml-1" />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        {["#FF5733", "#3366FF", "#33CC66", "#FFCC33", "#CC33FF", "#FF3366", "#33CCFF"].map(
                          (color) => (
                            <li key={color}>
                              <a onClick={() => setNewRoleColor(color)}>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                                  <span>{color}</span>
                                </div>
                              </a>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    className="btn btn-neutral"
                    onClick={handleCreateRole}
                    disabled={!newRoleName.trim()}
                  >
                    Create Role
                  </button>
                  <button className="btn btn-ghost" onClick={() => setIsCreatingRole(false)}>
                    Cancel
                  </button>
                </div>
              </>
            ) : selectedRole ? (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: selectedRole.color }}
                      />
                      <input
                        value={selectedRole.name}
                        onChange={(e) => updateRoleName(selectedRole.id, e.target.value)}
                        className="input input-ghost text-xl font-bold p-0 w-auto"
                      />
                    </div>
                    <p className="text-gray-500">
                      Position: {selectedRole.position} • Members: {selectedRole.memberCount}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedRole.color}
                      onChange={(e) => updateRoleColor(selectedRole.id, e.target.value)}
                      className="w-10 h-10 p-1"
                    />
                    <button
                      onClick={() => setDeleteConfirmOpen(true)}
                      className="btn btn-error btn-square"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>


                <div className="mt-4 space-y-6">
                  {Object.entries(permissionGroups).map(([groupKey, group]) => (
                    <div key={groupKey} className="space-y-3">
                      <h3 className="text-lg font-semibold">{group.label}</h3>
                      <div className="space-y-2">
                        {Object.entries(group.permissions).map(([permKey, permLabel]) => (
                          <div
                            key={permKey}
                            className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-base-200"
                          >
                            <span>{permLabel}</span>
                            <input
                              type="checkbox"
                              className="toggle toggle-primary"
                              checked={selectedRole.permissions[groupKey][permKey]}
                              onChange={(e) =>
                                updatePermission(groupKey, permKey, e.target.checked)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex justify-center mt-15 h-full text-gray-500">
                Please select a role to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

// Helper function remains the same
function isLightColor(color: string) {
  const hex = color.replace("#", "")
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128
}