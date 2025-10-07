// app/api/items/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  try {
    // Build the where clause
    const whereClause: any = {
      resolved: false,
    }

    // Add status filter
    if (status) {
      whereClause.status = status
    }

    // Add category filter
    if (category) {
      whereClause.category = category
    }

    // Add search filter - MongoDB requires different syntax
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    console.log('Query filters:', JSON.stringify(whereClause, null, 2))

    const items = await prisma.item.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    console.log(`Found ${items.length} items`)

    return NextResponse.json(items)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const item = await prisma.item.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        location: body.location,
        date: new Date(body.date),
        status: body.status,
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone || null,
        imageUrl: body.imageUrl || null,
        userId: body.userId || null,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}