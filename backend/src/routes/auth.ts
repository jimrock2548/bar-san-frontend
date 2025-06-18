import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { prisma } from "../lib/prisma"
import { GoogleOAuthService } from "../lib/google-oauth"
import { hashPassword, comparePassword, validateEmail } from "../lib/utils"

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )

  // Google OAuth - Start
  .get("/google", ({ query, set }) => {
    const { redirect } = query
    const state = redirect ? Buffer.from(redirect).toString("base64") : undefined
    const authUrl = GoogleOAuthService.getAuthUrl(state)

    set.redirect = authUrl
  })

  // Google OAuth - Callback
  .get("/google/callback", async ({ query, jwt, setCookie, set }) => {
    const { code, state, error } = query

    if (error) {
      set.redirect = `${process.env.FRONTEND_URL}/login?error=${error}`
      return
    }

    if (!code) {
      set.redirect = `${process.env.FRONTEND_URL}/login?error=missing_code`
      return
    }

    try {
      const tokens = await GoogleOAuthService.getTokens(code)

      if (!tokens.access_token) {
        throw new Error("No access token received")
      }

      const googleUser = await GoogleOAuthService.getUserInfo(tokens.access_token)

      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId: googleUser.id,
          },
        },
        include: { user: true },
      })

      let user

      if (account) {
        user = account.user

        await prisma.account.update({
          where: { id: account.id },
          data: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
            id_token: tokens.id_token,
          },
        })

        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            fullName: googleUser.name,
            image: googleUser.picture,
            emailVerified: googleUser.verified_email ? new Date() : null,
            isVerified: googleUser.verified_email,
          },
        })
      } else {
        const existingUser = await prisma.user.findUnique({
          where: { email: googleUser.email },
        })

        if (existingUser) {
          user = existingUser

          await prisma.account.create({
            data: {
              userId: user.id,
              type: "oauth",
              provider: "google",
              providerAccountId: googleUser.id,
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
              expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
              token_type: "Bearer",
              scope: "email profile",
              id_token: tokens.id_token,
            },
          })

          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              fullName: user.fullName || googleUser.name,
              image: user.image || googleUser.picture,
              emailVerified: googleUser.verified_email ? new Date() : user.emailVerified,
              isVerified: googleUser.verified_email || user.isVerified,
            },
          })
        } else {
          user = await prisma.user.create({
            data: {
              email: googleUser.email,
              fullName: googleUser.name,
              image: googleUser.picture,
              emailVerified: googleUser.verified_email ? new Date() : null,
              isVerified: googleUser.verified_email,
              accounts: {
                create: {
                  type: "oauth",
                  provider: "google",
                  providerAccountId: googleUser.id,
                  access_token: tokens.access_token,
                  refresh_token: tokens.refresh_token,
                  expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
                  token_type: "Bearer",
                  scope: "email profile",
                  id_token: tokens.id_token,
                },
              },
            },
          })
        }
      }

      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        type: "user",
      })

      await prisma.userSession.create({
        data: {
          userId: user.id,
          sessionToken: token,
          ipAddress: "127.0.0.1",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      })

      setCookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
      })

      const redirectUrl = state ? Buffer.from(state, "base64").toString() : `${process.env.FRONTEND_URL}/`

      set.redirect = redirectUrl
    } catch (error) {
      console.error("Google OAuth error:", error)
      set.redirect = `${process.env.FRONTEND_URL}/login?error=oauth_error`
    }
  })

  // Register with email/password
  .post(
    "/register",
    async ({ body, jwt, setCookie, set }) => {
      const { email, password, fullName, phone } = body

      if (!validateEmail(email)) {
        set.status = 400
        return { success: false, message: "Invalid email format" }
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        set.status = 400
        return { success: false, message: "Email already exists" }
      }

      const hashedPassword = await hashPassword(password)
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          fullName,
          phone,
          isVerified: false,
        },
      })

      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        type: "user",
      })

      await prisma.userSession.create({
        data: {
          userId: user.id,
          sessionToken: token,
          ipAddress: "127.0.0.1",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      })

      setCookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
      })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          isVerified: user.isVerified,
        },
        token,
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
        fullName: t.String(),
        phone: t.Optional(t.String()),
      }),
    },
  )

  // Login with email/password
  .post(
    "/login",
    async ({ body, jwt, setCookie, set }) => {
      const { email, password } = body

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user || !user.passwordHash) {
        set.status = 401
        return { success: false, message: "Invalid credentials" }
      }

      const isValidPassword = await comparePassword(password, user.passwordHash)
      if (!isValidPassword) {
        set.status = 401
        return { success: false, message: "Invalid credentials" }
      }

      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        type: "user",
      })

      await prisma.userSession.upsert({
        where: { sessionToken: token },
        create: {
          userId: user.id,
          sessionToken: token,
          ipAddress: "127.0.0.1",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        update: {
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      })

      setCookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
      })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          image: user.image,
          isVerified: user.isVerified,
        },
        token,
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    },
  )

  // Get current user
  .get("/me", async ({ cookie, jwt, headers, set }) => {
    // Try to get token from cookie first
    let token = cookie["auth-token"]

    // If no cookie, try to get from Authorization header
    if (!token && headers.authorization?.startsWith("Bearer ")) {
      token = headers.authorization.substring(7)
    }

    if (!token) {
      set.status = 401
      return { success: false, message: "No authentication token" }
    }

    try {
      const payload = await jwt.verify(token)

      if (payload.type !== "user") {
        set.status = 401
        return { success: false, message: "Invalid token type" }
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          accounts: {
            select: {
              provider: true,
              type: true,
            },
          },
        },
      })

      if (!user) {
        set.status = 404
        return { success: false, message: "User not found" }
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          image: user.image,
          isVerified: user.isVerified,
          emailVerified: user.emailVerified,
          accounts: user.accounts,
        },
      }
    } catch (error) {
      set.status = 401
      return { success: false, message: "Invalid token" }
    }
  })

  // Logout
  .post("/logout", async ({ cookie, jwt, setCookie, set }) => {
    const token = cookie["auth-token"]

    if (token) {
      try {
        const payload = await jwt.verify(token)

        if (payload.type === "user") {
          await prisma.userSession.deleteMany({
            where: { sessionToken: token },
          })
        }
      } catch (error) {
        // Token invalid, continue with logout
      }
    }

    setCookie("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    })

    return { success: true, message: "Logged out successfully" }
  })

  // Admin login
  .post(
    "/admin/login",
    async ({ body, jwt, setCookie, set }) => {
      const { username, password } = body

      const admin = await prisma.admin.findFirst({
        where: {
          OR: [{ username }, { email: username }],
        },
        include: {
          roles: {
            include: {
              role: true,
              cafe: true,
            },
          },
        },
      })

      if (!admin || !admin.passwordHash || !admin.isActive) {
        set.status = 401
        return { success: false, message: "Invalid credentials" }
      }

      const isValidPassword = await comparePassword(password, admin.passwordHash)
      if (!isValidPassword) {
        set.status = 401
        return { success: false, message: "Invalid credentials" }
      }

      const token = await jwt.sign({
        adminId: admin.id,
        email: admin.email,
        type: "admin",
      })

      await prisma.adminSession.upsert({
        where: { sessionToken: token },
        create: {
          adminId: admin.id,
          sessionToken: token,
          ipAddress: "127.0.0.1",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        },
        update: {
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      })

      setCookie("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 1 day
      })

      return {
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName,
          roles: admin.roles.map((role) => ({
            id: role.id,
            name: role.role.name,
            permissions: role.role.permissions,
            cafe: role.cafe
              ? {
                  id: role.cafe.id,
                  name: role.cafe.name,
                  displayName: role.cafe.displayName,
                }
              : null,
          })),
        },
        token,
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    },
  )

  // Admin logout
  .post("/admin/logout", async ({ cookie, jwt, setCookie }) => {
    const token = cookie["admin-token"]

    if (token) {
      try {
        const payload = await jwt.verify(token)

        if (payload.type === "admin") {
          await prisma.adminSession.deleteMany({
            where: { sessionToken: token },
          })
        }
      } catch (error) {
        // Token invalid, continue with logout
      }
    }

    setCookie("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    })

    return { success: true, message: "Logged out successfully" }
  })
