// app/browse/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Loader, Package } from 'lucide-react'
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

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [filters])

  const fetchItems = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)

    try {
      const response = await fetch(`/api/items?${params}`)
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value })
  }

  const clearFilters = () => {
    setFilters({ search: '', status: '', category: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Items</h1>
          <p className="text-gray-600">Search through reported lost and found items</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title, description, or location..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            <Filter size={20} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Items</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="documents">Documents</option>
                  <option value="keys">Keys</option>
                  <option value="bags">Bags</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="pets">Pets</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full p-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {loading ? (
              'Loading...'
            ) : (
              <>
                <span className="font-bold text-gray-900">{items.length}</span> items found
              </>
            )}
          </p>
          
          {/* Active Filters */}
          {(filters.status || filters.category || filters.search) && (
            <div className="flex items-center gap-2 flex-wrap">
              {filters.status && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Status: {filters.status}
                </span>
              )}
              {filters.category && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm capitalize">
                  {filters.category}
                </span>
              )}
              {filters.search && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Search: "{filters.search}"
                </span>
              )}
            </div>
          )}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-blue-600" size={48} />
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Items Found</h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.status || filters.category
                ? 'Try adjusting your filters or search terms'
                : 'No items have been reported yet'}
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}