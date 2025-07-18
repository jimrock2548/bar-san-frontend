interface StoreBadgeProps {
  storeName: string
}

function StoreBadge({ storeName }: StoreBadgeProps) {
  let bgClass = ''
  let textClass = ''
  let borderClass = ''
  let displayName = storeName

  const lowerStore = storeName?.toLowerCase?.() || ""
  switch (lowerStore) {
    case 'barsan':
      bgClass = 'bg-white'
      textClass = 'text-black'
      borderClass = 'border border-black'
      displayName = 'BarSan'
      break
    case 'noir':
      bgClass = 'bg-black'
      textClass = 'text-white'
      borderClass = ''
      displayName = 'NOIR'
      break
    default:
      bgClass = 'bg-gray-200'
      textClass = 'text-black'
      borderClass = 'border'
      break
  }

  return (
    <span className={`badge ${bgClass} ${textClass} ${borderClass} w-20`}>
      {displayName}
    </span>
  )
}

export default StoreBadge
