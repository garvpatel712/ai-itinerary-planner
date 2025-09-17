"use client"

import { useState } from "react"
import { ItineraryDisplay } from "@/components/itinerary-display"

// Updated Itinerary interface to match the new data structure
interface Itinerary {
  destination: string
  budget: number
  duration: number
  itinerary: Array<{
    day: number
    activities: Array<{
      time: string
      activity: string
      cost: number
    }>
  }>
  accommodationOptions: Array<{
    name: string
    type: string
    pricePerNight: number
    location: string
    amenities: string[]
  }>
  transportation: {
    toDestination: string
    localTransport: string
  }
  budgetBreakdown: {
    travel: number
    accommodation: number
    food: number
    activities: number
    misc: number
  }
  travelTips: string[]
}

const hardcodedItinerary: Itinerary = {
  destination: "Matheran",
  budget: 2000,
  duration: 4,
  itinerary: [
    {
      day: 1,
      activities: [
        { time: "Evening", activity: "Depart from Ahmedabad by overnight train (Sleeper Class) to Neral.", cost: 400 },
        { time: "Morning", activity: "Arrive at Neral station. Take a shared taxi from Neral to Dasturi Naka (base point of Matheran).", cost: 70 },
        { time: "Late Morning", activity: "Walk from Dasturi Naka to Matheran Market area (approx. 30-45 minutes). Check into your budget accommodation.", cost: 0 },
        { time: "Afternoon", activity: "Lunch at a local eatery (Pithla Bhakri/Vada Pav).", cost: 40 },
        { time: "Afternoon", activity: "Walk to Charlotte Lake and Echo Point, enjoying the serene nature.", cost: 0 },
        { time: "Evening", activity: "Sunset views from Porcupine Point (also known as Sunset Point).", cost: 0 },
        { time: "Night", activity: "Dinner at a budget-friendly local dhaba.", cost: 40 },
      ],
    },
    {
      day: 2,
      activities: [
        { time: "Morning", activity: "Early morning hike to Louisa Point and Lion\'s Head Point for panoramic views and sunrise.", cost: 0 },
        { time: "Morning", activity: "Breakfast (Vada Pav/Poha with chai) at a local stall.", cost: 25 },
        { time: "Late Morning", activity: "Explore One Tree Hill Point, Shivaji\'s Ladder, and Monkey Point via walking trails.", cost: 0 },
        { time: "Afternoon", activity: "Lunch at a local eatery.", cost: 40 },
        { time: "Afternoon", activity: "Leisure time to explore Matheran Market or relax amidst nature.", cost: 0 },
        { time: "Evening", activity: "Visit Rambagh Point for another perspective of the valley.", cost: 0 },
        { time: "Night", activity: "Dinner at a local restaurant.", cost: 40 },
      ],
    },
    {
      day: 3,
      activities: [
        { time: "Morning", activity: "Visit Alexander Point and Panorama Point for breathtaking views of the plains and hills.", cost: 0 },
        { time: "Morning", activity: "Breakfast at a local stall.", cost: 25 },
        { time: "Late Morning", activity: "Explore Little Chowk Point and Big Chowk Point, known for unique rock formations.", cost: 0 },
        { time: "Afternoon", activity: "Lunch at a local eatery.", cost: 40 },
        { time: "Late Afternoon", activity: "Last minute nature walk or revisit a favourite point. Prepare for departure.", cost: 0 },
        { time: "Evening", activity: "Dinner. Walk back to Dasturi Naka. Take a shared taxi from Dasturi Naka to Neral station.", cost: 70 },
        { time: "Night", activity: "Board an overnight train (Sleeper Class) from Neral back to Ahmedabad.", cost: 400 },
      ],
    },
    {
      day: 4,
      activities: [
        { time: "Morning", activity: "Arrive back in Ahmedabad, concluding your trip.", cost: 0 },
      ],
    },
  ],
  accommodationOptions: [
    { name: "Budget Guesthouse / Homestay", type: "Guesthouse", pricePerNight: 250, location: "Matheran Market Area", amenities: ["Fan", "Basic Cot", "Shared Bathroom (likely)"] },
    { name: "Hotel Sai Ganesh (Basic Room)", type: "Budget Hotel", pricePerNight: 300, location: "Near Matheran Market", amenities: ["Fan", "Attached Basic Bathroom"] },
    { name: "Local Dormitory Stay", type: "Dormitory", pricePerNight: 200, location: "Matheran Market Area", amenities: ["Shared Dormitory", "Basic Facilities"] },
  ],
  transportation: {
    toDestination: "Train (Sleeper Class) from Ahmedabad to Neral Junction, then Shared Taxi from Neral to Dasturi Naka, followed by a walk to Matheran.",
    localTransport: "Primarily walking. Matheran is a vehicle-free hill station. Horseback riding or hand-pulled rickshaws are available at extra cost (not included in this budget).",
  },
  budgetBreakdown: { travel: 940, accommodation: 750, food: 290, activities: 0, misc: 20 },
  travelTips: [
    "This is an extremely tight budget for a 4-day trip from Ahmedabad. Adhering to the costs strictly is crucial.",
    "Pack light, comfortable walking shoes are essential as Matheran is vehicle-free.",
    "Carry your own reusable water bottle to save money and reduce plastic waste.",
    "Bargain for shared taxis from Neral to Dasturi Naka.",
    "Stick to local street food like Vada Pav, Poha, Bhajiyas, and simple Thalis to keep food costs down. Consider packing some dry snacks from Ahmedabad.",
    "Book your train tickets (Ahmedabad-Neral-Ahmedabad) well in advance, especially for sleeper class.",
    "Carry sufficient cash as ATM availability/functionality can be unpredictable in Matheran.",
    "Be mindful of monkeys, especially when carrying food.",
    "Embrace walking and enjoy the natural beauty. All viewpoints mentioned are accessible by foot and are free of charge.",
  ],
};

export default function TestPage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(hardcodedItinerary)

  const handleReset = () => {
    setItinerary(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {itinerary && <ItineraryDisplay itinerary={itinerary} onReset={handleReset} />}
      </div>
    </main>
  )
}
