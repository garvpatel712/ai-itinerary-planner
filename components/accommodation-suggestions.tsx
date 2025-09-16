"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccommodationCard } from "./accommodation-card"
import { Hotel, Home, Building, Crown, Users } from "lucide-react"

interface Accommodation {
  name: string
  type: string
  pricePerNight: number
  rating: number
  location: string
  amenities: string[]
  description: string
}

interface AccommodationSuggestionsProps {
  accommodations: Accommodation[]
  budget: number
  duration: number
  onSelect?: (accommodation: Accommodation) => void
}

const accommodationTypes = [
  { value: "all", label: "All Types", icon: Building },
  { value: "hotel", label: "Hotels", icon: Hotel },
  { value: "airbnb", label: "Airbnb", icon: Home },
  { value: "hostel", label: "Hostels", icon: Users },
  { value: "resort", label: "Resorts", icon: Crown },
]

export function AccommodationSuggestions({
  accommodations,
  budget,
  duration,
  onSelect,
}: AccommodationSuggestionsProps) {
  const [selectedType, setSelectedType] = useState("all")
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null)

  const filteredAccommodations = accommodations.filter((acc) =>
    selectedType === "all" ? true : acc.type === selectedType,
  )

  const accommodationBudget = budget * 0.3 // Assume 30% of budget for accommodation
  const budgetPerNight = accommodationBudget / duration

  const categorizeByBudget = (acc: Accommodation) => {
    if (acc.pricePerNight <= budgetPerNight * 0.7) return "budget"
    if (acc.pricePerNight <= budgetPerNight * 1.2) return "recommended"
    return "premium"
  }

  const budgetCategories = {
    budget: filteredAccommodations.filter((acc) => categorizeByBudget(acc) === "budget"),
    recommended: filteredAccommodations.filter((acc) => categorizeByBudget(acc) === "recommended"),
    premium: filteredAccommodations.filter((acc) => categorizeByBudget(acc) === "premium"),
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Accommodation Budget</CardTitle>
          <CardDescription>
            Based on your total budget of {formatCurrency(budget)}, we recommend spending around{" "}
            {formatCurrency(accommodationBudget)} on accommodation ({formatCurrency(budgetPerNight)} per night).
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        {accommodationTypes.map((type) => {
          const IconComponent = type.icon
          return (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="flex items-center gap-2"
            >
              <IconComponent className="h-4 w-4" />
              {type.label}
            </Button>
          )
        })}
      </div>

      {/* Accommodation Categories */}
      <Tabs defaultValue="recommended" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="budget" className="flex items-center gap-2">
            Budget Friendly
            <Badge variant="secondary" className="ml-1">
              {budgetCategories.budget.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            Recommended
            <Badge variant="secondary" className="ml-1">
              {budgetCategories.recommended.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-2">
            Premium
            <Badge variant="secondary" className="ml-1">
              {budgetCategories.premium.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="space-y-4">
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              Great value options under {formatCurrency(budgetPerNight * 0.7)} per night
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetCategories.budget.map((accommodation, index) => (
              <AccommodationCard
                key={index}
                accommodation={accommodation}
                isSelected={selectedAccommodation?.name === accommodation.name}
                onSelect={() => {
                  setSelectedAccommodation(accommodation)
                  onSelect?.(accommodation)
                }}
                showSelectButton={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              Perfect balance of comfort and value around {formatCurrency(budgetPerNight)} per night
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetCategories.recommended.map((accommodation, index) => (
              <AccommodationCard
                key={index}
                accommodation={accommodation}
                isSelected={selectedAccommodation?.name === accommodation.name}
                onSelect={() => {
                  setSelectedAccommodation(accommodation)
                  onSelect?.(accommodation)
                }}
                showSelectButton={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="premium" className="space-y-4">
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              Luxury experiences over {formatCurrency(budgetPerNight * 1.2)} per night
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetCategories.premium.map((accommodation, index) => (
              <AccommodationCard
                key={index}
                accommodation={accommodation}
                isSelected={selectedAccommodation?.name === accommodation.name}
                onSelect={() => {
                  setSelectedAccommodation(accommodation)
                  onSelect?.(accommodation)
                }}
                showSelectButton={true}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedAccommodation && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Selected Accommodation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{selectedAccommodation.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedAccommodation.location}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(selectedAccommodation.pricePerNight)}/night</div>
                <div className="text-sm text-muted-foreground">
                  Total: {formatCurrency(selectedAccommodation.pricePerNight * duration)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
