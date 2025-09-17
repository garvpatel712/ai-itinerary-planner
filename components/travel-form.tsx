"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Calendar, Users, Heart, Loader2 } from "lucide-react"
import { FaRupeeSign } from "react-icons/fa"

interface TravelPreferences {
  destination: string
  budget: number
  duration: number
  startLocation: string
  interests: string[]
  travelStyle: string
}

interface TravelFormProps {
  onSubmit: (preferences: TravelPreferences) => void
  isLoading?: boolean
}

const interestOptions = [
  { id: "culture", label: "Culture & History", icon: "🏛️" },
  { id: "nature", label: "Nature & Outdoors", icon: "🌲" },
  { id: "food", label: "Food & Dining", icon: "🍽️" },
  { id: "nightlife", label: "Nightlife & Entertainment", icon: "🎭" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "adventure", label: "Adventure Sports", icon: "🏔️" },
  { id: "relaxation", label: "Relaxation & Wellness", icon: "🧘" },
  { id: "photography", label: "Photography", icon: "📸" },
]

const travelStyles = [
  { value: "budget", label: "Budget Traveler", description: "Hostels, street food, free activities" },
  { value: "mid-range", label: "Mid-Range", description: "3-star hotels, mix of experiences" },
  { value: "luxury", label: "Luxury", description: "High-end accommodations and experiences" },
  { value: "backpacker", label: "Backpacker", description: "Flexible, spontaneous, budget-conscious" },
  { value: "family", label: "Family-Friendly", description: "Kid-friendly activities and accommodations" },
]

export function TravelForm({ onSubmit, isLoading = false }: TravelFormProps) {
  const [formData, setFormData] = useState({
    destination: "",
    budget: "",
    duration: "",
    startLocation: "",
    interests: [] as string[],
    travelStyle: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.destination.trim()) newErrors.destination = "Destination is required"
    if (!formData.budget || Number(formData.budget) <= 0) newErrors.budget = "Please enter a valid budget"
    if (!formData.duration || Number(formData.duration) <= 0) newErrors.duration = "Please enter a valid duration"
    if (!formData.startLocation.trim()) newErrors.startLocation = "Starting location is required"
    if (formData.interests.length === 0) newErrors.interests = "Please select at least one interest"
    if (!formData.travelStyle) newErrors.travelStyle = "Please select a travel style"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        destination: formData.destination,
        budget: Number(formData.budget),
        duration: Number(formData.duration),
        startLocation: formData.startLocation,
        interests: formData.interests,
        travelStyle: formData.travelStyle,
      })
    }
  }

  const handleInterestChange = (interestId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked ? [...prev.interests, interestId] : prev.interests.filter((id) => id !== interestId),
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Plan Your Perfect Trip</CardTitle>
        <CardDescription>
          Tell us about your travel preferences and we'll create a personalized itinerary just for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={isLoading} className="space-y-6">
            {/* Form fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Where do you want to go?
                </Label>
                <Input
                  id="destination"
                  placeholder="e.g., Paris, Tokyo, New York"
                  value={formData.destination}
                  onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                  className={errors.destination ? "border-destructive" : ""}
                />
                {errors.destination && <p className="text-sm text-destructive">{errors.destination}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startLocation" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Starting from
                </Label>
                <Input
                  id="startLocation"
                  placeholder="e.g., Los Angeles, London"
                  value={formData.startLocation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startLocation: e.target.value }))}
                  className={errors.startLocation ? "border-destructive" : ""}
                />
                {errors.startLocation && <p className="text-sm text-destructive">{errors.startLocation}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <FaRupeeSign className="h-4 w-4 text-primary" />
                  Total Budget (INR)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 150000"
                  value={formData.budget}
                  onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                  className={errors.budget ? "border-destructive" : ""}
                />
                {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Duration (days)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 7"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  className={errors.duration ? "border-destructive" : ""}
                />
                {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Travel Style
              </Label>
              <Select
                value={formData.travelStyle}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, travelStyle: value }))}
              >
                <SelectTrigger className={errors.travelStyle ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select your travel style" />
                </SelectTrigger>
                <SelectContent>
                  {travelStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      <div>
                        <div className="font-medium">{style.label}</div>
                        <div className="text-sm text-muted-foreground">{style.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.travelStyle && <p className="text-sm text-destructive">{errors.travelStyle}</p>}
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                What interests you? (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map((interest) => (
                  <div key={interest.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest.id}
                      checked={formData.interests.includes(interest.id)}
                      onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                    />
                    <Label htmlFor={interest.id} className="text-sm font-normal cursor-pointer">
                      <span className="mr-1">{interest.icon}</span>
                      {interest.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.interests && <p className="text-sm text-destructive">{errors.interests}</p>}
            </div>
          </fieldset>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate My Itinerary"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
