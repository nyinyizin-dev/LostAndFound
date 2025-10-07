// app/item/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Tag, User, Mail, Phone, ArrowLeft, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getItem(id: string) {
  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
    return item
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Browse
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with Status Badges */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
                  item.status === 'lost'
                    ? 'bg-red-500'
                    : 'bg-green-500'
                }`}
              >
                {item.status}
              </span>
              {item.resolved && (
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-white text-green-600 flex items-center gap-2">
                  <CheckCircle size={16} />
                  RESOLVED
                </span>
              )}
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 capitalize">
                {item.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{item.title}</h1>
            <p className="text-blue-100">
              Reported on {new Date(item.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="p-8">
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    Date {item.status === 'lost' ? 'Lost' : 'Found'}
                  </p>
                  <p className="text-lg text-gray-900 font-medium">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MapPin className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Location</p>
                  <p className="text-lg text-gray-900 font-medium">{item.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Tag className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Category</p>
                  <p className="text-lg text-gray-900 font-medium capitalize">{item.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <User className="text-orange-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Reported By</p>
                  <p className="text-lg text-gray-900 font-medium">{item.contactName}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            {!item.resolved && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="text-blue-600" size={28} />
                  Contact Information
                </h2>
                <p className="text-gray-600 mb-6">
                  {item.status === 'lost' 
                    ? 'If you have found this item, please contact the owner:'
                    : 'If this is your item, please contact the finder:'}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Name</p>
                      <p className="text-lg text-gray-900 font-medium">{item.contactName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Mail className="text-green-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500">Email</p>
                      <a
                        href={`mailto:${item.contactEmail}`}
                        className="text-lg text-blue-600 hover:text-blue-700 font-medium hover:underline break-all"
                      >
                        {item.contactEmail}
                      </a>
                    </div>
                  </div>

                  {item.contactPhone && (
                    <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Phone className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Phone</p>
                        <a
                          href={`tel:${item.contactPhone}`}
                          className="text-lg text-blue-600 hover:text-blue-700 font-medium hover:underline"
                        >
                          {item.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Button */}
                <div className="mt-6">
                  <a
                    href={`mailto:${item.contactEmail}?subject=Regarding ${item.status} item: ${item.title}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02]"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            )}

            {/* Resolved Message */}
            {item.resolved && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
                <h3 className="text-2xl font-bold text-green-900 mb-2">
                  This Item Has Been Reunited! 🎉
                </h3>
                <p className="text-green-700">
                  The owner and finder have successfully connected.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Report Date */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Last updated: {new Date(item.updatedAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}