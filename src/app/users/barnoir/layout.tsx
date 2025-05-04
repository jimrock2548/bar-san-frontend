// layout.tsx
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="navbar bg-black text-white border-b border-zinc-700 h-20 px-4">
        <div className="flex-1">
          <a href="../../" className="btn btn-ghost text-lg">
            ← Back
          </a>
        </div>

        <div className="flex-none text-center">
          <h1 className="text-2xl tracking-widest">N O I R</h1>
        </div>

        <div className="flex-1 justify-end items-center gap-2 flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
            />
          </svg>
          <span className="text-lg">Google</span>
        </div>
      </div>
      {children}
    </div>
  )
}
