"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authenticateAdmin } from "@/app/lib/mockData"
import axios from "axios"

export default function Page() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [regisEmail, setRegisEmail] = useState("")
  const [regisPassword, setRegisPassword] = useState("")
  const [regisConfirmPassword, setRegisConfirmPassword] = useState("")

  const router = useRouter()

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)

    setTimeout(() => {
      localStorage.setItem(
        "users",
        JSON.stringify({
          id: "1",
          name: "TestNameGoogle",
          email: "example@google.test",
          phone: "123456789",
          isLoggedIn: true,
        }),
      )
      setIsGoogleLoading(false)
      router.push("../")
    }, 2000)
  }
    const handleAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const response = await axios.post('http://localhost:5000/auth/admin/login', {
          username: email,
          password: password,
        });

        if (response.data.token) {
          localStorage.setItem('adminUser', JSON.stringify(response.data));
          setIsLoading(false);
          router.push('/admin/dashboard');
        } else {
          setIsLoading(false);
          // Handle error
        }
      } catch (error) {
        setIsLoading(false);
        // Handle error
      }
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check if it's an admin login first
    const adminAccount = authenticateAdmin(email, password)

    if (adminAccount) {
      // Admin login successful
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          id: adminAccount.id,
          name: adminAccount.name,
          email: adminAccount.email,
          role: adminAccount.role,
          cafes: adminAccount.cafes.map((cafeName) => ({
            id: cafeName === "BarSan" ? "cafe-1" : "cafe-2",
            name: cafeName,
            displayName: cafeName === "BarSan" ? "BarSan." : "NOIR",
          })),
          isLoggedIn: true,
        }),
      )
      setIsLoading(false)
      router.push("/admin/dashboard")
      return
    }

    // Regular user login (existing logic)
    console.log("Logging in with", email, password)
    setTimeout(() => {
      localStorage.setItem(
        "users",
        JSON.stringify({
          id: "2",
          name: "TestNameEmail",
          email: email,
          phone: "987654321",
          isLoggedIn: true,
        }),
      )
      setIsLoading(false)
      router.push("../")
    }, 2000)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem(
      " users",
      JSON.stringify({
        id: "3",
        name,
        email,
        phone,
        isLoggedin: true,
      }),
    )
    router.push("../")
  }

  const handleGuestContinue = () => {
    localStorage.setItem(
      "users",
      JSON.stringify({
        id: "3",
        name: "",
        email: "",
        phone: "",
        isLoggedIn: false,
      }),
    )
    router.push("../")
  }

  return (
    <main className="flex-1 py-16 container mx-auto px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl  font-bold mb-2 text-[#1a1814]">Login</h1>
          <p className="text-[#8a7356]">Log in to book a table faster.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-3">
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={handleGoogleLogin}
            className="w-full h-11 flex items-center justify-center gap-2 mb-3 border-b-gray-400 hover:bg-gray-50"
          >
            {isGoogleLoading ? (
              <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 186.69 190.5"
                className="h-4 w-4"
              >
                <g transform="translate(1184.583 765.171)">
                  <path
                    d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
                    fill="#4285f4"
                  />
                  <path
                    d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
                    fill="#34a853"
                  />
                  <path
                    d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
                    fill="#fbbc05"
                  />
                  <path
                    d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
                    fill="#ea4335"
                  />
                </g>
              </svg>
            )}
            <span>{isGoogleLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย Google"}</span>
          </button>

          <div className="flex items-center mb-3">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-3 text-xs text-gray-500 whitespace-nowrap">Or sign in with email</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* name of each tab group should be unique */}
          <div className="tabs tabs-box">
            <input type="radio" name="my_tabs_1" className="tab w-1/2" aria-label="Login" defaultChecked />
            <div className="tab-content">
              <form onSubmit={handleAdminLogin}>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email</legend>
                  <input
                    type="input"
                    className="input w-full"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend ">Password</legend>
                  <input
                    type="password"
                    className="input w-full"
                    placeholder="Type your password here"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </fieldset>
                <div className="my-6" />
                <button className="btn btn-neutral w-full" type="submit">
                  Login
                </button>
              </form>
            </div>
            <input type="radio" name="my_tabs_1" className="tab w-1/2" aria-label="Register" />
            <div className="tab-content">
              <form onSubmit={handleRegister}>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Name</legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Type your name here"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Phone number</legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Type your phone number here"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email</legend>
                  <input
                    type="email"
                    className="input w-full"
                    placeholder="Type your email here"
                    value={regisEmail}
                    onChange={(e) => setRegisEmail(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend ">Password</legend>
                  <input
                    type="password"
                    className="input w-full"
                    placeholder="password"
                    value={regisPassword}
                    onChange={(e) => setRegisPassword(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend ">Confirm password</legend>
                  <input
                    type="password"
                    className="input w-full"
                    placeholder="Confirm password"
                    value={regisConfirmPassword}
                    onChange={(e) => setRegisConfirmPassword(e.target.value)}
                    required
                  />
                </fieldset>
                <div className="my-6" />
                <button className="btn btn-neutral w-full" type="submit">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-4 text-[#8a7356]">หรือ</p>
          <button className="w-full btn btn-outline" onClick={handleGuestContinue}>
            ดำเนินการต่อในฐานะผู้ใช้ทั่วไป
          </button>
        </div>

        {/* Test Admin Accounts */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">🧪 Test Admin Accounts</h3>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2 font-medium text-gray-600 border-b pb-2">
              <span>Username</span>
              <span>Password</span>
              <span>Role</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-mono">superadmin</span>
              <span className="font-mono">123456</span>
              <span className="text-purple-600">Super Admin</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-mono">admin.barsan</span>
              <span className="font-mono">123456</span>
              <span className="text-blue-600">Admin (BarSan)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-mono">admin.noir</span>
              <span className="font-mono">123456</span>
              <span className="text-blue-600">Admin (NOIR)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-mono">staff.barsan</span>
              <span className="font-mono">123456</span>
              <span className="text-green-600">Staff</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-mono">viewer.test</span>
              <span className="font-mono">123456</span>
              <span className="text-yellow-600">Viewer</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">💡 ใช้ username และ password ข้างต้นเพื่อทดสอบระบบ Admin</p>
        </div>
      </div>
    </main>
  )
}
