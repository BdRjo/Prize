import { NextRequest, NextResponse } from 'next/server'
import { readCollection, updateItem } from '@/lib/db'

interface SiteSetting {
  id: string
  key: string
  value: string
  group: string
  label: string
  type: string
}

// GET /api/settings - Get all settings
export async function GET() {
  const settings = readCollection<SiteSetting>('siteSettings')
  return NextResponse.json(settings)
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  const body = await request.json()
  
  if (Array.isArray(body)) {
    // Batch update
    const results = body.map((item: { id: string; value: string }) => 
      updateItem('siteSettings', item.id, { value: item.value } as Partial<SiteSetting>)
    )
    return NextResponse.json(results)
  }
  
  const { id, ...updates } = body
  const setting = updateItem('siteSettings', id, updates)
  if (!setting) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(setting)
}
