"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  MapPin,
  DollarSign,
  TrendingUp,
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  Filter,
  ChevronDown,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { supabase } from '@/lib/supabaseClient'

interface AdminStats {
  users: {
    total: number
    active: number
    newThisMonth: number
  }
  itineraries: {
    total: number
    active: number
    completed: number
    draft: number
    avgBudget: number
    totalBudget: number
  }
  totalRevenue: number
  avgTripCost: number
}

interface UserData {
  id: string
  name: string
  email: string
  joinDate: string
  totalTrips: number
  totalSpent: number
  status: string
  location?: string
  bio?: string
}

interface ItineraryData {
  id: string
  user: string
  userEmail?: string
  destination: string
  duration: number
  budget: number
  status: string
  createdAt: string
  startLocation?: string
  summary?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [itineraries, setItineraries] = useState<ItineraryData[]>([])
  const [recentActivity, setRecentActivity] = useState<ItineraryData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setError("Please log in to access admin dashboard")
        return
      }

      // Fetch admin data
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch admin data')
      }

      setStats(data.stats)
      setUsers(data.users)
      setItineraries(data.itineraries)
      setRecentActivity(data.recentActivity)
    } catch (err) {
      console.error("Error fetching admin data:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: 'activate' | 'suspend' | 'view') => {
    try {
      if (action === 'view') {
        router.push(`/admin/users/${userId}`)
        return
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: action === 'activate' ? 'active' : 'suspended',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      // Refresh the data
      fetchAdminData()
    } catch (err) {
      console.error(`Error ${action}ing user:`, err)
      alert(`Failed to ${action} user: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleItineraryAction = async (itineraryId: string, action: 'view' | 'flag') => {
    try {
      if (action === 'view') {
        router.push(`/admin/itineraries/${itineraryId}`)
        return
      }

      if (action === 'flag') {
        const response = await fetch(`/api/admin/itineraries/${itineraryId}/flag`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to flag itinerary')
        }

        alert('Itinerary flagged successfully')
        fetchAdminData()
      }
    } catch (err) {
      console.error(`Error ${action}ing itinerary:`, err)
      alert(`Failed to ${action} itinerary: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "suspended":
      case "banned":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()),
  )

  const filteredItineraries = itineraries.filter(
    (itinerary) =>
      (itinerary.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itinerary.user.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || itinerary.status === statusFilter)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
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
            <div className="flex gap-2">
              <Button onClick={fetchAdminData}>Try Again</Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
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
              <h1 className="text-3xl font-bold text-balance mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users, itineraries, and system analytics</p>
            </div>
            <Button variant="outline" onClick={fetchAdminData}>
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
              <div className="text-2xl font-bold">{stats?.users.total.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.users.newThisMonth || 0} new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Itineraries</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.itineraries.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.itineraries.active || 0} active, {stats?.itineraries.completed || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget Generated</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.itineraries.totalBudget || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatCurrency(stats?.itineraries.avgBudget || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentActivity.length}</div>
              <p className="text-xs text-muted-foreground">
                itineraries this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="itineraries">Itineraries ({itineraries.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest itineraries created</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{activity.destination}</div>
                          <div className="text-sm text-muted-foreground">
                            by {activity.user} • {activity.duration} days
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(activity.budget)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(activity.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentActivity.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                  <CardDescription>System overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Active Users</span>
                      <span className="font-medium">{stats?.users.active || 0} / {stats?.users.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Completed Trips</span>
                      <span className="font-medium">{stats?.itineraries.completed || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Draft Itineraries</span>
                      <span className="font-medium">{stats?.itineraries.draft || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium">
                        {stats?.itineraries.total ? Math.round((stats.itineraries.completed / stats.itineraries.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-8 w-[300px]"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Trips</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(user.joinDate)}</TableCell>
                        <TableCell>{user.totalTrips}</TableCell>
                        <TableCell>{formatCurrency(user.totalSpent)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'view')}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleUserAction(user.id, 'suspend')}>
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No users found matching your search
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itineraries" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Itinerary Management</CardTitle>
                    <CardDescription>Monitor and manage user itineraries</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search itineraries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-[300px]"
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Status: {statusFilter === 'all' ? 'All' : statusFilter}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={statusFilter === 'all'}
                          onCheckedChange={() => setStatusFilter('all')}
                        >
                          All Status
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={statusFilter === 'active'}
                          onCheckedChange={() => setStatusFilter('active')}
                        >
                          Active
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={statusFilter === 'completed'}
                          onCheckedChange={() => setStatusFilter('completed')}
                        >
                          Completed
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={statusFilter === 'draft'}
                          onCheckedChange={() => setStatusFilter('draft')}
                        >
                          Draft
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={statusFilter === 'flagged'}
                          onCheckedChange={() => setStatusFilter('flagged')}
                        >
                          Flagged
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItineraries.map((itinerary) => (
                      <TableRow key={itinerary.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{itinerary.user}</div>
                            <div className="text-sm text-muted-foreground">{itinerary.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{itinerary.destination}</TableCell>
                        <TableCell>{itinerary.duration} days</TableCell>
                        <TableCell>{formatCurrency(itinerary.budget)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(itinerary.status)}>{itinerary.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(itinerary.createdAt)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleItineraryAction(itinerary.id, 'view')}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleItineraryAction(itinerary.id, 'flag')}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Flag Content
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredItineraries.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No itineraries found matching your search
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Analytics
                  </CardTitle>
                  <CardDescription>Key metrics and performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stats?.itineraries.total ? Math.round((stats.itineraries.completed / stats.itineraries.total) * 100) : 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stats?.users.total ? Math.round((stats.users.active / stats.users.total) * 100) : 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">User Activity Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stats?.users.newThisMonth || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">New Users This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Budget Distribution
                  </CardTitle>
                  <CardDescription>How budgets are distributed across itineraries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Low Budget (&lt; ₹10,000)</span>
                      <span className="font-medium">
                        {itineraries.filter(it => it.budget < 10000).length} itineraries
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Medium Budget (₹10,000 - ₹50,000)</span>
                      <span className="font-medium">
                        {itineraries.filter(it => it.budget >= 10000 && it.budget < 50000).length} itineraries
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">High Budget (≥ ₹50,000)</span>
                      <span className="font-medium">
                        {itineraries.filter(it => it.budget >= 50000).length} itineraries
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
