import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { calculateUserStats, getUserItineraries, getUserProfile } from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profileData, error: profileError } = await getUserProfile(user.id)

    // Get user's itineraries
    const { data: itineraries, error: itinerariesError } = await getUserItineraries(user.id)

    // Calculate stats
    const { data: stats, error: statsError } = await calculateUserStats(user.id)

    if (profileError || itinerariesError || statsError) {
      console.error('Database errors:', { profileError, itinerariesError, statsError })
      return NextResponse.json(
        { error: 'Failed to fetch dashboard data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: profileData?.name || 'User',
        avatar: profileData?.avatar,
        bio: profileData?.bio,
      },
      profile: profileData,
      itineraries: itineraries || [],
      stats: stats,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
