"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Clock, Plane, Plus, Eye, Trash2, Star, Loader2 } from "lucide-react"
import { FaRupeeSign } from "react-icons/fa"
import { supabase } from '@/lib/supabaseClient'
import { getUserProfile, getUserItineraries, getDashboardItineraries, calculateUserStats, deleteItinerary } from '@/lib/database'

interface DashboardData {
  user: {
    id: string
    email: string
    name: string
    avatar?: string
    bio?: string
  }
  itineraries: any[]
  stats: {
    totalTrips: number
    totalSpent: number
    completedTrips: number
    upcomingTrips: number
    draftTrips: number
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [historyItems, setHistoryItems] = useState<any[]>([])
  const [historyTotal, setHistoryTotal] = useState<number>(0)
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Get session/user from Supabase client (client-side)
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData?.session?.user || null
      console.debug('dashboard: sessionData', sessionData)

      if (!user) {
        router.push('/login')
        return
      }

      // Fetch profile & stats
      const { data: profileData, error: profileError } = await getUserProfile(user.id)
      const { data: statsData, error: statsError } = await calculateUserStats(user.id)

      // Fetch paginated history for dashboard (search + pagination)
      const { data: historyData, error: historyError } = await getDashboardItineraries(user.id, pageSize, page, search)

      // Handle profile missing gracefully (new users may not have profile row yet)
      if (profileError && !profileData) {
        console.warn('No profile found for user, proceeding with defaults', profileError)
      }

      if (historyError) {
        console.error('Dashboard history fetch error:', historyError)
        throw new Error(historyError.message || 'Failed to fetch history')
      }

      if (statsError) {
        console.error('Dashboard stats fetch error:', statsError)
        // stats are non-fatal; continue but log
      }

      const dashboardData = {
        user: {
          id: user.id,
          email: user.email || '',
          name: profileData?.name || 'User',
          avatar: profileData?.avatar,
          bio: profileData?.bio,
        },
        profile: profileData,
        itineraries: [],
        stats: statsData || {
          totalTrips: 0,
          totalSpent: 0,
          completedTrips: 0,
          upcomingTrips: 0,
          draftTrips: 0,
        },
      }

      // history
      setHistoryItems(historyData?.items || [])
      setHistoryTotal(historyData?.total || 0)

      setData(dashboardData)
      setError(null)
    } catch (err) {
      console.error("Error fetching dashboard:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItinerary = async (itineraryId: string) => {
    if (!confirm("Are you sure you want to delete this itinerary?")) return

    try {
      setDeleting(itineraryId)
      // Use client-side database helper (supabase client has session in browser)
      const { error } = await deleteItinerary(itineraryId)

      if (error) {
        throw new Error(error.message || 'Failed to delete itinerary')
      }

      // Refresh data
      await fetchDashboardData()
    } catch (err) {
      console.error("Error deleting itinerary:", err)
      setError(err instanceof Error ? err.message : "Failed to delete itinerary")
    } finally {
      setDeleting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error || "Failed to load your dashboard"}</p>
            <Button onClick={() => fetchDashboardData()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">
            Welcome, {data.user.name}! 👋
          </h1>
          <p className="text-muted-foreground">Ready to plan your next adventure?</p>
        </div>

        {error && (
          <Card className="mb-6 border-destructive bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalTrips}</div>
              <p className="text-xs text-muted-foreground">All time trips</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <FaRupeeSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.stats.totalSpent)}</div>
              <p className="text-xs text-muted-foreground">Total budget</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Itineraries generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{historyTotal}</div>
              <p className="text-xs text-muted-foreground">Generated by AI</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="itineraries" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="itineraries">My Itineraries</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <input
                placeholder="Search itineraries"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); fetchDashboardData() }}
                className="px-3 py-2 border rounded-md text-sm"
              />
              <Link href="/">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Itinerary
                </Button>
              </Link>
            </div>
          </div>

          <TabsContent value="itineraries" className="space-y-6">
            <div className="space-y-4">
              {historyItems.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">No itineraries yet. Create your first adventure!</p>
                    <Link href="/">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Itinerary
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-sm text-muted-foreground">
                          <th className="px-4 py-2">Title</th>
                          <th className="px-4 py-2">Created</th>
                          <th className="px-4 py-2">Summary</th>
                          <th className="px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyItems.map((it) => (
                          <tr key={it.id} className="border-t">
                            <td className="px-4 py-3 font-medium">{it.title || it.destination}</td>
                            <td className="px-4 py-3">{new Date(it.created_at).toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{it.summary || (it.payload?.summary ? it.payload.summary.slice(0, 120) : '')}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Link href={`/itinerary/${it.id}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Open
                                  </Button>
                                </Link>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteItinerary(it.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Showing {historyItems.length} of {historyTotal}</div>
                    <div className="flex items-center gap-2">
                      <Button disabled={page <= 1} onClick={async () => { setPage(p => Math.max(1, p-1)); await fetchDashboardData() }}>Prev</Button>
                      <div className="px-3">{page}</div>
                      <Button disabled={historyItems.length < pageSize} onClick={async () => { setPage(p => p+1); await fetchDashboardData() }}>Next</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm text-muted-foreground">{data.user.email}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Name</h4>
                  <p className="text-sm text-muted-foreground">{data.user.name}</p>
                </div>
                <Link href="/profile/edit">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
