"use client"

import { X } from "lucide-react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import StoreBadge from "./storeBadge"

interface ReservationDetailModalProps {
  reservation: {
    id: string
    cafe: string
    reservation_number: string
    date: string
    time: string
    guests: number
    zone: string
    guest_name: string
    guest_email: string
    guest_phone: string
  }
  onClose: () => void
}
export default function ReservationDetailModal({ reservation, onClose }: ReservationDetailModalProps) {
  const formattedDate = format(new Date(reservation.date), "EEEE, MMMM d, yyyy", { locale: th })
  
  return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Reservations Detail</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-6 flex justify-between">
            <p className="text-gray-500">Reservation Number: {reservation.reservation_number}</p>
            <StoreBadge storeName={reservation.cafe} />
          </div>
             <div className="divider"></div>
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Time</p>
              <p className="font-medium">{reservation.time}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Number of guest</p>
              <p className="font-medium">{reservation.guests} people</p>
            </div>
            
            <div>
              <p className="text-gray-500">Zone</p>
              <p className="font-medium">{reservation.zone}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-500">Booking Name</p>
            <p className="font-bold">{reservation.guest_name}</p>
            
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{reservation.guest_email}</p>
            
            <p className="text-gray-500">Phone number</p>
            <p className="font-medium">{reservation.guest_phone}</p>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button 
              onClick={onClose}
              className="btn btn-outline"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}