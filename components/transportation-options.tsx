"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TransportationCard } from "./transportation-card"
import { Plane, Train, Bus, Car, MapPin, Clock, DollarSign } from "lucide-react"

interface Transportation {
  type: string
  from: string
  to: string
  cost: number
  duration: string
  description: string
  departureTime?: string
  arrivalTime?: string
  provider?: string
  class?: string
  emissions?: string
}

interface TransportationOptionsProps {
  transportation: Transportation[]
  budget: number
  startLocation: string
  destination: string
  onSelect?: (transportation: Transportation) => void
}

const transportTypes = [
  { value: "all", label: "All Options", icon: MapPin },
  { value: "flight", label: "Flights", icon: Plane },
  { value: "train", label: "Trains", icon: Train },
  { value: "bus", label: "Buses", icon: Bus },
  { value: "car_rental", label: "Car Rental", icon: Car },
]

const sortOptions = [
  { value: "price", label: "Lowest Price" },
  { value: "duration", label: "Shortest Time" },
  { value: "eco", label: "Most Eco-friendly" },
]

export function TransportationOptions({
  transportation,
  budget,
  startLocation,
  destination,
  onSelect,
}: TransportationOptionsProps) {
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("price")
  const [selectedTransport, setSelectedTransport] = useState<Transportation | null>(null)

  const filteredTransportation = transportation.filter((transport) =>
    selectedType === "all" ? true : transport.type === selectedType,
  )

  const sortedTransportation = [...filteredTransportation].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.cost - b.cost
      case "duration":
        // Simple duration comparison (assumes format like "2h 30m")
        const aDuration = parseDuration(a.duration)
        const bDuration = parseDuration(b.duration)
        return aDuration - bDuration
      case "eco":
        // Prioritize trains and buses over flights and cars
        const ecoScore = { train: 1, bus: 2, flight: 3, car_rental: 4, taxi: 4, metro: 1 }
        return (ecoScore[a.type as keyof typeof ecoScore] || 5) - (ecoScore[b.type as keyof typeof ecoScore] || 5)
      default:
        return 0
    }
  })

  const parseDuration = (duration: string): number => {
    // Simple parser for durations like "2h 30m" or "45m"
    const hours = duration.match(/(\d+)h/)?.[1] || "0"
    const minutes = duration.match(/(\d+)m/)?.[1] || "0"
    return Number.parseInt(hours) * 60 + Number.parseInt(minutes)
  }

  const transportationBudget = budget * 0.25 // Assume 25% of budget for transportation

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getCheapestOption = () => {
    return sortedTransportation.reduce((cheapest, current) => (current.cost < cheapest.cost ? current : cheapest))
  }

  const getFastestOption = () => {
    return sortedTransportation.reduce((fastest, current) =>
      parseDuration(current.duration) < parseDuration(fastest.duration) ? current : fastest,
    )
  }

  return (
    <div className="space-y-6">
      {/* Transportation Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Transportation from {startLocation} to {destination}
          </CardTitle>
          <CardDescription>
            Based on your total budget of {formatCurrency(budget)}, we recommend spending around{" "}
            {formatCurrency(transportationBudget)} on transportation.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Recommendations */}
      {sortedTransportation.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Best Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold capitalize">{getCheapestOption().type.replace("_", " ")}</div>
                  <div className="text-sm text-muted-foreground">{getCheapestOption().duration}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{formatCurrency(getCheapestOption().cost)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Fastest Option
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold capitalize">{getFastestOption().type.replace("_", " ")}</div>
                  <div className="text-sm text-muted-foreground">{getFastestOption().duration}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{formatCurrency(getFastestOption().cost)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {transportTypes.map((type) => {
            const IconComponent = type.icon
            const count = transportation.filter((t) => (type.value === "all" ? true : t.type === type.value)).length
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
                <Badge variant="secondary" className="ml-1">
                  {count}
                </Badge>
              </Button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex gap-1">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Transportation Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {sortedTransportation.map((transport, index) => (
          <TransportationCard
            key={index}
            transportation={transport}
            isSelected={selectedTransport?.type === transport.type && selectedTransport?.cost === transport.cost}
            onSelect={() => {
              setSelectedTransport(transport)
              onSelect?.(transport)
            }}
            showSelectButton={true}
          />
        ))}
      </div>

      {sortedTransportation.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No transportation options found for the selected filters.</p>
          </CardContent>
        </Card>
      )}

      {/* Selected Transportation Summary */}
      {selectedTransport && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Selected Transportation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold capitalize">{selectedTransport.type.replace("_", " ")}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedTransport.from} → {selectedTransport.to}
                </p>
                <p className="text-sm text-muted-foreground">Duration: {selectedTransport.duration}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{formatCurrency(selectedTransport.cost)}</div>
                <div className="text-sm text-muted-foreground">
                  {((selectedTransport.cost / transportationBudget) * 100).toFixed(0)}% of transport budget
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
