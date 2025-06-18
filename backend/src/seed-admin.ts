import { prisma } from "./lib/prisma"
import { hashPassword } from "./lib/utils"

async function seedAdmins() {
  console.log("Seeding admin accounts...")

  // Create cafes if they don't exist
  const barsan = await prisma.cafe.upsert({
    where: { name: "BarSan" },
    update: {},
    create: {
      name: "BarSan",
      displayName: "BarSan.",
      description: "BarSan Cafe",
      address: "123 Main St",
      openingHours: "10:00-22:00",
      isActive: true,
    },
  })

  const noir = await prisma.cafe.upsert({
    where: { name: "NOIR" },
    update: {},
    create: {
      name: "NOIR",
      displayName: "NOIR",
      description: "NOIR Cafe",
      address: "456 Oak St",
      openingHours: "10:00-22:00",
      isActive: true,
    },
  })

  // Create roles if they don't exist
  const superAdminRole = await prisma.role.upsert({
    where: { name: "super_admin" },
    update: {},
    create: {
      name: "super_admin",
      displayName: "Super Admin",
      description: "Full access to all cafes and features",
      permissions: ["all"],
    },
  })

  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      displayName: "Admin",
      description: "Full access to assigned cafe",
      permissions: ["manage_staff", "manage_tables", "manage_reservations", "view_reports"],
    },
  })

  const staffRole = await prisma.role.upsert({
    where: { name: "staff" },
    update: {},
    create: {
      name: "staff",
      displayName: "Staff",
      description: "Can manage reservations and tables",
      permissions: ["manage_reservations", "view_tables"],
    },
  })

  const viewerRole = await prisma.role.upsert({
    where: { name: "viewer" },
    update: {},
    create: {
      name: "viewer",
      displayName: "Viewer",
      description: "Can only view data",
      permissions: ["view_reservations", "view_tables"],
    },
  })

  // Create admin accounts
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "123456"
  const hashedPassword = await hashPassword(defaultPassword)

  // Super Admin
  const superAdmin = await prisma.admin.upsert({
    where: { username: "superadmin" },
    update: {},
    create: {
      username: "superadmin",
      email: process.env.SUPER_ADMIN_EMAIL || "super@barsan.cafe",
      passwordHash: hashedPassword,
      fullName: "Super Admin",
      isActive: true,
    },
  })

  // Assign super admin role (global, no specific cafe)
  await prisma.adminRole.upsert({
    where: {
      adminId_roleId_cafeId: {
        adminId: superAdmin.id,
        roleId: superAdminRole.id,
        cafeId: null,
      },
    },
    update: {},
    create: {
      adminId: superAdmin.id,
      roleId: superAdminRole.id,
      cafeId: null,
    },
  })

  // BarSan Admin
  const barsanAdmin = await prisma.admin.upsert({
    where: { username: "admin.barsan" },
    update: {},
    create: {
      username: "admin.barsan",
      email: "admin@barsan.cafe",
      passwordHash: hashedPassword,
      fullName: "BarSan Admin",
      isActive: true,
    },
  })

  await prisma.adminRole.upsert({
    where: {
      adminId_roleId_cafeId: {
        adminId: barsanAdmin.id,
        roleId: adminRole.id,
        cafeId: barsan.id,
      },
    },
    update: {},
    create: {
      adminId: barsanAdmin.id,
      roleId: adminRole.id,
      cafeId: barsan.id,
    },
  })

  // NOIR Admin
  const noirAdmin = await prisma.admin.upsert({
    where: { username: "admin.noir" },
    update: {},
    create: {
      username: "admin.noir",
      email: "admin@noir.cafe",
      passwordHash: hashedPassword,
      fullName: "NOIR Admin",
      isActive: true,
    },
  })

  await prisma.adminRole.upsert({
    where: {
      adminId_roleId_cafeId: {
        adminId: noirAdmin.id,
        roleId: adminRole.id,
        cafeId: noir.id,
      },
    },
    update: {},
    create: {
      adminId: noirAdmin.id,
      roleId: adminRole.id,
      cafeId: noir.id,
    },
  })

  // Staff
  const staffUser = await prisma.admin.upsert({
    where: { username: "staff.barsan" },
    update: {},
    create: {
      username: "staff.barsan",
      email: "staff@barsan.cafe",
      passwordHash: hashedPassword,
      fullName: "BarSan Staff",
      isActive: true,
    },
  })

  await prisma.adminRole.upsert({
    where: {
      adminId_roleId_cafeId: {
        adminId: staffUser.id,
        roleId: staffRole.id,
        cafeId: barsan.id,
      },
    },
    update: {},
    create: {
      adminId: staffUser.id,
      roleId: staffRole.id,
      cafeId: barsan.id,
    },
  })

  // Viewer
  const viewerUser = await prisma.admin.upsert({
    where: { username: "viewer.test" },
    update: {},
    create: {
      username: "viewer.test",
      email: "viewer@barsan.cafe",
      passwordHash: hashedPassword,
      fullName: "Test Viewer",
      isActive: true,
    },
  })

  await prisma.adminRole.upsert({
    where: {
      adminId_roleId_cafeId: {
        adminId: viewerUser.id,
        roleId: viewerRole.id,
        cafeId: barsan.id,
      },
    },
    update: {},
    create: {
      adminId: viewerUser.id,
      roleId: viewerRole.id,
      cafeId: barsan.id,
    },
  })

  console.log("✅ Admin accounts seeded successfully")
}

seedAdmins()
  .catch((e) => {
    console.error("Error seeding admin accounts:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
