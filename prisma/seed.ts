// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.item.deleteMany()
  await prisma.user.deleteMany()

  // Create sample users
  console.log('👥 Creating sample users...')
  
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      phone: '+1 (555) 123-4567',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      phone: '+1 (555) 987-6543',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: hashedPassword,
      phone: '+1 (555) 456-7890',
    },
  })

  console.log('✅ Created 3 users')

  // Create sample lost items
  console.log('📦 Creating sample lost items...')

  await prisma.item.create({
    data: {
      title: 'iPhone 13 Pro - Blue',
      description: 'Lost my blue iPhone 13 Pro with a clear case. Has a small crack on the bottom left corner. Last seen at Central Park near the fountain. Contains important photos and contacts. Please contact me if found!',
      category: 'electronics',
      location: 'Central Park, near the fountain',
      date: new Date('2024-10-01'),
      status: 'lost',
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      contactPhone: '+1 (555) 123-4567',
      resolved: false,
      userId: user1.id,
    },
  })

  await prisma.item.create({
    data: {
      title: 'Black Leather Wallet',
      description: 'Lost my black leather wallet containing ID card, credit cards, and some cash. It has my initials "JS" embossed on the front. Lost somewhere between Starbucks on Main Street and the subway station.',
      category: 'accessories',
      location: 'Main Street, between Starbucks and Metro Station',
      date: new Date('2024-10-03'),
      status: 'lost',
      contactName: 'Jane Smith',
      contactEmail: 'jane@example.com',
      contactPhone: '+1 (555) 987-6543',
      resolved: false,
      userId: user2.id,
    },
  })

  await prisma.item.create({
    data: {
      title: 'Silver MacBook Air',
      description: 'Lost my MacBook Air (M1, 2020) in a gray sleeve. Has several stickers on the back including a React logo and university emblem. Left it at the library 3rd floor study area. Reward offered!',
      category: 'electronics',
      location: 'City Library, 3rd Floor Study Area',
      date: new Date('2024-09-28'),
      status: 'lost',
      contactName: 'Mike Johnson',
      contactEmail: 'mike@example.com',
      contactPhone: '+1 (555) 456-7890',
      resolved: false,
      userId: user3.id,
    },
  })

  await prisma.item.create({
    data: {
      title: 'Gold Wedding Ring',
      description: 'Lost my gold wedding ring with diamond. Engraved with "Forever & Always" inside. Extremely sentimental value. May have slipped off at the gym or in the parking lot. Please help me find it!',
      category: 'jewelry',
      location: 'Fitness Plus Gym, Downtown',
      date: new Date('2024-10-05'),
      status: 'lost',
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      contactPhone: '+1 (555) 123-4567',
      resolved: false,
      userId: user1.id,
    },
  })

  await prisma.item.create({
    data: {
      title: 'Red Backpack with Laptop',
      description: 'Lost red North Face backpack containing laptop, textbooks, and notes. Has a keychain with a small teddy bear attached. Lost on bus route 42. Very important for my studies!',
      category: 'bags',
      location: 'Bus Route 42, heading downtown',
      date: new Date('2024-09-30'),
      status: 'lost',
      contactName: 'Jane Smith',
      contactEmail: 'jane@example.com',
      contactPhone: '+1 (555) 987-6543',
      resolved: false,
      userId: user2.id,
    },
  })

  console.log('✅ Created 5 lost items')

  // Create sample found items
  console.log('🔍 Creating sample found items...')

  await prisma.item.create({
    data: {
      title: 'Set of Car Keys - Toyota',
      description: 'Found a set of car keys with Toyota logo and a blue lanyard. Has a small rubber duck keychain attached. Found in the parking lot of Westfield Mall near entrance B.',
      category: 'keys',
      location: 'Westfield Mall, Parking Lot - Entrance B',
      date: new Date('2024-10-04'),
      status: 'found',
      contactName: 'Mike Johnson',
      contactEmail: 'mike@example.com',
      contactPhone: '+1 (555) 456-7890',
      resolved: false,
      userId: user3.id,
    },
  })

  await prisma.item.create({
    data: {
      title: 'Blue Denim Jacket',
      description: 'Found a blue denim jacket (size M) hanging on a bench in Riverside Park. Has some patches and pins on it. Looks well-loved and someone must be missing it!',
      category: 'clothing',
      location: 'Riverside Park, near the playground',
      date: new Date('2024-10-02'),
      status: 'found',
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      contactPhone: '+1 (555) 123-4567',
      resolved: false,
      userId: user1.id,
    },
  })

  await prisma.item.create({
    data: {
      title: 'Student ID Card - University',
      description: 'Found a student ID card from State University. Name visible on card. Found it on the sidewalk near the campus bookstore. Want to return it to its owner.',
      category: 'documents',
      location: 'State University Campus, near bookstore',
      date: new Date('2024-09-29'),
      status: 'found',
      contactName: 'Jane Smith',
      contactEmail: 'jane@example.com',
      contactPhone: '+1 (555) 987-6543',
      resolved: false,
      userId: user2.id,
    },
  })

  await prisma.item.create({
    data: {
      title: 'Prescription Glasses in Case',
      description: 'Found black-framed prescription glasses in a brown leather case. Found on table at Coffee Bean cafe. These look important - someone must need them!',
      category: 'accessories',
      location: 'Coffee Bean Cafe, 5th Avenue',
      date: new Date('2024-10-06'),
      status: 'found',
      contactName: 'Mike Johnson',
      contactEmail: 'mike@example.com',
      contactPhone: '+1 (555) 456-7890',
      resolved: false,
      userId: user3.id,
    },
  })

  await prisma.item.create({
    data: {
      title: 'Wireless Earbuds - AirPods',
      description: 'Found white Apple AirPods (2nd generation) in charging case. Found them on a bench at the train station. Case has some minor scratches.',
      category: 'electronics',
      location: 'Grand Central Station, Platform 7',
      date: new Date('2024-10-01'),
      status: 'found',
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      contactPhone: '+1 (555) 123-4567',
      resolved: false,
      userId: user1.id,
    },
  })

  await prisma.item.create({
    data: {
      title: 'Small Dog - Brown Chihuahua',
      description: 'Found a small brown Chihuahua wandering near the park. Very friendly, wearing a red collar but no tags. Appears well-cared for. Currently safe with me. Please contact to identify and claim!',
      category: 'pets',
      location: 'Lincoln Park, South Entrance',
      date: new Date('2024-10-05'),
      status: 'found',
      contactName: 'Jane Smith',
      contactEmail: 'jane@example.com',
      contactPhone: '+1 (555) 987-6543',
      resolved: false,
      userId: user2.id,
    },
  })

  console.log('✅ Created 6 found items')

  // Create one resolved item
  console.log('✨ Creating resolved item...')

  await prisma.item.create({
    data: {
      title: 'Purple Umbrella',
      description: 'Found a purple umbrella with floral pattern at the bus stop. Owner has been contacted and item returned successfully!',
      category: 'other',
      location: 'Bus Stop, Main Street',
      date: new Date('2024-09-25'),
      status: 'found',
      contactName: 'Mike Johnson',
      contactEmail: 'mike@example.com',
      contactPhone: '+1 (555) 456-7890',
      resolved: true,
      userId: user3.id,
    },
  })

  console.log('✅ Created 1 resolved item')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log('   - 3 Users created')
  console.log('   - 5 Lost items')
  console.log('   - 6 Found items')
  console.log('   - 1 Resolved item')
  console.log('   - Total: 12 items\n')
  console.log('🔐 All users have password: password123')
  console.log('📧 User emails:')
  console.log('   - john@example.com')
  console.log('   - jane@example.com')
  console.log('   - mike@example.com')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })