'use client'
import { defaultValueTypes } from 'framer-motion';
import React, { useState } from 'react'
import { DayPicker } from "react-day-picker";

function Page() {
  const [date, setDate] = useState<Date>();
  return (
    <main className="min-h-screen bg-black px-4 text-white">
      <div className="flex flex-col justify-center items-center text-center py-16 space-y-4">
        <h1 className="text-3xl ">Reservation</h1>
        <p className="font-abhaya text-lg">
          Please select the desired date, time, and table to make a reservation in advance
        </p>

        <div className='w-9/12 flex flex-col justify-center my-6'>
          {/* card member*/}
          <div className="card card-sm card-border border-zinc-700 bg-base-100 w-full text-white bg-gray-900">
            <div className="card-body font-abhaya ">
              <h2 className="card-title font-extralight">
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
                Welcome, Google User.</h2>
              <h2 className="card-title font-extralight">You are booking a table as a member. Your personal information will be used for this reservation.</h2>
            </div>
          </div>



          <div className='grid grid-cols-2 gap-3'>
            {/* Form inputs */}
            <div className='flex flex-col font-abhaya mt-8 space-y-6'>
              <div className='w-full'>
                <h1 className='text-white flex justify-start mb-2'>Full Name</h1>
                <input
                  type="text"
                  className="input w-full bg-gray-900 border border-zinc-700 rounded-none p-3"
                  placeholder="Jane doe"
                  value="Jane doe"
                  readOnly
                />
              </div>

              <div className='w-full'>
                <h1 className='text-white flex justify-start mb-2'>Phone number</h1>
                <input
                  type="tel"
                  className="input w-full bg-gray-900 border border-zinc-700 rounded-none p-3"
                  placeholder="123-456-789"
                  value="123-456-789"
                  readOnly
                />
              </div>

              <div className='w-full'>
                <h1 className='text-white flex justify-start mb-2'>Email</h1>
                <input
                  type="email"
                  className="input w-full bg-gray-900 border border-zinc-700 rounded-none p-3"
                  placeholder="example@email.com"
                  value="example@email.com"
                  readOnly
                />
              </div>

              <div className='w-full'>
                <h1 className='text-white flex justify-start mb-2'>Number of guests</h1>
                <select
                  value={1}
                  className="select select-lg w-full bg-gray-900 border border-zinc-700 rounded-none p-3 textarea-md">
                  <option disabled selected >Choose number of guests</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5+</option>
                </select>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                {/* Form carlendar */}
                <div className='w-full'>
                  <h1 className='text-white flex justify-start mb-2'>Date</h1>
                  <button popoverTarget="rdp-popover" className="input input-borde bg-gray-900 border-zinc-700" style={{ anchorName: "--rdp" } as React.CSSProperties}>
                    {date ? date.toLocaleDateString() : "Pick a date"}
                  </button>
                  <div popover="auto" id="rdp-popover" className="dropdown " style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
                    <DayPicker className="react-day-picker  bg-gray-900 border-zinc-700" mode="single" selected={date} onSelect={setDate} />
                  </div>
                </div>
                <div className='w-full'>
                  <h1 className='text-white flex justify-start mb-2'>Choose Time</h1>
                  <select
                    value={1}
                    className="select  w-full bg-gray-900 border border-zinc-700 rounded p-3 textarea-md">
                    <option disabled selected >Choose time</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5+</option>
                  </select>
                </div>

              </div>

            

            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

export default Page