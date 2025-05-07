'use client'
import React, { useState } from 'react'
import { DayPicker } from "react-day-picker";
import {UserRound} from "lucide-react"

type Option = {
  id: string;
  title: string;
  description: string;
};

function Page() {
  const [date, setDate] = useState<Date>();
  const [selectedOption, setSelectedOption] = useState<string>('');

  const options: Option[] = [
    {
      id: 'counter',
      title: 'Bar Counter',
      description: 'Suitable for 1–2 guests, seated at the bar counter',
    },
    {
      id: 'couple',
      title: 'Couple Table',
      description: 'Ideal for 2 guests, providing a comfortable setting',
    },
    {
      id: 'large',
      title: 'Large Group Table  ( tables can be separated )',
      description: 'Suitable for 4–8 guests, seated in the central area  of the venue',
    }
  ]

  const handleOptionChange = (id: string) => {
    setSelectedOption(id);
  };

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
              <UserRound></UserRound>
                Welcome, Google User.</h2>
              <h2 className="card-title font-extralight">You are booking a table as a member. Your personal information will be used for this reservation.</h2>
            </div>
          </div>



          <div className='grid grid-cols-2 gap-5'>
            {/* left side */}
            <div className='flex flex-col font-abhaya mt-8 space-y-6'>
              {/* Form inputs */}
              <div className='w-full'>
                <h1 className='text-white flex justify-start mb-2'>Full Name</h1>
                <input
                  type="text"
                  className="input w-full bg-gray-900 border border-zinc-700 rounded p-3"
                  placeholder="Jane doe"
                  value="Jane doe"
                  readOnly
                />
              </div>

              <div className='w-full'>
                <h1 className='text-white flex justify-start mb-2'>Phone number</h1>
                <input
                  type="tel"
                  className="input w-full bg-gray-900 border border-zinc-700 rounded p-3"
                  placeholder="123-456-789"
                  value="123-456-789"
                  readOnly
                />
              </div>

              <div className='w-full'>
                <h1 className='text-white flex justify-start mb-2'>Email</h1>
                <input
                  type="email"
                  className="input w-full bg-gray-900 border border-zinc-700 rounded p-3"
                  placeholder="example@email.com"
                  value="example@email.com"
                  readOnly
                />
              </div>

              <div className='w-full'>
                <h1 className='text-white flex justify-start mb-2'>Number of guests</h1>
                <select
                  value={1}
                  className="select select-lg w-full bg-gray-900 border border-zinc-700 rounded p-3 textarea-md">
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
            {/* right side */}
            <div className='flex flex-col font-abhaya mt-8 items-start w-full space-y-3'>
              {/* bar map */}
              <h1 className='text-2xl'>Choose zone</h1>
              <div className='w-full border border-zinc-700  rounded-2xl p-6 '>
                <div className='flex flex-col items-start w-full space-y-2'>
                  <h1 className='text-lg mb-4'>Map</h1>
                  <div className='w-full overflow-auto flex justify-center  bg-gray-900 '>
                    <img
                      src="/mapNoir.png"
                      alt="map"
                      className="max-w-full h-auto object-contain "
                    />
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-900 border-2 border-gray-700 rounded-full"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-900 bg-opacity-20 border-2 border-red-900 rounded-full"></div>
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* choose zone */}
              {options.map((option) => (
                <div
                  key={option.id}
                  className={`w-full border rounded-2xl p-6 flex items-start hover:bg-gray-900 cursor-pointer ${selectedOption === option.id ? 'border-green-900 bg-green-950' : 'border-zinc-700'
                    }`}
                  onClick={() => handleOptionChange(option.id)}
                >
                  <input
                    type="radio"
                    id={option.id}
                    name="seatingOptions"
                    checked={selectedOption === option.id}
                    onChange={() => handleOptionChange(option.id)}
                    className="mt-1 mr-4 h-5 w-5 text-blue-600 flex-none cursor-pointer"
                  />
                  <div className="flex flex-col items-start">
                    <label htmlFor={option.id} className="text-lg cursor-pointer">
                      {option.title}
                    </label>
                    <p className="text-gray-500">{option.description}</p>
                  </div>
                </div>
              ))}
              {/* Note */}
              <div className=" flex flex-col items-start space-y-3 w-full">
                <div className=" text-white ">Note</div>
                <textarea className="textarea h-24 bg-gray-900 w-full" placeholder="Bio"></textarea>
              </div>
            </div>
          </div>
          <hr className="border-t border-zinc-700 my-10" />
          <div className="flex flex-col  font-abhaya w-10/12 space-y-4 ">
            <div className='flex justify-between'>
              <div className='text-2xl'>Reservation Summary</div>
              <div className='text-xl'>Date -</div>
            </div>
            <div className='flex justify-between'>
              <div className='text-lg text-gray-400'>Please review the information before confirming your booking</div>
              <div className='text-xl'>Table -</div>
            </div>
          </div>
          <a href='./confirmation' 
          className='btn bg-white my-6 text-lg'
          >Confirm Reservation</a>
          <div className='text-xl text-gray-400 flex items-center font-abhaya'>Please arrive at the restaurant before 08.00 PM .  If you wish to cancel, kindly contact us at least 40 minutes in advance.</div>
        </div>
      </div>
    </main>
  )
}

export default Page