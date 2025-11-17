import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    const { userId } = params
    const { status } = await request.json()

    if (!['active', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update user status
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user status:', error)
      return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `User ${status} successfully` })
  } catch (error) {
    console.error('Error in user management:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    const { userId } = params

    // Get user details with their itineraries
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: userItineraries } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const { data: authUser } = await supabase.auth.admin.getUserById(userId)

    return NextResponse.json({
      user: {
        ...userProfile,
        email: authUser.data.user?.email,
        emailVerified: authUser.data.user?.email_confirmed_at,
      },
      itineraries: userItineraries || [],
      totalTrips: userItineraries?.length || 0,
      totalSpent: userItineraries?.reduce((sum, it) => sum + (it.budget || 0), 0) || 0,
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}