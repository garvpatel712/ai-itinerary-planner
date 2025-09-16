"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, DollarSign, Clock, Plane, Plus, Eye, Trash2, Star } from "lucide-react"

// Mock data for user's itineraries
const mockItineraries = [
  {
    id: 1,
    destination: "Tokyo, Japan",
    duration: "7 days",
    budget: 2500,
    status: "completed",
    createdAt: "2024-01-15",
    rating: 5,
  },
  {
    id: 2,
    destination: "Paris, France",
    duration: "5 days",
    budget: 1800,
    status: "upcoming",
    createdAt: "2024-02-01",
    rating: null,
  },
  {
    id: 3,
    destination: "Bali, Indonesia",
    duration: "10 days",
    budget: 1200,
    status: "draft",
    createdAt: "2024-02-10",
    rating: null,
  },
]

const mockStats = {
  totalTrips: 12,
  totalSpent: 18500,
  favoriteDestination: "Japan",
  nextTrip: "Paris, France",
}

export default function DashboardPage() {
  const [itineraries] = useState(mockItineraries)

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Ready to plan your next adventure?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalTrips}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockStats.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all trips</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Destination</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.favoriteDestination}</div>
              <p className="text-xs text-muted-foreground">Most visited</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Trip</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-balance">{mockStats.nextTrip}</div>
              <p className="text-xs text-muted-foreground">In 2 weeks</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="itineraries" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="itineraries">My Itineraries</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Itinerary
            </Button>
          </div>

          <TabsContent value="itineraries" className="space-y-6">
            <div className="grid gap-6">
              {itineraries.map((itinerary) => (
                <Card key={itinerary.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {itinerary.destination}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {itinerary.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />${itinerary.budget}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(itinerary.createdAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(itinerary.status)}>{itinerary.status}</Badge>
                        {itinerary.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{itinerary.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Destinations</CardTitle>
                <CardDescription>Places you've loved and want to visit again</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No favorite destinations yet. Complete a trip and rate it to add favorites!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Travel Preferences</h4>
                  <p className="text-sm text-muted-foreground">
                    Set your default travel style, budget range, and interests
                  </p>
                  <Button variant="outline">Update Preferences</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-muted-foreground">Manage email and push notifications</p>
                  <Button variant="outline">Notification Settings</Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Privacy</h4>
                  <p className="text-sm text-muted-foreground">Control your data and privacy settings</p>
                  <Button variant="outline">Privacy Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
