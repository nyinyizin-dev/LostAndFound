// app/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Search, AlertCircle, Package, TrendingUp, Users, CheckCircle } from 'lucide-react'
import ItemCard from '@/components/ItemCard'

export const dynamic = 'force-dynamic'

async function getRecentItems() {
  try {
    const items = await prisma.item.findMany({
      where: { resolved: false },
      orderBy: { createdAt: 'desc' },
      take: 6
    })
    console.log(`Found ${items.length} recent items`)
    return items
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

async function getStats() {
  try {
    const [totalItems, lostItems, foundItems, resolvedItems] = await Promise.all([
      prisma.item.count(),
      prisma.item.count({ where: { status: 'lost', resolved: false } }),
      prisma.item.count({ where: { status: 'found', resolved: false } }),
      prisma.item.count({ where: { resolved: true } })
    ])
    return { totalItems, lostItems, foundItems, resolvedItems }
  } catch (error) {
    console.error('Database error:', error)
    return { totalItems: 0, lostItems: 0, foundItems: 0, resolvedItems: 0 }
  }
}

export default async function Home() {
  const recentItems = await getRecentItems()
  const stats = await getStats()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Lost Something? Found Something?
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100">
              Help reunite people with their belongings. Report lost or found items and connect with your community.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/report?type=lost"
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
              >
                <AlertCircle size={24} />
                I Lost Something
              </Link>
              <Link
                href="/report?type=found"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
              >
                <Package size={24} />
                I Found Something
              </Link>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <Link
                href="/browse"
                className="flex items-center gap-3 bg-white text-gray-800 p-4 rounded-xl shadow-xl hover:shadow-2xl transition-all"
              >
                <Search className="text-gray-400" size={24} />
                <span className="text-gray-500 text-lg">Search for lost or found items...</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="text-blue-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalItems}</div>
              <div className="text-gray-600 text-sm">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.lostItems}</div>
              <div className="text-gray-600 text-sm">Lost Items</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Package className="text-green-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.foundItems}</div>
              <div className="text-gray-600 text-sm">Found Items</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="text-purple-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.resolvedItems}</div>
              <div className="text-gray-600 text-sm">Reunited</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Items Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recent Reports</h2>
          <Link
            href="/browse"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
          >
            View All
            <Search size={20} />
          </Link>
        </div>

        {recentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No items reported yet</p>
            <p className="text-gray-400 mt-2">Be the first to report a lost or found item!</p>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Report an Item</h3>
              <p className="text-gray-600">
                Found something or lost something? Create a detailed report with description, location, and contact info.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Search & Browse</h3>
              <p className="text-gray-600">
                Browse through reported items or use our search feature to find what you're looking for.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Connect & Reunite</h3>
              <p className="text-gray-600">
                Contact the person who reported the item and arrange to reunite with your belongings!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-600' },
            { name: 'Clothing', icon: '👕', color: 'bg-green-100 text-green-600' },
            { name: 'Accessories', icon: '👜', color: 'bg-purple-100 text-purple-600' },
            { name: 'Documents', icon: '📄', color: 'bg-red-100 text-red-600' },
            { name: 'Keys', icon: '🔑', color: 'bg-yellow-100 text-yellow-600' },
            { name: 'Bags', icon: '🎒', color: 'bg-indigo-100 text-indigo-600' },
            { name: 'Jewelry', icon: '💍', color: 'bg-pink-100 text-pink-600' },
            { name: 'Pets', icon: '🐾', color: 'bg-orange-100 text-orange-600' },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/browse?category=${category.name.toLowerCase()}`}
              className={`${category.color} p-6 rounded-xl text-center hover:shadow-lg transition-all transform hover:scale-105`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-semibold">{category.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}