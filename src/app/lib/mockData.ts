// Mock Data สำหรับระบบ Admin
export interface User {
  id: string
  name: string
  email: string
  role: string
  bar: string
  isActive: boolean
  createdAt: string
}

export interface Reservation {
  id: string
  customerName: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  zone: string
  table: string | null
  status: "confirmed" | "pending" | "cancelled"
  bar: string
  reservationNumber: string
  notes?: string
  createdAt: string
}

export interface Table {
  id: string
  number: number
  seats: number
  location: string
  zone: string
  status: "available" | "booked" | "maintenance"
  isActive: boolean
  bar: string
}

export interface Cafe {
  id: string
  name: string
  displayName: string
}

export interface PermissionChange {
  permission: string
  group: string
  type: "added" | "removed" | "modified"
  before?: boolean
  after?: boolean
  description: string
}

export interface ActivityLog {
  id: string
  timestamp: Date
  admin: {
    id: number
    name: string
    role: string
    cafe: string
  }
  action: {
    type: string
    severity: string
    label: string
  }
  target: {
    type: string
    label: string
    id?: string
    name?: string
  }
  details: string
  ipAddress: string
  userAgent?: string
  sessionId?: string
  changes?: {
    before: Record<string, any>
    after: Record<string, any>
    fields: string[]
  }
  permissionChanges?: PermissionChange[]
  metadata?: {
    duration?: number
    affectedRecords?: number
    errorCode?: string
    requestId?: string
  }
}

export interface Role {
  id: number
  name: string
  color: string
  position: number
  permissions: {
    [key: string]: {
      [key: string]: boolean
    }
  }
  memberCount: number
}

// Mock Data
export const mockCafes: Cafe[] = [
  { id: "cafe-1", name: "BarSan", displayName: "BarSan." },
  { id: "cafe-2", name: "NOIR", displayName: "NOIR" },
]

export const mockUsers: User[] = [
  {
    id: "1",
    name: "สมชาย ใจดี",
    email: "somchai@barsan.com",
    role: "admin",
    bar: "BarSan",
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "สมหญิง รักสวย",
    email: "somying@noir.com",
    role: "admin",
    bar: "NOIR",
    isActive: true,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "วิชัย ชาญชัย",
    email: "wichai@barsan.com",
    role: "staff",
    bar: "BarSan",
    isActive: true,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "นภา สวยงาม",
    email: "napa@noir.com",
    role: "staff",
    bar: "NOIR",
    isActive: true,
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    name: "ประสิทธิ์ ทำงานดี",
    email: "prasit@barsan.com",
    role: "viewer",
    bar: "BarSan",
    isActive: false,
    createdAt: "2024-02-15",
  },
]

export const mockReservations: Reservation[] = [
  {
    id: "1",
    customerName: "คุณเอ",
    email: "customer1@example.com",
    phone: "081-234-5678",
    date: "2025-05-09",
    time: "18:00",
    guests: 2,
    zone: "Zone A",
    table: null,
    status: "pending",
    bar: "NOIR",
    reservationNumber: "RSV0001",
    notes: "ขอโต๊ะริมหน้าต่าง",
    createdAt: "2025-05-08T10:30:00Z",
  },
  {
    id: "2",
    customerName: "คุณบี",
    email: "customer2@example.com",
    phone: "082-345-6789",
    date: "2025-05-09",
    time: "19:30",
    guests: 4,
    zone: "Zone B",
    table: "T3",
    status: "confirmed",
    bar: "BarSan",
    reservationNumber: "RSV0002",
    createdAt: "2025-05-07T14:20:00Z",
  },
  {
    id: "3",
    customerName: "คุณซี",
    email: "customer3@example.com",
    phone: "083-456-7890",
    date: "2025-05-10",
    time: "17:00",
    guests: 2,
    zone: "Zone C",
    table: "T5",
    status: "confirmed",
    bar: "NOIR",
    reservationNumber: "RSV0003",
    createdAt: "2025-05-08T16:45:00Z",
  },
  {
    id: "4",
    customerName: "คุณดี",
    email: "customer4@example.com",
    phone: "084-567-8901",
    date: "2025-05-12",
    time: "20:00",
    guests: 6,
    zone: "Zone A",
    table: null,
    status: "pending",
    bar: "BarSan",
    reservationNumber: "RSV0004",
    notes: "วันเกิด ขอเค้กเซอร์ไพรส์",
    createdAt: "2025-05-09T09:15:00Z",
  },
  {
    id: "5",
    customerName: "คุณอี",
    email: "customer5@example.com",
    phone: "085-678-9012",
    date: "2025-05-11",
    time: "21:00",
    guests: 3,
    zone: "Zone B",
    table: "T7",
    status: "cancelled",
    bar: "NOIR",
    reservationNumber: "RSV0005",
    createdAt: "2025-05-08T11:00:00Z",
  },
]

export const mockTables: Table[] = [
  // BarSan Tables
  {
    id: "bs-t1",
    number: 1,
    seats: 2,
    location: "ริมหน้าต่าง",
    zone: "Zone A",
    status: "available",
    isActive: true,
    bar: "BarSan",
  },
  {
    id: "bs-t2",
    number: 2,
    seats: 2,
    location: "ริมหน้าต่าง",
    zone: "Zone A",
    status: "booked",
    isActive: true,
    bar: "BarSan",
  },
  {
    id: "bs-t3",
    number: 3,
    seats: 4,
    location: "กลางร้าน",
    zone: "Zone B",
    status: "available",
    isActive: true,
    bar: "BarSan",
  },
  {
    id: "bs-t4",
    number: 4,
    seats: 4,
    location: "กลางร้าน",
    zone: "Zone B",
    status: "booked",
    isActive: true,
    bar: "BarSan",
  },
  {
    id: "bs-t5",
    number: 5,
    seats: 6,
    location: "โซนส่วนตัว",
    zone: "Zone C",
    status: "available",
    isActive: true,
    bar: "BarSan",
  },

  // NOIR Tables
  {
    id: "nr-t1",
    number: 1,
    seats: 2,
    location: "Bar Counter",
    zone: "Zone A",
    status: "available",
    isActive: true,
    bar: "NOIR",
  },
  {
    id: "nr-t2",
    number: 2,
    seats: 2,
    location: "Bar Counter",
    zone: "Zone A",
    status: "booked",
    isActive: true,
    bar: "NOIR",
  },
  {
    id: "nr-t3",
    number: 3,
    seats: 4,
    location: "Couple Table",
    zone: "Zone B",
    status: "available",
    isActive: true,
    bar: "NOIR",
  },
  {
    id: "nr-t4",
    number: 4,
    seats: 4,
    location: "Couple Table",
    zone: "Zone B",
    status: "available",
    isActive: true,
    bar: "NOIR",
  },
  {
    id: "nr-t5",
    number: 5,
    seats: 6,
    location: "Large Group",
    zone: "Zone C",
    status: "booked",
    isActive: true,
    bar: "NOIR",
  },
  {
    id: "nr-t6",
    number: 6,
    seats: 8,
    location: "Large Group",
    zone: "Zone C",
    status: "available",
    isActive: false,
    bar: "NOIR",
  },
]

export const mockRoles: Role[] = [
  {
    id: 1,
    name: "Super Admin",
    color: "#FF5733",
    position: 1,
    permissions: {
      dashboard: {
        viewDashboard: true,
        assignTable: true,
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
    memberCount: 2,
  },
  {
    id: 2,
    name: "Admin",
    color: "#3366FF",
    position: 2,
    permissions: {
      dashboard: {
        viewDashboard: true,
        assignTable: true,
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
        editMember: false,
        addRoleToMember: false,
        addNewAdminAccount: false,
      },
      role: {
        roleManage: false,
      },
      log: {
        viewReport: true,
      },
    },
    memberCount: 2,
  },
  {
    id: 3,
    name: "Staff",
    color: "#33CC66",
    position: 3,
    permissions: {
      dashboard: {
        viewDashboard: true,
        assignTable: true,
      },
      reservation: {
        viewReservation: true,
        updateStatus: true,
        reservationDelete: false,
      },
      table: {
        viewTable: true,
        addTable: false,
        editTable: false,
      },
      member: {
        viewMember: false,
        editMember: false,
        addRoleToMember: false,
        addNewAdminAccount: false,
      },
      role: {
        roleManage: false,
      },
      log: {
        viewReport: false,
      },
    },
    memberCount: 2,
  },
  {
    id: 4,
    name: "Viewer",
    color: "#FFCC33",
    position: 4,
    permissions: {
      dashboard: {
        viewDashboard: true,
        assignTable: false,
      },
      reservation: {
        viewReservation: true,
        updateStatus: false,
        reservationDelete: false,
      },
      table: {
        viewTable: true,
        addTable: false,
        editTable: false,
      },
      member: {
        viewMember: false,
        editMember: false,
        addRoleToMember: false,
        addNewAdminAccount: false,
      },
      role: {
        roleManage: false,
      },
      log: {
        viewReport: false,
      },
    },
    memberCount: 1,
  },
]

// Helper functions
export const getReservationsByBar = (bar: string): Reservation[] => {
  return mockReservations.filter((reservation) => reservation.bar === bar)
}

export const getTablesByBar = (bar: string): Table[] => {
  return mockTables.filter((table) => table.bar === bar)
}

export const getUsersByBar = (bar: string): User[] => {
  return mockUsers.filter((user) => user.bar === bar)
}

export const getAvailableTablesByZone = (bar: string, zone: string): Table[] => {
  return mockTables.filter(
    (table) => table.bar === bar && table.zone === zone && table.status === "available" && table.isActive,
  )
}

export const getTodayReservationsCount = (bar: string): number => {
  const today = new Date().toISOString().split("T")[0]
  return mockReservations.filter((reservation) => reservation.bar === bar && reservation.date === today).length
}

export const getPendingReservationsCount = (bar: string): number => {
  return mockReservations.filter((reservation) => reservation.bar === bar && reservation.status === "pending").length
}

export const getAvailableTablesCount = (bar: string): number => {
  return mockTables.filter((table) => table.bar === bar && table.status === "available" && table.isActive).length
}

// Permission descriptions mapping
const permissionDescriptions: Record<string, Record<string, string>> = {
  dashboard: {
    viewDashboard: "ดูข้อมูลหน้า Dashboard",
    assignTable: "กำหนดโต๊ะให้ลูกค้า",
  },
  reservation: {
    viewReservation: "ดูข้อมูลการจอง",
    updateStatus: "อัพเดทสถานะการจอง",
    reservationDelete: "ลบข้อมูลการจอง",
  },
  table: {
    viewTable: "ดูข้อมูลโต๊ะ",
    addTable: "เพิ่มโต๊ะใหม่",
    editTable: "แก้ไขข้อมูลโต๊ะ",
  },
  member: {
    viewMember: "ดูข้อมูล Admin ในร้าน",
    editMember: "แก้ไขข้อมูล Admin",
    addRoleToMember: "กำหนดบทบาทให้สมาชิก",
    addNewAdminAccount: "สร้างบัญชี Admin ใหม่",
  },
  role: {
    roleManage: "จัดการบทบาทและสิทธิ์",
  },
  log: {
    viewReport: "ดูรายงานและ Log ระบบ",
  },
}

const groupNames: Record<string, string> = {
  dashboard: "Dashboard",
  reservation: "จัดการการจอง",
  table: "จัดการโต๊ะ",
  member: "จัดการสมาชิก",
  role: "จัดการบทบาท",
  log: "รายงานระบบ",
}

// Generate Activity Logs
export const generateMockLogs = (): ActivityLog[] => {
  const actions = [
    { type: "login", severity: "info", label: "Login" },
    { type: "logout", severity: "info", label: "Logout" },
    { type: "create", severity: "success", label: "Create" },
    { type: "edit", severity: "warning", label: "Edit" },
    { type: "delete", severity: "danger", label: "Delete" },
  ]

  const targets = [
    { type: "user", label: "ผู้ใช้" },
    { type: "reservation", label: "การจอง" },
    { type: "table", label: "โต๊ะ" },
    { type: "cafe", label: "ร้านกาแฟ" },
    { type: "role", label: "บทบาท" },
    { type: "permission", label: "สิทธิ์" },
    { type: "setting", label: "การตั้งค่า" },
  ]

  const admins = [
    { id: 1, name: "สมชาย ใจดี", role: "Admin", cafe: "BarSan" },
    { id: 2, name: "สมหญิง รักสวย", role: "Admin", cafe: "NOIR" },
    { id: 3, name: "วิชัย ชาญชัย", role: "Staff", cafe: "BarSan" },
    { id: 4, name: "นภา สวยงาม", role: "Staff", cafe: "NOIR" },
    { id: 5, name: "ประสิทธิ์ ทำงานดี", role: "Viewer", cafe: "BarSan" },
  ]

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  ]

  const logs: ActivityLog[] = []
  const now = new Date()

  // Generate 100 random logs with detailed information
  for (let i = 0; i < 100; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    const target = targets[Math.floor(Math.random() * targets.length)]
    const admin = admins[Math.floor(Math.random() * admins.length)]

    // Random date within the last 30 days
    const date = new Date(now)
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))

    const targetId = Math.floor(Math.random() * 1000) + 1
    let details = ""
    let changes = undefined
    let permissionChanges = undefined
    let metadata = undefined

    switch (action.type) {
      case "login":
        details = `เข้าสู่ระบบสำเร็จ`
        metadata = {
          duration: Math.floor(Math.random() * 5000) + 1000, // 1-6 seconds
          requestId: `req_${Date.now()}_${i}`,
        }
        break
      case "logout":
        details = `ออกจากระบบ`
        metadata = {
          duration: Math.floor(Math.random() * 2000) + 500, // 0.5-2.5 seconds
          requestId: `req_${Date.now()}_${i}`,
        }
        break
      case "create":
        details = `สร้าง${target.label}ใหม่ (ID: ${targetId})`
        if (target.type === "user") {
          changes = {
            before: {},
            after: {
              name: "ผู้ใช้ใหม่",
              email: `user${targetId}@example.com`,
              role: "staff",
              status: "active",
            },
            fields: ["name", "email", "role", "status"],
          }
        } else if (target.type === "reservation") {
          changes = {
            before: {},
            after: {
              customerName: "ลูกค้าใหม่",
              date: "2025-05-15",
              time: "19:00",
              guests: 4,
              status: "pending",
            },
            fields: ["customerName", "date", "time", "guests", "status"],
          }
        } else if (target.type === "role") {
          const roleName = `บทบาทใหม่ ${targetId}`
          details = `สร้างบทบาทใหม่ "${roleName}"`
          changes = {
            before: {},
            after: {
              name: roleName,
              color: "#3366FF",
              position: 5,
            },
            fields: ["name", "color", "position"],
          }
          // สร้าง permission changes สำหรับ role ใหม่
          permissionChanges = [
            {
              permission: "viewDashboard",
              group: "dashboard",
              type: "added" as const,
              after: true,
              description: permissionDescriptions.dashboard.viewDashboard,
            },
            {
              permission: "viewReservation",
              group: "reservation",
              type: "added" as const,
              after: true,
              description: permissionDescriptions.reservation.viewReservation,
            },
            {
              permission: "viewTable",
              group: "table",
              type: "added" as const,
              after: true,
              description: permissionDescriptions.table.viewTable,
            },
          ]
        }
        metadata = {
          duration: Math.floor(Math.random() * 3000) + 500,
          requestId: `req_${Date.now()}_${i}`,
        }
        break
      case "edit":
        details = `แก้ไข${target.label} (ID: ${targetId})`
        if (target.type === "user") {
          const oldRole = ["staff", "admin", "viewer"][Math.floor(Math.random() * 3)]
          const newRole = ["staff", "admin", "viewer"][Math.floor(Math.random() * 3)]
          changes = {
            before: {
              name: "ชื่อเดิม",
              email: "old@example.com",
              role: oldRole,
              status: "active",
            },
            after: {
              name: "ชื่อใหม่",
              email: "new@example.com",
              role: newRole,
              status: "active",
            },
            fields: ["name", "email", "role"],
          }
        } else if (target.type === "reservation") {
          changes = {
            before: {
              status: "pending",
              table: null,
              time: "18:00",
            },
            after: {
              status: "confirmed",
              table: "T5",
              time: "19:00",
            },
            fields: ["status", "table", "time"],
          }
        } else if (target.type === "table") {
          changes = {
            before: {
              status: "available",
              seats: 4,
              location: "กลางร้าน",
            },
            after: {
              status: "maintenance",
              seats: 6,
              location: "มุมร้าน",
            },
            fields: ["status", "seats", "location"],
          }
        } else if (target.type === "role") {
          const roleName = `บทบาท ${targetId}`
          details = `แก้ไขสิทธิ์บทบาท "${roleName}"`
          changes = {
            before: {
              name: roleName,
              color: "#FF5733",
            },
            after: {
              name: roleName,
              color: "#3366FF",
            },
            fields: ["permissions"],
          }
          // สร้าง permission changes แบบละเอียด
          permissionChanges = [
            {
              permission: "manageSettings",
              group: "dashboard",
              type: "added" as const,
              before: false,
              after: true,
              description: permissionDescriptions.dashboard.manageSettings,
            },
            {
              permission: "reservationDelete",
              group: "reservation",
              type: "removed" as const,
              before: true,
              after: false,
              description: permissionDescriptions.reservation.reservationDelete,
            },
            {
              permission: "editTable",
              group: "table",
              type: "modified" as const,
              before: false,
              after: true,
              description: permissionDescriptions.table.editTable,
            },
            {
              permission: "addNewAdminAccount",
              group: "member",
              type: "added" as const,
              before: false,
              after: true,
              description: permissionDescriptions.member.addNewAdminAccount,
            },
            {
              permission: "viewReport",
              group: "log",
              type: "removed" as const,
              before: true,
              after: false,
              description: permissionDescriptions.log.viewReport,
            },
          ]
        }
        metadata = {
          duration: Math.floor(Math.random() * 4000) + 1000,
          requestId: `req_${Date.now()}_${i}`,
        }
        break
      case "delete":
        details = `ลบ${target.label} (ID: ${targetId})`
        if (target.type === "user") {
          changes = {
            before: {
              name: "ผู้ใช้ที่ถูกลบ",
              email: `deleted${targetId}@example.com`,
              role: "staff",
              status: "active",
            },
            after: {},
            fields: ["name", "email", "role", "status"],
          }
        } else if (target.type === "role") {
          const roleName = `บทบาทที่ถู��ลบ ${targetId}`
          details = `ลบบทบาท "${roleName}"`
          changes = {
            before: {
              name: roleName,
              color: "#FF5733",
              memberCount: 3,
            },
            after: {},
            fields: ["name", "color", "permissions"],
          }
          // สร้าง permission changes สำหรับการลบ role
          permissionChanges = [
            {
              permission: "viewDashboard",
              group: "dashboard",
              type: "removed" as const,
              before: true,
              description: permissionDescriptions.dashboard.viewDashboard,
            },
            {
              permission: "viewReservation",
              group: "reservation",
              type: "removed" as const,
              before: true,
              description: permissionDescriptions.reservation.viewReservation,
            },
            {
              permission: "editTable",
              group: "table",
              type: "removed" as const,
              before: true,
              description: permissionDescriptions.table.editTable,
            },
          ]
        }
        metadata = {
          duration: Math.floor(Math.random() * 2000) + 500,
          affectedRecords: 1,
          requestId: `req_${Date.now()}_${i}`,
        }
        break
      default:
    }

    logs.push({
      id: (i + 1).toString(),
      timestamp: date,
      admin: admin,
      action: action,
      target: {
        ...target,
        id: targetId.toString(),
        name: target.type === "role" ? `บทบาท ${targetId}` : undefined,
      },
      details: details,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      sessionId: `sess_${Date.now()}_${admin.id}_${Math.floor(Math.random() * 1000)}`,
      changes,
      permissionChanges,
      metadata,
    })
  }

  // Sort logs by timestamp (newest first)
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export { permissionDescriptions, groupNames }

// Admin accounts for testing
export interface AdminAccount {
  id: string
  username: string
  password: string
  name: string
  email: string
  role: "superadmin" | "admin" | "staff" | "viewer"
  cafes: string[]
  isActive: boolean
}

export const mockAdminAccounts: AdminAccount[] = [
  {
    id: "admin-1",
    username: "superadmin",
    password: "123456",
    name: "Super Admin",
    email: "superadmin@barsan.com",
    role: "superadmin",
    cafes: ["BarSan", "NOIR"],
    isActive: true,
  },
  {
    id: "admin-2",
    username: "admin.barsan",
    password: "123456",
    name: "Admin BarSan",
    email: "admin@barsan.com",
    role: "admin",
    cafes: ["BarSan"],
    isActive: true,
  },
  {
    id: "admin-3",
    username: "admin.noir",
    password: "123456",
    name: "Admin NOIR",
    email: "admin@noir.com",
    role: "admin",
    cafes: ["NOIR"],
    isActive: true,
  },
  {
    id: "admin-4",
    username: "staff.barsan",
    password: "123456",
    name: "Staff BarSan",
    email: "staff@barsan.com",
    role: "staff",
    cafes: ["BarSan"],
    isActive: true,
  },
  {
    id: "admin-5",
    username: "viewer.test",
    password: "123456",
    name: "Viewer Test",
    email: "viewer@test.com",
    role: "viewer",
    cafes: ["BarSan"],
    isActive: true,
  },
]

// Helper function to authenticate admin
export const authenticateAdmin = (username: string, password: string): AdminAccount | null => {
  const admin = mockAdminAccounts.find(
    (account) => account.username === username && account.password === password && account.isActive,
  )
  return admin || null
}
