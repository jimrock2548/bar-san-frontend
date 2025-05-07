// layout.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'


export default function Layout({ children }: { children: React.ReactNode }) {

  const  [name,setName] = useState<string>("")

  useEffect(() => {
    const storedUser = localStorage.getItem('users')

    if(storedUser){
      try{
        const user = JSON.parse(storedUser)
        setName(user.name)
      }catch(err){
        console.log(err)
      }
    }
  },[])

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
          <UserRound></UserRound>
          <span className="text-lg">{name ?? 'Guest'}</span>
        </div>
      </div>
      {children}
    </div>
  )
}
