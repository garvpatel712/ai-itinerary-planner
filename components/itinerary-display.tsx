"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Star,
  Lightbulb,
  Download,
  Share2,
  RefreshCw,
  Plane,
  Car,
  Train,
  Bus,
} from "lucide-react"

interface Itinerary {
  destination: string
  duration: string
  totalBudget: number
  dailyItinerary: Array<{
    day: number
    date: string
    activities: Array<{
      time: string
      activity: string
      location: string
      cost: number
      description: string
      category: string
    }>
    dailyBudget: number
  }>
  accommodations: Array<{
    name: string
    type: string
    pricePerNight: number
    rating: number
    location: string
    amenities: string[]
    description: string
  }>
  transportation: Array<{
    type: string
    from: string
    to: string
    cost: number
    duration: string
    description: string
  }>
  budgetBreakdown: {
    accommodation: number
    transportation: number
    activities: number
    food: number
    miscellaneous: number
  }
  tips: string[]
}

interface ItineraryDisplayProps {
  itinerary: Itinerary
  onReset: () => void
}

const categoryColors = {
  sightseeing: "bg-blue-100 text-blue-800",
  food: "bg-orange-100 text-orange-800",
  entertainment: "bg-purple-100 text-purple-800",
  culture: "bg-green-100 text-green-800",
  nature: "bg-emerald-100 text-emerald-800",
  shopping: "bg-pink-100 text-pink-800",
}

const transportIcons = {
  flight: Plane,
  train: Train,
  bus: Bus,
  car_rental: Car,
  taxi: Car,
  metro: Train,
}

export function ItineraryDisplay({ itinerary, onReset }: ItineraryDisplayProps) {
  const [activeTab, setActiveTab] = useState("itinerary")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-balance">Your Trip to {itinerary.destination}</CardTitle>
              <CardDescription className="text-lg">
                {itinerary.duration} day adventure • {formatCurrency(itinerary.totalBudget)} total budget
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={onReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                New Trip
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

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
          {itinerary.dailyItinerary.map((day) => (
            <Card key={day.day}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Day {day.day}
                    </CardTitle>
                    <CardDescription>{day.date}</CardDescription>
                  </div>
                  <Badge variant="secondary">{formatCurrency(day.dailyBudget)} budget</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{activity.time}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold">{activity.activity}</h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {activity.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="secondary"
                              className={categoryColors[activity.category as keyof typeof categoryColors] || ""}
                            >
                              {activity.category}
                            </Badge>
                            <div className="text-sm font-medium mt-1">{formatCurrency(activity.cost)}</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Accommodations Tab */}
        <TabsContent value="accommodations" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {itinerary.accommodations.map((accommodation, index) => (
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
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{accommodation.rating}</span>
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {accommodation.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{accommodation.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">{formatCurrency(accommodation.pricePerNight)}</span>
                    <span className="text-sm text-muted-foreground">per night</span>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Amenities</h5>
                    <div className="flex flex-wrap gap-1">
                      {accommodation.amenities.map((amenity, amenityIndex) => (
                        <Badge key={amenityIndex} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Transportation Tab */}
        <TabsContent value="transportation" className="space-y-6">
          <div className="space-y-4">
            {itinerary.transportation.map((transport, index) => {
              const IconComponent = transportIcons[transport.type as keyof typeof transportIcons] || Car
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold capitalize">{transport.type.replace("_", " ")}</h4>
                          <Badge variant="outline">{transport.duration}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transport.from} → {transport.to}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{transport.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">{formatCurrency(transport.cost)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Budget Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Budget Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(itinerary.budgetBreakdown).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize font-medium">{category}</span>
                    <span className="font-semibold">{formatCurrency(amount)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(itinerary.totalBudget)}</span>
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
                  {itinerary.tips.map((tip, index) => (
                    <li key={index} className="flex gap-2 text-sm">
                      <span className="text-primary font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
