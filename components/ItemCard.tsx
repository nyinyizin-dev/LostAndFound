// components/ItemCard.tsx
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'

interface ItemCardProps {
  item: {
    id: string
    title: string
    description: string
    category: string
    location: string
    date: string
    status: string
    resolved: boolean
  }
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Link
      href={`/item/${item.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-300"
    >
      {/* Status Badge */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            item.status === 'lost'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {item.status}
        </span>
        {item.resolved && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700">
            RESOLVED
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
        {item.description}
      </p>

      {/* Category */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium capitalize">
          {item.category}
        </span>
      </div>

      {/* Location & Date */}
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span>
            {new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </Link>
  )
}