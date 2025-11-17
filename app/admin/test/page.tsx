"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Users, MapPin, DollarSign } from "lucide-react"

export default function AdminDashboardTest() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchTestData()
  }, [])

  const fetchTestData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching test admin data...')
      const response = await fetch('/api/admin/dashboard-simple')
      const result = await response.json()

      console.log('Test data response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch test data')
      }

      setData(result)
    } catch (err) {
      console.error('Error fetching test data:', err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading test admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchTestData}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance mb-2">Admin Dashboard Test</h1>
              <p className="text-muted-foreground">Testing real data integration</p>
            </div>
            <Button variant="outline" onClick={fetchTestData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats?.users?.total?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                {data?.stats?.users?.newThisMonth || 0} new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Itineraries</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats?.itineraries?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {data?.stats?.itineraries?.active || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget Generated</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data?.stats?.itineraries?.totalBudget || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatCurrency(data?.stats?.itineraries?.avgBudget || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Test Mode</CardTitle>
              <Badge variant="outline">Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.users?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                users loaded
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>Sample of loaded data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Users ({data?.users?.length || 0})</h3>
                <div className="space-y-2">
                  {data?.users?.slice(0, 3).map((user: any, index: number) => (
                    <div key={user.id} className="flex justify-between items-center p-2 border rounded">
                      <span>{user.name}</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Itineraries ({data?.itineraries?.length || 0})</h3>
                <div className="space-y-2">
                  {data?.itineraries?.slice(0, 3).map((itinerary: any, index: number) => (
                    <div key={itinerary.id} className="flex justify-between items-center p-2 border rounded">
                      <span>{itinerary.destination}</span>
                      <span className="text-sm text-muted-foreground">{formatCurrency(itinerary.budget)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}