import { NextRequest, NextResponse } from 'next/server'
import { readCollection, createItem, updateItem, deleteItem } from '@/lib/db'

const collectionMap: Record<string, string> = {
  categories: 'awardCategories',
  'volunteer-fields': 'volunteerFields',
  partners: 'partners',
  'hero-slides': 'heroSlides',
  steps: 'steps',
  pages: 'pages',
  events: 'events',
  media: 'media',
  messages: 'contactMessages',
  users: 'users',
  navigation: 'navigation',
  statistics: 'statistics',
  'social-links': 'socialLinks',
  'about-sections': 'aboutSections',
  news: 'news',
}

function getCollectionName(pathSegment: string): string {
  return collectionMap[pathSegment] || pathSegment
}

// Generic GET handler
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params
  const collectionName = getCollectionName(collection)
  const { searchParams } = new URL(request.url)
  const active = searchParams.get('active')
  const published = searchParams.get('published')
  const limit = searchParams.get('limit')
  const sort = searchParams.get('sort') || 'order'
  
  let data: Record<string, unknown>[] = readCollection(collectionName) as Record<string, unknown>[]
  
  if (active === 'true') {
    data = data.filter((item) => (item as Record<string, unknown>).active === true)
  }
  if (published === 'true') {
    data = data.filter((item) => (item as Record<string, unknown>).published === true)
  }
  
  // Sort by order field
  data.sort((a, b) => {
    const aVal = (a[sort] as number) ?? 0
    const bVal = (b[sort] as number) ?? 0
    return aVal - bVal
  })
  
  if (limit) {
    data = data.slice(0, parseInt(limit))
  }
  
  return NextResponse.json(data)
}

// Generic POST handler
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params
  const collectionName = getCollectionName(collection)
  const body = await request.json()
  const item = createItem(collectionName, body)
  return NextResponse.json(item, { status: 201 })
}

// Generic PUT handler
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params
  const collectionName = getCollectionName(collection)
  const body = await request.json()
  const { id, ...updates } = body
  const item = updateItem(collectionName, id, updates)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

// Generic DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params
  const collectionName = getCollectionName(collection)
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const deleted = deleteItem(collectionName, id)
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
