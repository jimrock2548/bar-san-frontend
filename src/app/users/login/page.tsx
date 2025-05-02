'use client'
import React from 'react'

export default function Page() {
  return (
    <div className="min-h-screen grid grid-row items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100 border border-gray-700">
        <div className="card-body">
        <h2 className="text-3xl font-semibold text-center mb-6 tracking-wide">
            เข้าสู่ระบบ
          </h2>
                <form>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">อีเมล</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered bg-black text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">รหัสผ่าน</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered bg-black text-white placeholder-gray-400"
                required
              />
            </div>

            <button className="btn btn-outline btn-primary w-full tracking-wide">
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="text-center mt-4 text-sm opacity-60">
            ยังไม่มีบัญชี? <a href="/register" className="link link-hover link-primary">สมัครสมาชิก</a>
          </div>
        </div>
      </div>
    </div>
  )
}
