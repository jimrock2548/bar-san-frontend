
interface StatusProps {
  statusString: string
}

function Status({ statusString }: StatusProps) {
  const lowerStatus = statusString?.toLowerCase?.() || ""

  let colorClass = ""
  let textClass = "text-white"

  switch (lowerStatus) {
    case "confirmed":
      colorClass = "badge-success"
      break
    case "inactive":
      colorClass = "badge-neutral"
      break
    case "pending":
      colorClass = "badge-warning"
      break
    case "error":
      colorClass = "badge-error"
      break
    case "noir":
      colorClass = "bg-black"
      textClass = "text-white"
      break
    case "barsan":
      colorClass = "bg-white border border-gray-300"
      textClass = "text-black"
      break
    default:
      colorClass = "badge-info"
      break
  }

  return (
    <span className={`badge ${colorClass} ${textClass} capitalize`}>
      {statusString || "Unknown"}
    </span>
  )
}


export default Status