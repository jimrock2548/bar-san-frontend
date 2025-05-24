import {SquarePen ,Trash2 ,LogIn , Plus} from 'lucide-react'
interface activityProps {
  activityString: string
}

function Activity({ activityString }: activityProps) {
  let colorClass = ''
  let textClass = 'text-white' // Default text color

  switch (activityString.toLowerCase()) {
    case 'edit':
      colorClass = 'badge-warning'
      break
    case 'delete':
      colorClass = 'badge-error'
      textClass = 'text-white' // White text
      break
    case 'create':
      colorClass = 'badge-success'
      break
    case 'login':
      colorClass = 'badge-info'
        textClass = ' badge-outline' 
      break
    case 'logout':  
      colorClass = 'badge-neutral'
      textClass = ' badge-outline' 
      break
    default:
      colorClass = 'badge-info'
      break
  }

  return (
    <span className={`badge ${colorClass} ${textClass} capitalize`}>
      {activityString}
    </span>
  )
}

export default Activity