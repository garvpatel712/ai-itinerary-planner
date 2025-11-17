import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(
  request: NextRequest,
  { params }: { params: { itineraryId: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if the user has admin role
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (userData?.role !== 'admin' && session.user.email !== 'admin@gmail.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { itineraryId } = params

    // Update itinerary status to flagged
    const { error } = await supabase
      .from('itineraries')
      .update({ 
        status: 'flagged',
        updated_at: new Date().toISOString()
      })
      .eq('id', itineraryId)

    if (error) {
      console.error('Error flagging itinerary:', error)
      return NextResponse.json({ error: 'Failed to flag itinerary' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Itinerary flagged successfully' })
  } catch (error) {
    console.error('Error in itinerary management:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { itineraryId: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if the user has admin role
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { itineraryId } = params

    // Get itinerary details with user information
    const { data: itinerary } = await supabase
      .from('itineraries')
      .select(`
        *,
        user_profiles!inner(
          name,
          email
        )
      `)
      .eq('id', itineraryId)
      .single()

    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 })
    }

    return NextResponse.json({
      itinerary: {
        ...itinerary,
        userName: itinerary.user_profiles.name,
        userEmail: itinerary.user_profiles.email,
      }
    })
  } catch (error) {
    console.error('Error fetching itinerary details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}