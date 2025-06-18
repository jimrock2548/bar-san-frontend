// Check required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "FRONTEND_URL", "PORT"]

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnvVars.join(", ")}`)
  console.error("Please set these variables in your .env file")
  process.exit(1)
}

// Set default values for optional environment variables
if (!process.env.RATE_LIMIT_WINDOW) {
  process.env.RATE_LIMIT_WINDOW = "60000" // 1 minute in milliseconds
}

if (!process.env.RATE_LIMIT_MAX) {
  process.env.RATE_LIMIT_MAX = "100" // 100 requests per window
}

console.log("✅ Environment variables validated successfully")
