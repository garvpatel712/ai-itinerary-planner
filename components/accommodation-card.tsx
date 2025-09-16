"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Heart, ExternalLink } from "lucide-react"

interface Accommodation {
  name: string
  type: string
  pricePerNight: number
  rating: number
  location: string
  amenities: string[]
  description: string
  image?: string
}

interface AccommodationCardProps {
  accommodation: Accommodation
  isSelected?: boolean
  onSelect?: () => void
  showSelectButton?: boolean
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  gym: Dumbbell,
  pool: "🏊",
  spa: "🧘",
  restaurant: "🍽️",
  bar: "🍸",
  "room service": "🛎️",
  "air conditioning": "❄️",
  "pet friendly": "🐕",
  "business center": "💼",
}

const typeColors = {
  hotel: "bg-blue-100 text-blue-800",
  hostel: "bg-green-100 text-green-800",
  airbnb: "bg-pink-100 text-pink-800",
  resort: "bg-purple-100 text-purple-800",
  guesthouse: "bg-orange-100 text-orange-800",
}

export function AccommodationCard({
  accommodation,
  isSelected = false,
  onSelect,
  showSelectButton = false,
}: AccommodationCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const renderAmenityIcon = (amenity: string) => {
    const IconComponent = amenityIcons[amenity.toLowerCase()]
    if (typeof IconComponent === "string") {
      return <span className="text-sm">{IconComponent}</span>
    }
    if (IconComponent) {
      return <IconComponent className="h-3 w-3" />
    }
    return <span className="w-3 h-3 rounded-full bg-primary/20" />
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg leading-tight">{accommodation.name}</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsFavorited(!isFavorited)}>
                <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </Button>
            </div>
            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {accommodation.location}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{accommodation.rating}</span>
            </div>
            <Badge variant="secondary" className={typeColors[accommodation.type as keyof typeof typeColors] || ""}>
              {accommodation.type}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Image placeholder */}
        <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
          <img
            src={`/abstract-geometric-shapes.png?height=128&width=300&query=${encodeURIComponent(
              `${accommodation.name} ${accommodation.type} ${accommodation.location}`,
            )}`}
            alt={accommodation.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{accommodation.description}</p>

        {/* Amenities */}
        <div>
          <h5 className="font-medium text-sm mb-2">Amenities</h5>
          <div className="flex flex-wrap gap-2">
            {accommodation.amenities.slice(0, 6).map((amenity, index) => (
              <div key={index} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                {renderAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
            {accommodation.amenities.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{accommodation.amenities.length - 6} more
              </Badge>
            )}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <span className="text-2xl font-bold">{formatCurrency(accommodation.pricePerNight)}</span>
            <span className="text-sm text-muted-foreground ml-1">/ night</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              View
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
