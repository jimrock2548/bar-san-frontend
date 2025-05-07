'use client'
import React from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useRouter } from 'next/navigation' // Import useRouter


function HoverCard({ image, alt, text, bgColor, textColor, borderColor, link }: {
  image: string,
  alt: string,
  text: string,
  bgColor: string,
  textColor: string,
  borderColor: string,
  link: string // เพิ่ม prop สำหรับลิงก์
}) {
  const controls = useAnimation()

  const router = useRouter() // ใช้ useRouter
  return (
    <div className={`flex items-center justify-center h-screen 
      ${bgColor === 'black' ? '!bg-black' :
        bgColor === 'white' ? '!bg-white' :
        bgColor === 'neutral-900' ? '!bg-neutral-900' : ''
      }
      ${textColor === 'black' ? '!text-black' :
        textColor === 'white' ? '!text-white' :
        textColor === 'neutral-900' ? '!text-neutral-900' : ''
      }
        ${borderColor === 'black' ? '!border-black' :
          borderColor === 'white' ? '!border-white' :
          borderColor === 'neutral-900' ? '!border-neutral-900' : ''
      }
      `}>

      <motion.div
        className='relative w-[600px] h-[600px] overflow-hidden rounded-xl'
        onHoverStart={() => controls.start({ opacity: 1, y: 0 })}
        onHoverEnd={() => controls.start({ opacity: 0, y: 20 })}
        onClick={() => router.push(link)} // เพิ่มการเปลี่ยนเส้นทาง
      >
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={image}
            alt={alt}
            className='w-full h-full object-cover cursor-pointer'
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.4 }}
          className={`absolute bottom-15 left-1/2 transform -translate-x-1/2 w-fit btn btn-outline text-${textColor} bg-${bgColor} border-${borderColor} pointer-events-none `}
        >
          Reservation
        </motion.div>
      </motion.div>
    </div>
  )
}

function Page() {

  const router = useRouter() // ใช้ useRouter

  return (
    <div className='relative'>
      <button className='btn btn-outline text-black bg-white fixed top-4 right-4 z-10 w-30'
        onClick={() => router.push('/login')}>
        Login
      </button>
      <div className='grid grid-cols-2'>
        <HoverCard
          image='/Barsan.png'
          alt='Logo BARSAN'
          text='Welcome to Barsan'
          bgColor='white'
          textColor='black'
          borderColor='black'
          link='/barsan'
        />
        <HoverCard
          image='/Noir.png'
          alt='Logo NOIR'
          text='Discover NOIR'
          bgColor='black'
          textColor='white'
          borderColor='white'
          link='/users/barnoir/reservation'
        />
      </div>
    </div>
  )
}

export default Page