import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    // For testing purposes, let's fetch basic data without strict auth
    const { data: { session } } = await supabase.auth.getSession()
    
    console.log('Admin API - Session check:', session?.user?.id || 'No user')

    // Fetch basic data for testing
    const [
      usersData,
      itinerariesData,
      userStatsData,
      itineraryStatsData
    ] = await Promise.all([
      // Get all users with profiles
      supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
      
      // Get all itineraries with user info - simplified join
      supabase
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
      
      // Get user statistics
      supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true }),
      
      // Get itinerary statistics
      supabase
        .from('itineraries')
        .select('*', { count: 'exact', head: true })
    ])

    // Get user profiles for the itineraries
    const userIds = itinerariesData.data?.map(it => it.user_id) || []
    const { data: userProfilesData } = await supabase
      .from('user_profiles')
      .select('*')
      .in('user_id', userIds)

    // Create a map of user profiles
    const userProfileMap = new Map()
    userProfilesData?.forEach(profile => {
      userProfileMap.set(profile.user_id, profile)
    })

    console.log('Admin API - Data fetched:', {
      users: usersData.data?.length || 0,
      itineraries: itinerariesData.data?.length || 0,
      userCount: userStatsData.count,
      itineraryCount: itineraryStatsData.count
    })

    // Calculate basic statistics
    const totalUsers = userStatsData.count || 0
    const totalItineraries = itineraryStatsData.count || 0
    const totalBudget = itinerariesData.data?.reduce((sum, it) => sum + (it.budget || 0), 0) || 0
    const avgBudget = totalItineraries > 0 ? totalBudget / totalItineraries : 0

    // Get user list with basic stats
    const userList = usersData.data?.map(u => ({
      id: u.id,
      name: u.name || 'Unknown User',
      email: u.email || 'No email',
      joinDate: u.created_at,
      totalTrips: 0, // Simplified for testing
      totalSpent: 0, // Simplified for testing
      status: 'active',
      location: u.location,
      bio: u.bio
    })) || []

    // Get itinerary list with user details
    const itineraryList = itinerariesData.data?.map(it => {
      const userProfile = userProfileMap.get(it.user_id)
      return {
        id: it.id,
        user: userProfile?.name || userProfile?.email || 'Unknown User',
        userEmail: userProfile?.email,
        destination: it.destination,
        duration: it.duration,
        budget: it.budget,
        status: it.status,
        createdAt: it.created_at,
        startLocation: it.startlocation,
        summary: it.summary
      }
    }) || []

    const response = {
      stats: {
        users: {
          total: totalUsers,
          active: userList.length,
          newThisMonth: 0 // Simplified for testing
        },
        itineraries: {
          total: totalItineraries,
          active: 0, // Simplified for testing
          completed: 0, // Simplified for testing
          draft: 0, // Simplified for testing
          avgBudget: Math.round(avgBudget),
          totalBudget: Math.round(totalBudget)
        },
        totalRevenue: Math.round(totalBudget),
        avgTripCost: Math.round(avgBudget)
      },
      users: userList,
      itineraries: itineraryList,
      recentActivity: itineraryList.slice(0, 5), // Use first 5 as recent
      testMode: true,
      sessionUser: session?.user?.id || null
    }

    console.log('Admin API - Response prepared successfully')
    return NextResponse.json(response)

  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch admin data',
      details: error instanceof Error ? error.message : 'Unknown error',
      testMode: true
    }, { status: 500 })
  }
}