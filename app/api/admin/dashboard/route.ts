import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    // Create admin client with service role key for full access
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // For now, allow access to admin dashboard with basic checks
    // In production, implement proper session-based authentication
    const isAdmin = true // Temporarily allow access for testing

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Fetch admin dashboard data
    const [
      usersData,
      itinerariesData,
      recentItinerariesData,
      userStatsData,
      itineraryStatsData
    ] = await Promise.all([
      // Get all users with profiles
      supabaseAdmin
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      
      // Get all itineraries without join (to avoid relationship issues)
      supabaseAdmin
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      
      // Get recent itineraries (last 30 days) without join
      supabaseAdmin
        .from('itineraries')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(50),
      
      // Get user statistics
      supabaseAdmin
        .from('user_profiles')
        .select('*', { count: 'exact', head: true }),
      
      // Get itinerary statistics
      supabaseAdmin
        .from('itineraries')
        .select('*', { count: 'exact', head: true })
    ])

    // Calculate statistics
    const totalUsers = userStatsData.count || 0
    const totalItineraries = itineraryStatsData.count || 0
    const activeItineraries = itinerariesData.data?.filter(it => it.status === 'active').length || 0
    const completedItineraries = itinerariesData.data?.filter(it => it.status === 'completed').length || 0
    const draftItineraries = itinerariesData.data?.filter(it => it.status === 'draft').length || 0

    // Calculate total budget from all itineraries
    const totalBudget = itinerariesData.data?.reduce((sum, it) => sum + (it.budget || 0), 0) || 0
    const avgBudget = totalItineraries > 0 ? totalBudget / totalItineraries : 0

    // Get user activity stats
    const userActivity = {
      total: totalUsers,
      active: usersData.data?.filter(u => u.email).length || 0,
      newThisMonth: usersData.data?.filter(u => 
        new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length || 0
    }

    // Get itinerary trends
    const itineraryTrends = {
      total: totalItineraries,
      active: activeItineraries,
      completed: completedItineraries,
      draft: draftItineraries,
      avgBudget: Math.round(avgBudget),
      totalBudget: Math.round(totalBudget)
    }

    // Create a map of user_id to user data for quick lookup
    const userMap = new Map(usersData.data?.map(u => [u.user_id, u]) || [])

    // Get recent activity
    const recentActivity = recentItinerariesData.data?.map(it => {
      const user = userMap.get(it.user_id)
      return {
        id: it.id,
        user: user?.name || user?.email || 'Unknown User',
        destination: it.destination,
        duration: it.duration,
        budget: it.budget,
        status: it.status,
        createdAt: it.created_at,
        userEmail: user?.email || 'No email'
      }
    }) || []

    // Get user list with stats
    const userList = usersData.data?.map(u => ({
      id: u.id,
      name: u.name || 'Unknown User',
      email: u.email || 'No email',
      joinDate: u.created_at,
      totalTrips: itinerariesData.data?.filter(it => it.user_id === u.user_id).length || 0,
      totalSpent: itinerariesData.data?.filter(it => it.user_id === u.user_id).reduce((sum, it) => sum + (it.budget || 0), 0) || 0,
      status: 'active', // You can implement status logic here
      location: u.location,
      bio: u.bio
    })) || []

    // Get itinerary list with user details
    const itineraryList = itinerariesData.data?.map(it => {
      const user = userMap.get(it.user_id)
      return {
        id: it.id,
        user: user?.name || user?.email || 'Unknown User',
        userEmail: user?.email || 'No email',
        destination: it.destination,
        duration: it.duration,
        budget: it.budget,
        status: it.status,
        createdAt: it.created_at,
        startLocation: it.startlocation,
        summary: it.summary
      }
    }) || []

    return NextResponse.json({
      stats: {
        users: userActivity,
        itineraries: itineraryTrends,
        totalRevenue: Math.round(totalBudget),
        avgTripCost: Math.round(avgBudget)
      },
      users: userList,
      itineraries: itineraryList,
      recentActivity: recentActivity
    })

  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch admin data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}