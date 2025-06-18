import { fetch } from "undici"

const API_URL = process.env.API_URL || "http://localhost:3001"

async function testRegister() {
  console.log("Testing user registration...")

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
        phone: "0812345678",
      }),
    })

    const data = await response.json()
    console.log("Registration response:", data)
    return data.token
  } catch (error) {
    console.error("Registration failed:", error)
    return null
  }
}

async function testLogin() {
  console.log("Testing user login...")

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    })

    const data = await response.json()
    console.log("Login response:", data)
    return data.token
  } catch (error) {
    console.error("Login failed:", error)
    return null
  }
}

async function testGetMe(token: string) {
  console.log("Testing get current user...")

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Cookie: `auth-token=${token}`,
      },
    })

    const data = await response.json()
    console.log("Current user:", data)
  } catch (error) {
    console.error("Get current user failed:", error)
  }
}

async function testLogout(token: string) {
  console.log("Testing logout...")

  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: `auth-token=${token}`,
      },
    })

    const data = await response.json()
    console.log("Logout response:", data)
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

async function runTests() {
  // Test registration
  const registerToken = await testRegister()

  if (registerToken) {
    // Test get current user after registration
    await testGetMe(registerToken)

    // Test logout
    await testLogout(registerToken)
  }

  // Test login
  const loginToken = await testLogin()

  if (loginToken) {
    // Test get current user after login
    await testGetMe(loginToken)

    // Test logout
    await testLogout(loginToken)
  }
}

runTests().catch(console.error)
