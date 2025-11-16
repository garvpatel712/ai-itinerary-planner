"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, Calendar, Clock, MapPin, Lightbulb, Plane, Car, Train, Bus } from "lucide-react"
import { FaRupeeSign } from "react-icons/fa"
import { supabase } from '@/lib/supabaseClient'

interface ItineraryData {
  id: string
  destination: string
  duration: number
  budget: number
  summary?: string
  itinerary: Array<{
    day: number
    activities: Array<{
      time: string
      activity: string
      cost: number
    }>
  }>
  accommodationoptions: Array<{
    name: string
    type: string
    pricePerNight: number
    location: string
    amenities: string[]
  }>
  transportation: Array<{
    type: string
    details: string
  }> | {
    toDestination: string
    localTransport: string
  }
  budgetbreakdown: {
    travel?: number
    accommodation?: number
    food?: number
    activities?: number
    misc?: number
  }
  traveltips: string[]
  created_at: string
  user_id: string
}

export default function ItineraryPage() {
  const params = useParams()
  const router = useRouter()
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("itinerary")

  useEffect(() => {
    if (params.id) {
      fetchItinerary()
    }
  }, [params.id])

  const fetchItinerary = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setError("Please log in to view itineraries")
        return
      }

      // Fetch the itinerary
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error("Itinerary not found")
      }

      // Verify the itinerary belongs to the user (or is accessible)
      if (data.user_id !== session.user.id && data.user_id !== '00000000-0000-0000-0000-000000000000') {
        throw new Error("You don't have permission to view this itinerary")
      }

      setItinerary(data)
    } catch (err) {
      console.error("Error fetching itinerary:", err)
      setError(err instanceof Error ? err.message : "Failed to load itinerary")
    } finally {
      setLoading(false)
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
          <p className="text-muted-foreground">Loading itinerary...</p>
        </div>
      </div>
    )
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error || "Failed to load itinerary"}</p>
            <div className="flex gap-2">
              <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
              <Button variant="outline" onClick={fetchItinerary}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">Trip to {itinerary.destination}</h1>
              <p className="text-muted-foreground">
                {itinerary.duration} day adventure • {formatCurrency(itinerary.budget)} total budget
              </p>
              {itinerary.summary && (
                <p className="text-muted-foreground mt-2">{itinerary.summary}</p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Created: {new Date(itinerary.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
            <TabsTrigger value="accommodations">Hotels</TabsTrigger>
            <TabsTrigger value="transportation">Transport</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          {/* Daily Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            {itinerary.itinerary?.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Day {day.day}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {day.activities?.map((activity, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                        <div className="flex flex-col items-center gap-1 min-w-[60px]">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{activity.time}</span>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">{activity.activity}</h4>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium mt-1">{formatCurrency(activity.cost)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) || <p>No activities planned for this day.</p>}
                  </div>
                </CardContent>
              </Card>
            )) || <Card><CardContent className="pt-6"><p>No itinerary data available.</p></CardContent></Card>}
          </TabsContent>

          {/* Accommodations Tab */}
          <TabsContent value="accommodations" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {itinerary.accommodationoptions?.map((accommodation, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{accommodation.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {accommodation.location}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mt-1">
                          {accommodation.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">{formatCurrency(accommodation.pricePerNight)}</span>
                      <span className="text-sm text-muted-foreground">per night</span>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Amenities</h5>
                      <div className="flex flex-wrap gap-1">
                        {accommodation.amenities?.map((amenity, amenityIndex) => (
                          <Badge key={amenityIndex} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        )) || <p>No amenities listed.</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || <Card><CardContent className="pt-6"><p>No accommodation options available.</p></CardContent></Card>}
            </div>
          </TabsContent>

          {/* Transportation Tab */}
          <TabsContent value="transportation" className="space-y-6">
            <div className="space-y-4">
              {itinerary.transportation && (
                <>
                  {Array.isArray(itinerary.transportation) ? (
                    itinerary.transportation.map((transport, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{transport.type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{transport.details}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>To Destination</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{itinerary.transportation.toDestination}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Local Transport</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{itinerary.transportation.localTransport}</p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </>
              ) || <Card><CardContent className="pt-6"><p>No transportation information available.</p></CardContent></Card>}
            </div>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Budget Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaRupeeSign className="h-5 w-5 text-primary" />
                    Budget Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itinerary.budgetbreakdown && Object.entries(itinerary.budgetbreakdown)?.map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="capitalize font-medium">{category.replace("misc", "miscellaneous")}</span>
                      <span className="font-semibold">{formatCurrency(amount as number)}</span>
                    </div>
                  )) || <p>No budget breakdown available.</p>}
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(itinerary.budget)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Travel Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Travel Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {itinerary.traveltips?.map((tip, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <span className="text-primary font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    )) || <p>No travel tips available.</p>}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}