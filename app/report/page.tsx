// app/report/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, Package, Loader } from 'lucide-react'

export default function ReportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemType = searchParams.get('type') || 'lost'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    status: itemType,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Auto-fill user data if logged in
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setFormData(prev => ({
        ...prev,
        contactName: userData.name,
        contactEmail: userData.email,
        contactPhone: userData.phone || '',
      }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = localStorage.getItem('user')
      const userId = user ? JSON.parse(user).id : null

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/item/${data.id}`)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit report')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {formData.status === 'lost' ? (
              <AlertCircle className="text-red-600" size={48} />
            ) : (
              <Package className="text-green-600" size={48} />
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Report {formData.status === 'lost' ? 'Lost' : 'Found'} Item
          </h1>
          <p className="text-gray-600">
            Fill in the details below to help reunite items with their owners
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item Type Toggle */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Item Status *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'lost' })}
                  className={`p-4 rounded-lg border-2 font-semibold transition ${
                    formData.status === 'lost'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <AlertCircle className="mx-auto mb-2" size={24} />
                  Lost Item
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'found' })}
                  className={`p-4 rounded-lg border-2 font-semibold transition ${
                    formData.status === 'found'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Package className="mx-auto mb-2" size={24} />
                  Found Item
                </button>
              </div>
            </div>

            {/* Item Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Blue iPhone 13 Pro"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Provide as much detail as possible (color, brand, distinguishing features, condition, etc.)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                The more details you provide, the easier it will be to identify the item.
              </p>
            </div>

            {/* Category and Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Date {formData.status === 'lost' ? 'Lost' : 'Found'} *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Central Park, near the fountain / Starbucks on Main Street"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Be as specific as possible about the location.
              </p>
            </div>

            {/* Contact Information Section */}
            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-sm text-gray-600 mb-6">
                This information will be displayed so people can contact you about the item.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}