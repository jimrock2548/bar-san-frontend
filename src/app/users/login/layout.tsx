// layout.tsx หรือ layout.js
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm px-4">
        <div className="flex-1">
          <a href="../" className="btn btn-ghost text-lg">
            ← Back
          </a>
        </div>
      </div> 
      {children}
    </div>
  )
}
