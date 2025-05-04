import React from 'react'
import { Check } from 'lucide-react'

function Page() {
  return ( 
    <div className='bg-black min-h-screen text-white flex flex-col items-center'>
      {/* check correct */}
      <div className='mt-10 mb-5 bg-green-200 rounded-full w-25 h-25 flex items-center justify-center'>
       <Check className="h-15 w-15 text-green-600" />
      </div>
    {/* Reservation message */}
    <h1 className='text-3xl mb-2'>Reservation Successful</h1>
    <h1 className='font-abhaya mb-7'>Thank you for your booking. We have received your reservation details</h1>
    {/**  Card  */}
      <div className='w-5/12'>
        <div className='border border-zinc-700  rounded-t-2xl bg-gray-900'>
          <div className='flex justify-between px-8 mt-8'>
          <h1 className='text-2xl'>N O I R</h1>
          <h1 className='font-abhaya text-xl text-amber-100'>Status</h1>
          </div>
          <div className='flex justify-between font-abhaya text-xl px-8 mb-8 mt-1'>
          <h1 className='text-amber-100'>Reservation Number : RSV6859</h1>
          <h1 className=''>Status</h1>
          </div>
        </div>
      </div>
      <div className='w-5/12 font-abhaya text-xl'>
        <div className='border border-zinc-700 p-10 rounded-b-2xl'>
          <div className='flex justify-between'>
          <h1 className=''>N O I R</h1>
          <h1 className=' text-amber-100'>Status</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page