"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Train, Bus, Car, Clock, MapPin, DollarSign, Zap, Leaf } from "lucide-react"

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

interface TransportationCardProps {
  transportation: Transportation
  isSelected?: boolean
  onSelect?: () => void
  showSelectButton?: boolean
}

const transportIcons = {
  flight: Plane,
  train: Train,
  bus: Bus,
  car_rental: Car,
  taxi: Car,
  metro: Train,
}

const transportColors = {
  flight: "bg-blue-100 text-blue-800",
  train: "bg-green-100 text-green-800",
  bus: "bg-orange-100 text-orange-800",
  car_rental: "bg-purple-100 text-purple-800",
  taxi: "bg-yellow-100 text-yellow-800",
  metro: "bg-gray-100 text-gray-800",
}

const getSpeedBadge = (type: string) => {
  switch (type) {
    case "flight":
      return { icon: Zap, label: "Fastest", color: "bg-blue-500" }
    case "train":
      return { icon: Zap, label: "Fast", color: "bg-green-500" }
    case "bus":
      return { icon: Leaf, label: "Eco-friendly", color: "bg-green-600" }
    default:
      return null
  }
}

export function TransportationCard({
  transportation,
  isSelected = false,
  onSelect,
  showSelectButton = false,
}: TransportationCardProps) {
  const IconComponent = transportIcons[transportation.type as keyof typeof transportIcons] || Car
  const speedBadge = getSpeedBadge(transportation.type)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg capitalize">{transportation.type.replace("_", " ")}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {transportation.duration}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="secondary"
              className={transportColors[transportation.type as keyof typeof transportColors] || ""}
            >
              {transportation.type.replace("_", " ")}
            </Badge>
            {speedBadge && (
              <Badge variant="secondary" className={`${speedBadge.color} text-white`}>
                <speedBadge.icon className="h-3 w-3 mr-1" />
                {speedBadge.label}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Route */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{transportation.from}</span>
          <span className="text-muted-foreground">→</span>
          <span className="font-medium">{transportation.to}</span>
        </div>

        {/* Times */}
        {transportation.departureTime && transportation.arrivalTime && (
          <div className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-3">
            <div>
              <div className="font-medium">Departure</div>
              <div className="text-muted-foreground">{transportation.departureTime}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">Arrival</div>
              <div className="text-muted-foreground">{transportation.arrivalTime}</div>
            </div>
          </div>
        )}

        {/* Provider and Class */}
        {(transportation.provider || transportation.class) && (
          <div className="flex items-center gap-4 text-sm">
            {transportation.provider && (
              <div>
                <span className="text-muted-foreground">Provider: </span>
                <span className="font-medium">{transportation.provider}</span>
              </div>
            )}
            {transportation.class && (
              <div>
                <span className="text-muted-foreground">Class: </span>
                <span className="font-medium">{transportation.class}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground">{transportation.description}</p>

        {/* Emissions */}
        {transportation.emissions && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Leaf className="h-4 w-4" />
            <span>{transportation.emissions} CO₂ emissions</span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{formatCurrency(transportation.cost)}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Details
            </Button>
            {showSelectButton && (
              <Button size="sm" onClick={onSelect} variant={isSelected ? "secondary" : "default"}>
                {isSelected ? "Selected" : "Select"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
