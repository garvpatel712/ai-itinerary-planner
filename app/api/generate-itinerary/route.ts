import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

const itinerarySchema = z.object({
  destination: z.string(),
  duration: z.string(),
  totalBudget: z.number(),
  dailyItinerary: z.array(
    z.object({
      day: z.number(),
      date: z.string(),
      activities: z.array(
        z.object({
          time: z.string(),
          activity: z.string(),
          location: z.string(),
          cost: z.number(),
          description: z.string(),
          category: z.enum(["sightseeing", "food", "entertainment", "culture", "nature", "shopping"]),
        }),
      ),
      dailyBudget: z.number(),
    }),
  ),
  accommodations: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["hotel", "hostel", "airbnb", "resort", "guesthouse"]),
      pricePerNight: z.number(),
      rating: z.number(),
      location: z.string(),
      amenities: z.array(z.string()),
      description: z.string(),
    }),
  ),
  transportation: z.array(
    z.object({
      type: z.enum(["flight", "train", "bus", "car_rental", "taxi", "metro"]),
      from: z.string(),
      to: z.string(),
      cost: z.number(),
      duration: z.string(),
      description: z.string(),
    }),
  ),
  budgetBreakdown: z.object({
    accommodation: z.number(),
    transportation: z.number(),
    activities: z.number(),
    food: z.number(),
    miscellaneous: z.number(),
  }),
  tips: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const { destination, budget, duration, startLocation, interests, travelStyle } = await req.json()

    const prompt = `Create a detailed travel itinerary for:
    - Destination: ${destination}
    - Budget: $${budget} USD
    - Duration: ${duration} days
    - Starting from: ${startLocation}
    - Interests: ${interests.join(", ")}
    - Travel style: ${travelStyle}
    
    Please provide:
    1. A day-by-day itinerary with specific activities, times, and costs
    2. 3-5 accommodation options that fit the budget and travel style
    3. Transportation options from ${startLocation} to ${destination} and local transport
    4. A detailed budget breakdown
    5. Helpful travel tips specific to ${destination}
    
    Ensure all costs are realistic and the total stays within the $${budget} budget. Consider the travel style (${travelStyle}) when suggesting activities and accommodations.`

    const { object } = await generateObject({
      model: google("gemini-1.5-pro", {
        apiKey: "AIzaSyDfoZfrYIlOjPWdiGMIqjcmclKwREWMiKg",
      }),
      schema: itinerarySchema,
      prompt,
      maxTokens: 4000,
    })

    return Response.json({ itinerary: object })
  } catch (error) {
    console.error("Error generating itinerary:", error)
    return Response.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
