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
  }
  details: string
  ipAddress: string
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
        manageSettings: false,
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
        manageSettings: false,
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
        manageSettings: false,
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

  const logs: ActivityLog[] = []
  const now = new Date()

  // Generate 100 random logs
  for (let i = 0; i < 100; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    const target = targets[Math.floor(Math.random() * targets.length)]
    const admin = admins[Math.floor(Math.random() * admins.length)]

    // Random date within the last 30 days
    const date = new Date(now)
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))

    // Generate a descriptive message based on the action and target
    let details = ""
    const targetId = Math.floor(Math.random() * 1000) + 1

    switch (action.type) {
      case "login":
        details = `เข้าสู่ระบบ`
        break
      case "logout":
        details = `ออกจากระบบ`
        break
      case "create":
        details = `สร้าง${target.label}ใหม่ (ID: ${targetId})`
        break
      case "edit":
        details = `แก้ไข${target.label} (ID: ${targetId})`
        break
      case "delete":
        details = `ลบ${target.label} (ID: ${targetId})`
        break
      default:
    }

    logs.push({
      id: (i + 1).toString(),
      timestamp: date,
      admin: admin,
      action: action,
      target: target,
      details: details,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    })
  }

  // Sort logs by timestamp (newest first)
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
