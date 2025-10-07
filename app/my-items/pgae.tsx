// app/my-items/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Loader, Trash2, CheckCircle, X } from 'lucide-react'
import ItemCard from '@/components/ItemCard'

interface Item {
  id: string
  title: string
  description: string
  category: string
  location: string
  date: string
  status: string
  resolved: boolean
}

export default function MyItemsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchUserItems(parsedUser.id)
  }, [router])

  const fetchUserItems = async (userId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user/items?userId=${userId}`)
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkResolved = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved: true }),
      })

      if (response.ok) {
        // Update local state
        setItems(items.map(item => 
          item.id === itemId ? { ...item, resolved: true } : item
        ))
      }
    } catch (error) {
      console.error('Error marking as resolved:', error)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setDeletingId(itemId)
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId))
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Items</h1>
          <p className="text-gray-600">Manage your reported lost and found items</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {items.length}
            </div>
            <div className="text-gray-600">Total Reports</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {items.filter(item => item.resolved).length}
            </div>
            <div className="text-gray-600">Resolved</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {items.filter(item => !item.resolved).length}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
        </div>

        {/* Items List */}
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Item Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
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
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700 flex items-center gap-1">
                          <CheckCircle size={14} />
                          RESOLVED
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>

                    <Link href={`/item/${item.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="capitalize font-medium">{item.category}</span>
                      <span>•</span>
                      <span>{item.location}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:min-w-[200px]">
                    <Link
                      href={`/item/${item.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-center transition"
                    >
                      View Details
                    </Link>

                    {!item.resolved && (
                      <button
                        onClick={() => handleMarkResolved(item.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Mark Resolved
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                      {deletingId === item.id ? (
                        <>
                          <Loader className="animate-spin" size={18} />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={18} />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Items Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't reported any lost or found items
            </p>
            <Link
              href="/report"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Report an Item
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}