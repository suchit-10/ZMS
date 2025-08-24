type Activity = {
  animal: string
  species?: string
  action: string
  timeAgo: string
  staff: string
  photo?: string
  type: 'feeding' | 'medical' | 'observation' | 'vaccination' | 'measurement' | 'other'
}

const colorFor = (t: Activity['type']) => {
  switch (t) {
    case 'feeding':
      return 'bg-green-100 text-green-700'
    case 'medical':
      return 'bg-blue-100 text-blue-700'
    case 'observation':
      return 'bg-blue-100 text-blue-700'
    case 'vaccination':
      return 'bg-yellow-100 text-yellow-800'
    case 'measurement':
      return 'bg-purple-100 text-purple-700'
    case 'other':
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function ActivityItem({ animal, species, action, timeAgo, staff, photo, type }: Activity) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
      <img src={photo ?? '/images/logo-64.svg'} alt="animal" className="w-12 h-12 rounded-md object-cover flex-shrink-0" style={{ maxWidth: 48 }} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 break-words">{animal}{species ? ` (${species})` : ''} - <span className="font-normal">{action}</span></p>
            <p className="text-xs text-gray-500 mt-1">{timeAgo} · {staff}</p>
          </div>
          <div className={`px-2 py-1 text-xs font-medium rounded ${colorFor(type)}`}>{type}</div>
        </div>
      </div>
    </div>
  )
}
