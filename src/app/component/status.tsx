import React from 'react'

interface StatusProps {
  statusString: string
}
function Status({ statusString }: StatusProps) {

let bgColor =''
let textColor = ''

switch (statusString) {
  case 'Confirmed':
    bgColor = 'bg-green-200'
    textColor = 'text-green-950'
    break
  case 'Inactive':
    bgColor = 'bg-gray-200'
    textColor = 'text-gray-8a00'
    break
  case 'Pending':
    bgColor = 'bg-yellow-200'
    textColor = 'text-yellow-800'
    break
  case 'Error':
    bgColor = 'bg-red-200'
    textColor = 'text-red-800'
    break
  default:
    bgColor = 'bg-blue-200'
    textColor = 'text-blue-800'
    break
}


  return (
    <div className={`rounded-full flex items-center justify-center w-fit ${bgColor}`}>
      <h1 className={`text-lg mx-5 ${textColor}`}>{statusString}</h1>
    </div>
  )
}

export default Status