interface StatusProps {
  statusString: string
}

function Status({ statusString }: StatusProps) {
  let colorClass = ''
  let textClass = 'text-white' // Default text color

  switch (statusString.toLowerCase()) {
    case 'confirmed':
      colorClass = 'badge-success'
      break
    case 'inactive':
      colorClass = 'badge-neutral'
      break
    case 'pending':
      colorClass = 'badge-warning'
      break
    case 'error':
      colorClass = 'badge-error'
      break
    case 'noir':
      colorClass = 'bg-black' // Black background
      textClass = 'text-white' // White text
      break
    case 'barsan':
      colorClass = 'bg-white border border-gray-300' // White background with border
      textClass = 'text-black' // Black text
      break
    default:
      colorClass = 'badge-info'
      break
  }

  return (
    <span className={`badge ${colorClass} ${textClass} capitalize`}>
      {statusString}
    </span>
  )
}

export default Status