import { NextRequest, NextResponse } from 'next/server'
import { readCollection, createItem, updateItem, deleteItem } from '@/lib/db'

interface NewsRecord {
  id: string
  title: string
  slug: string
  summary?: string
  content: string
  image?: string
  featured: boolean
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

// GET /api/news - Get all news
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const published = searchParams.get('published')
  const limit = searchParams.get('limit')
  
  let news: NewsRecord[] = readCollection<NewsRecord>('news')
  
  if (published === 'true') {
    news = news.filter((n) => n.published)
  }
  
  news.sort((a, b) => {
    const dateA = a.publishedAt || a.createdAt
    const dateB = b.publishedAt || b.createdAt
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
  
  if (limit) {
    news = news.slice(0, parseInt(limit))
  }
  
  return NextResponse.json(news)
}

// POST /api/news - Create news
export async function POST(request: NextRequest) {
  const body = await request.json()
  const news = createItem('news', body)
  return NextResponse.json(news, { status: 201 })
}

// PUT /api/news - Update news
export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, ...updates } = body
  const news = updateItem('news', id, updates)
  if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(news)
}

// DELETE /api/news - Delete news
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const deleted = deleteItem('news', id)
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
