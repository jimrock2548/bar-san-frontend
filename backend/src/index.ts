import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { swagger } from "@elysiajs/swagger"
import { rateLimit } from "./middleware/rate-limiter"
import { errorHandler } from "./middleware/error-handler"
import { logger } from "./middleware/logger"
import { authRoutes } from "./routes/auth"
import { reservationRoutes } from "./routes/reservations"
import { cafeRoutes } from "./routes/cafes"
import { userRoutes } from "./routes/users"
import { adminRoutes } from "./routes/admin"

// Import environment variable checker
import "./setup-env"

const app = new Elysia()
  .use(
    cors({
      origin: process.env.FRONTEND_URL || "*",
      credentials: true,
    }),
  )
  .use(swagger())
  .use(logger)
  .use(rateLimit)
  .use(errorHandler)
  .use(authRoutes)
  .use(reservationRoutes)
  .use(cafeRoutes)
  .use(userRoutes)
  .use(adminRoutes)
  .get("/", () => "BarSan API is running!")
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }))
  .listen(process.env.PORT || 3001)

console.log(`🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
