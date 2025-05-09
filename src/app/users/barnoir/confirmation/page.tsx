import React from 'react'
import { Check, Calendar, Clock, UserRound, MapPin } from 'lucide-react'
import Status from '@/app/components/status'

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
            <Status statusString='Confirmed'></Status>
          </div>
        </div>
        <div className='border border-zinc-700  rounded-b-2xl font-abhaya'>
          <div className='flex justify-between w-12/13'>
            <div className='px-8 mt-8'>
              <div className='flex gap-3 text-gray-400 space-y-2'>
                <Calendar className="h-6 w-6" />
                <h1 className='text-xl'>Date</h1>
              </div>
              <h1 className='text-xl mb-10'>Friday, April 25, 2025</h1>

              <div className='flex gap-3 text-gray-400 space-y-2'>
                <Clock className="h-6 w-6" />
                <h1 className='text-xl'>Time</h1>
              </div>
              <h1 className='text-xl'>8 PM</h1>
            </div>

            <div className='px-8 mt-8'>
              <div className='flex gap-3 text-gray-400 space-y-2'>
                <UserRound className="h-6 w-6" />
                <h1 className='text-xl'>Number of guest</h1>
              </div>
              <h1 className='text-xl mb-10'>2 people</h1>
              <div className='flex gap-3 text-gray-400 space-y-2'>
                <MapPin className="h-6 w-6" />
                <h1 className='text-xl'>Zone</h1>
              </div>
              <h1 className='text-xl'>BarCounter</h1>
            </div>
          </div>

          <div className='px-8 space-y-5'>
            <hr className='border-t-zinc-600 my-7 w-full' />
            <div className='gap-3 '>
              <h1 className='text-gray-400'>Booking Name</h1>
              <h1 className='text-xl'>Jonh doe</h1>
            </div>
            <div className='gap-3 '>
              <h1 className='text-gray-400'>Email</h1>
              <h1 className='text-xl'>example@example.com</h1>
            </div>
            <div className='gap-3 '>
              <h1 className='text-gray-400'>Phone Number</h1>
              <h1 className='text-xl'>123456789</h1>
            </div>
            <hr className='border-t-zinc-600 my-7 w-full' />
            <div className='text-gray-400 my-8 '>
                <h1>Important Note:</h1>
                <div className='mx-3'>
                    <h1>• Please arrive 5–10 minutes before your reservation time.</h1>
                    <h1>• Your reservation will be automatically canceled if you are more than 15 minutes late.</h1>
                    <h1>• If you wish to cancel, please notify us at least 2 hours in advance.</h1> 
                </div>
            </div>
          </div>
          
        </div>

        <div className='flex items-center justify-center mx-25 my-8'>
        <div className='btn w-full text-red-700'>
             Cancel Reservation
      </div>
        </div>

      </div>

    </div>
  )
}

export default Page