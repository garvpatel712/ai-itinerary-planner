import { supabase } from './supabaseClient'

// User Profile Operations
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export const createOrUpdateUserProfile = async (userId: string, profile: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: userId,
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  return { data, error }
}

// Itinerary Operations
export const createItinerary = async (userId: string, itineraryData: any) => {
  // Ensure we store both the normalized fields and the full payload for future parsing
  const payload = itineraryData.payload || itineraryData.itinerary || itineraryData
  const insertBody = {
    user_id: userId,
    destination: itineraryData.destination || payload.destination || null,
    title: itineraryData.title || payload.title || itineraryData.destination || null,
    summary: itineraryData.summary || payload.summary || null,
    source: itineraryData.source || 'ai-generator-v1',
    duration: itineraryData.duration || payload.duration || null,
    budget: itineraryData.budget ?? payload.budget ?? itineraryData.totalBudget ?? 0,
    itinerary: itineraryData.itinerary || payload.itinerary || payload.dailyItinerary || null,
    accommodationOptions: itineraryData.accommodationOptions || payload.accommodationOptions || payload.accommodations || null,
    transportation: itineraryData.transportation || payload.transportation || null,
    budgetBreakdown: itineraryData.budgetBreakdown || payload.budgetBreakdown || null,
    travelTips: itineraryData.travelTips || payload.travelTips || payload.tips || null,
    payload: payload,
    status: itineraryData.status || 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('itineraries')
    .insert(insertBody)
    .select()
    .single()
  return { data, error }
}

export const getUserItineraries = async (userId: string) => {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getDashboardItineraries = async (
  userId: string,
  limit = 50,
  page = 1,
  search?: string
) => {
  const offset = (page - 1) * limit

  let query = supabase
    .from('itineraries')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    // simple full-text search on title, summary, destination
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,destination.ilike.%${search}%`)
  }

  const res = await query
  const items = res.data
  const count = res.count || 0
  return { data: { total: count, items }, error: res.error }
}

export const getItineraryById = async (itineraryId: string) => {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('id', itineraryId)
    .single()
  return { data, error }
}

export const updateItinerary = async (itineraryId: string, updates: any) => {
  const { data, error } = await supabase
    .from('itineraries')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itineraryId)
    .select()
    .single()
  return { data, error }
}

export const deleteItinerary = async (itineraryId: string) => {
  const { error } = await supabase
    .from('itineraries')
    .delete()
    .eq('id', itineraryId)
  return { error }
}

// Calculate user statistics
export const calculateUserStats = async (userId: string) => {
  const { data: itineraries, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('user_id', userId)

  if (error) return { data: null, error }

  const stats = {
    totalTrips: itineraries?.length || 0,
    totalSpent: itineraries?.reduce((sum: number, trip: any) => sum + (trip.budget || 0), 0) || 0,
    completedTrips: itineraries?.filter((t: any) => t.status === 'completed').length || 0,
    upcomingTrips: itineraries?.filter((t: any) => t.status === 'upcoming').length || 0,
    draftTrips: itineraries?.filter((t: any) => t.status === 'draft').length || 0,
  }

  return { data: stats, error: null }
}
