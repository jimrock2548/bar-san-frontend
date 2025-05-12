"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Grip, Plus, Save, Trash2 } from "lucide-react"
import { cn } from "@/app/lib/utils"

// Sample data for roles
const initialRoles = [
  {
    id: 1,
    name: "Super Admin",
    color: "#FF5733",
    position: 1,
    permissions: {
      system: {
        manageSystem: true,
        viewAnalytics: true,
        manageSettings: true,
      },
      users: {
        manageUsers: true,
        viewUsers: true,
        assignRoles: true,
      },
      roles: {
        manageRoles: true,
        viewRoles: true,
      },
      cafes: {
        manageCafes: true,
        viewCafes: true,
        editCafes: true,
      },
      reservations: {
        manageReservations: true,
        viewReservations: true,
        editReservations: true,
        deleteReservations: true,
      },
      tables: {
        manageTables: true,
        viewTables: true,
        editTables: true,
      },
      reports: {
        viewReports: true,
        exportReports: true,
      },
    },
    memberCount: 2,
  },
  {
    id: 2,
    name: "Admin",
    color: "#3366FF",
    position: 2,
    permissions: {
      system: {
        manageSystem: false,
        viewAnalytics: true,
        manageSettings: false,
      },
      users: {
        manageUsers: true,
        viewUsers: true,
        assignRoles: false,
      },
      roles: {
        manageRoles: false,
        viewRoles: true,
      },
      cafes: {
        manageCafes: false,
        viewCafes: true,
        editCafes: true,
      },
      reservations: {
        manageReservations: true,
        viewReservations: true,
        editReservations: true,
        deleteReservations: true,
      },
      tables: {
        manageTables: true,
        viewTables: true,
        editTables: true,
      },
      reports: {
        viewReports: true,
        exportReports: false,
      },
    },
    memberCount: 5,
  },
  {
    id: 3,
    name: "Cafe Manager",
    color: "#33CC66",
    position: 3,
    permissions: {
      system: {
        manageSystem: false,
        viewAnalytics: false,
        manageSettings: false,
      },
      users: {
        manageUsers: false,
        viewUsers: true,
        assignRoles: false,
      },
      roles: {
        manageRoles: false,
        viewRoles: false,
      },
      cafes: {
        manageCafes: false,
        viewCafes: true,
        editCafes: false,
      },
      reservations: {
        manageReservations: true,
        viewReservations: true,
        editReservations: true,
        deleteReservations: false,
      },
      tables: {
        manageTables: true,
        viewTables: true,
        editTables: true,
      },
      reports: {
        viewReports: true,
        exportReports: false,
      },
    },
    memberCount: 8,
  },
  {
    id: 4,
    name: "Staff",
    color: "#FFCC33",
    position: 4,
    permissions: {
      system: {
        manageSystem: false,
        viewAnalytics: false,
        manageSettings: false,
      },
      users: {
        manageUsers: false,
        viewUsers: false,
        assignRoles: false,
      },
      roles: {
        manageRoles: false,
        viewRoles: false,
      },
      cafes: {
        manageCafes: false,
        viewCafes: true,
        editCafes: false,
      },
      reservations: {
        manageReservations: false,
        viewReservations: true,
        editReservations: true,
        deleteReservations: false,
      },
      tables: {
        manageTables: false,
        viewTables: true,
        editTables: false,
      },
      reports: {
        viewReports: false,
        exportReports: false,
      },
    },
    memberCount: 15,
  },
]

// กลุ่มของ permission ที่มีในระบบ
const permissionGroups = {
  system: {
    label: "ระบบ",
    permissions: {
      manageSystem: "จัดการระบบทั้งหมด",
      viewAnalytics: "ดูข้อมูลวิเคราะห์",
      manageSettings: "จัดการการตั้งค่าระบบ",
    },
  },
  users: {
    label: "ผู้ใช้งาน",
    permissions: {
      manageUsers: "จัดการผู้ใช้งาน",
      viewUsers: "ดูรายชื่อผู้ใช้งาน",
      assignRoles: "กำหนด Role ให้ผู้ใช้งาน",
    },
  },
  roles: {
    label: "บทบาท",
    permissions: {
      manageRoles: "จัดการบทบาท",
      viewRoles: "ดูรายการบทบาท",
    },
  },
  cafes: {
    label: "ร้านกาแฟ",
    permissions: {
      manageCafes: "จัดการร้านกาแฟ",
      viewCafes: "ดูข้อมูลร้านกาแฟ",
      editCafes: "แก้ไขข้อมูลร้านกาแฟ",
    },
  },
  reservations: {
    label: "การจอง",
    permissions: {
      manageReservations: "จัดการการจองทั้งหมด",
      viewReservations: "ดูรายการจอง",
      editReservations: "แก้ไขการจอง",
      deleteReservations: "ลบการจอง",
    },
  },
  tables: {
    label: "โต๊ะ",
    permissions: {
      manageTables: "จัดการโต๊ะทั้งหมด",
      viewTables: "ดูข้อมูลโต๊ะ",
      editTables: "แก้ไขข้อมูลโต๊ะ",
    },
  },
  reports: {
    label: "รายงาน",
    permissions: {
      viewReports: "ดูรายงาน",
      exportReports: "ส่งออกรายงาน",
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
            <h1 className="text-3xl font-bold">จัดการบทบาท (Roles)</h1>
            <p className="text-gray-500 mt-1">สร้างและกำหนดสิทธิ์การเข้าถึงสำหรับบทบาทต่างๆ ในระบบ</p>
          </div>
          <button
            onClick={() => {
              setIsCreatingRole(true)
              setSelectedRoleId(null)
            }}
            className="btn btn-primary"
          >
            <Plus size={16} />
            สร้างบทบาทใหม่
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Roles List */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">บทบาททั้งหมด</h2>
              <p className="text-gray-500">จัดการบทบาทและลำดับความสำคัญ</p>
              <div className="overflow-y-auto h-[calc(100vh-300px)]">
                <div className="space-y-2">
                  {roles
                    .sort((a, b) => a.position - b.position)
                    .map((role) => (
                      <div
                        key={role.id}
                        className={cn(
                          "p-3 rounded-lg border flex items-center justify-between cursor-pointer hover:bg-base-200",
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
                          <span className="badge badge-outline text-xs">
                            {role.memberCount}
                          </span>
                        </div>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                          <Grip size={14} className="text-gray-400 ml-1" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Role Details */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            {isCreatingRole ? (
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h2 className="card-title">สร้างบทบาทใหม่</h2>
                  <p className="text-gray-500">กำหนดชื่อและสีสำหรับบทบาทใหม่</p>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">ชื่อบทบาท</span>
                      </label>
                      <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="ใส่ชื่อบทบาท เช่น Manager, Staff"
                        className="input input-bordered max-w-md"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">สีของบทบาท</span>
                      </label>
                      <div className="flex items-center gap-3 max-w-md">
                        <div className="w-10 h-10 rounded-lg border" style={{ backgroundColor: newRoleColor }} />
                        <input
                          type="color"
                          value={newRoleColor}
                          onChange={(e) => setNewRoleColor(e.target.value)}
                          className="w-20 h-10 p-1"
                        />
                        <div className="dropdown">
                          <label tabIndex={0} className="btn btn-outline btn-sm">
                            สีที่แนะนำ
                            <ChevronDown size={14} className="ml-1" />
                          </label>
                          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
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

                    <div className="pt-4 flex gap-2">
                      <button
                        onClick={handleCreateRole}
                        disabled={!newRoleName.trim()}
                        className="btn btn-primary"
                      >
                        สร้างบทบาท
                      </button>
                      <button onClick={() => setIsCreatingRole(false)} className="btn btn-ghost">
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedRole ? (
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedRole.color }} />
                        <input
                          value={selectedRole.name}
                          onChange={(e) => updateRoleName(selectedRole.id, e.target.value)}
                          className="input input-ghost text-xl font-bold p-0 w-auto"
                        />
                      </div>
                      <p className="text-gray-500">
                        ตำแหน่ง: {selectedRole.position} • สมาชิก: {selectedRole.memberCount} คน
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedRole.color}
                        onChange={(e) => updateRoleColor(selectedRole.id, e.target.value)}
                        className="w-10 h-10 p-1"
                      />
                      <div className="modal" id="delete-modal">
                        <button
                          onClick={() => setDeleteConfirmOpen(true)}
                          className="btn btn-error btn-square"
                        >
                          <Trash2 size={16} />
                        </button>
                        {deleteConfirmOpen && (
                          <div className="modal modal-open">
                            <div className="modal-box">
                              <h3 className="font-bold text-lg">ยืนยันการลบบทบาท</h3>
                              <p className="py-4">
                                คุณแน่ใจหรือไม่ที่จะลบบทบาท "{selectedRole.name}"? การกระทำนี้ไม่สามารถย้อนกลับได้
                                และสมาชิกทั้งหมดที่มีบทบาทนี้จะถูกลบบทบาทออก
                              </p>
                              <div className="modal-action">
                                <button onClick={() => setDeleteConfirmOpen(false)} className="btn">
                                  ยกเลิก
                                </button>
                                <button onClick={handleDeleteRole} className="btn btn-error">
                                  ยืนยันการลบ
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <button className="btn btn-ghost btn-square">
                        <Save size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="tabs">
                    <div className="tabs-boxed p-1 mb-4">
                      <a className="tab tab-active">สิทธิ์การใช้งาน</a>
                      <a className="tab">สมาชิก</a>
                      <a className="tab">การแสดงผล</a>
                    </div>

                    <div className="space-y-6">
                      {/* Permissions Tab Content */}
                      <div className="grid gap-6">
                        {Object.entries(permissionGroups).map(([groupKey, group]) => (
                          <div key={groupKey} className="space-y-3">
                            <h3 className="text-lg font-semibold">{group.label}</h3>
                            <div className="space-y-2">
                              {Object.entries(group.permissions).map(([permKey, permLabel]) => (
                                <div
                                  key={permKey}
                                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-base-200"
                                >
                                  <span>{permLabel}</span>
                                  <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={selectedRole.permissions[groupKey][permKey]}
                                    onChange={(e) => updatePermission(groupKey, permKey, e.target.checked)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h2 className="text-xl font-semibold text-gray-500">
                    กรุณาเลือกบทบาทเพื่อดูรายละเอียด
                  </h2>
                </div>
              </div>
            )}
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