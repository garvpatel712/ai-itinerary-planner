import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { getDashboardItineraries } from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    // Try to get the user from Supabase client (will work if cookies are forwarded)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100)
    const search = url.searchParams.get('search') || undefined

    const { data, error } = await getDashboardItineraries(user.id, limit, page, search)

    if (error) {
      console.error('Dashboard itineraries error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/dashboard/itineraries error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
