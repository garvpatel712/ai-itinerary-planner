"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plane, MapPin, Calendar, DollarSign } from "lucide-react"

export function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Plane className="h-12 w-12 text-primary animate-bounce" />
                <Loader2 className="h-6 w-6 text-secondary animate-spin absolute -top-1 -right-1" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Creating Your Perfect Itinerary</h2>
            <p className="text-muted-foreground">
              Our AI is analyzing your preferences and crafting a personalized travel plan...
            </p>
          </div>

          {/* Loading Steps */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-muted-foreground">Researching destinations and attractions...</span>
              <Loader2 className="h-4 w-4 animate-spin text-primary ml-auto" />
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-muted-foreground">Planning daily activities...</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
                <DollarSign className="h-4 w-4" />
              </div>
              <span className="text-muted-foreground">Optimizing budget allocation...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
