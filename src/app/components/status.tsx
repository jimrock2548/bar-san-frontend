interface StatusProps {
  statusString: string
}

function Status({ statusString }: StatusProps) {
  let colorClass = ''

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
    default:
      colorClass = 'badge-info'
      break
  }

  return (
    <span className={`badge ${colorClass} text-white capitalize`}>
      {statusString}
    </span>
  )
}

export default Status
