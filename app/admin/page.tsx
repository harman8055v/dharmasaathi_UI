"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  BarChart3,
  Shield,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Heart,
  Crown,
  TrendingUp,
  UserCheck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  mobile_number: string
  birthdate: string
  gender: string
  city: string
  state: string
  country: string
  account_status: string
  verification_status: string
  created_at: string
  updated_at: string
  user_photos: string[]
  is_active: boolean
  email_verified: boolean
  mobile_verified: boolean
  about_me: string
  partner_expectations: string
  education: string
  profession: string
  annual_income: string
  diet: string
  temple_visit_freq: string
  onboarding_completed: boolean
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  premiumUsers: number
  todaySignups: number
  totalMatches: number
  totalMessages: number
  pendingVerifications: number
  maleUsers: number
  femaleUsers: number
  completedProfiles: number
}

interface UserMessage {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
  sender_name: string
  receiver_name: string
}

interface UserMatch {
  id: string
  user1_id: string
  user2_id: string
  created_at: string
  match_name: string
  status: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    premiumUsers: 0,
    todaySignups: 0,
    totalMatches: 0,
    totalMessages: 0,
    pendingVerifications: 0,
    maleUsers: 0,
    femaleUsers: 0,
    completedProfiles: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userMessages, setUserMessages] = useState<UserMessage[]>([])
  const [userMatches, setUserMatches] = useState<UserMatch[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      // Fetch all users with complete data
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select(`
          id,
          first_name,
          last_name,
          email,
          mobile_number,
          birthdate,
          gender,
          city,
          state,
          country,
          account_status,
          verification_status,
          created_at,
          updated_at,
          user_photos,
          is_active,
          email_verified,
          mobile_verified,
          about_me,
          partner_expectations,
          education,
          profession,
          annual_income,
          diet,
          temple_visit_freq,
          onboarding_completed
        `)
        .order("created_at", { ascending: false })

      if (usersError) {
        console.error("Error fetching users:", usersError)
        toast({
          title: "Error",
          description: "Failed to fetch users data",
          variant: "destructive",
        })
        return
      }

      setUsers(usersData || [])

      // Calculate comprehensive stats
      const totalUsers = usersData?.length || 0
      const activeUsers = usersData?.filter((u) => u.is_active !== false).length || 0
      const verifiedUsers = usersData?.filter((u) => u.verification_status === "verified").length || 0
      const premiumUsers =
        usersData?.filter((u) => ["premium", "elite", "sparsh", "sangam", "samarpan"].includes(u.account_status))
          .length || 0

      const today = new Date().toISOString().split("T")[0]
      const todaySignups = usersData?.filter((u) => u.created_at?.startsWith(today)).length || 0

      const pendingVerifications = usersData?.filter((u) => u.verification_status === "pending").length || 0
      const maleUsers = usersData?.filter((u) => u.gender === "Male").length || 0
      const femaleUsers = usersData?.filter((u) => u.gender === "Female").length || 0
      const completedProfiles = usersData?.filter((u) => u.onboarding_completed === true).length || 0

      // Fetch matches count
      const { count: matchesCount } = await supabase
        .from("swipe_actions")
        .select("*", { count: "exact", head: true })
        .eq("action", "like")

      // Fetch messages count (if messages table exists)
      const { count: messagesCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .catch(() => ({ count: 0 }))

      setStats({
        totalUsers,
        activeUsers,
        verifiedUsers,
        premiumUsers,
        todaySignups,
        totalMatches: matchesCount || 0,
        totalMessages: messagesCount || 0,
        pendingVerifications,
        maleUsers,
        femaleUsers,
        completedProfiles,
      })
    } catch (error) {
      console.error("Error fetching admin data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: string, value?: any) => {
    setActionLoading(userId + action)
    try {
      let updateData: any = {}

      switch (action) {
        case "deactivate":
          updateData = { is_active: false }
          break
        case "activate":
          updateData = { is_active: true }
          break
        case "verify":
          updateData = { verification_status: "verified" }
          break
        case "reject":
          updateData = { verification_status: "rejected" }
          break
        case "changePlan":
          updateData = { account_status: value }
          break
        case "makeBasic":
          updateData = { account_status: "basic" }
          break
        case "makePremium":
          updateData = { account_status: "premium" }
          break
        case "makeElite":
          updateData = { account_status: "elite" }
          break
        default:
          return
      }

      const { error } = await supabase.from("users").update(updateData).eq("id", userId)

      if (error) throw error

      toast({
        title: "Success",
        description: `User ${action} completed successfully`,
      })

      // Refresh data
      await fetchAdminData()

      // Update selected user if it's the same one
      if (selectedUser?.id === userId) {
        const updatedUser = users.find((u) => u.id === userId)
        if (updatedUser) {
          setSelectedUser({ ...updatedUser, ...updateData })
        }
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const fetchUserDetails = async (user: User) => {
    setSelectedUser(user)

    try {
      // Fetch user's recent messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select(`
          id,
          sender_id,
          receiver_id,
          message,
          created_at,
          sender:sender_id(first_name, last_name),
          receiver:receiver_id(first_name, last_name)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(10)
        .catch(() => ({ data: [] }))

      // Fetch user's matches/swipes
      const { data: swipesData } = await supabase
        .from("swipe_actions")
        .select(`
          id,
          swiper_id,
          swiped_id,
          action,
          created_at,
          swiped_user:swiped_id(first_name, last_name)
        `)
        .eq("swiper_id", user.id)
        .eq("action", "like")
        .order("created_at", { ascending: false })
        .limit(10)
        .catch(() => ({ data: [] }))

      setUserMessages(messagesData || [])
      setUserMatches(swipesData || [])
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  const handleEditUser = async (updatedData: Partial<User>) => {
    if (!editingUser) return

    setActionLoading("edit")
    try {
      const { error } = await supabase.from("users").update(updatedData).eq("id", editingUser.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "User profile updated successfully",
      })

      setEditingUser(null)
      await fetchAdminData()
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user profile",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const exportData = async () => {
    try {
      const csvContent = [
        ["Name", "Email", "Phone", "Gender", "Location", "Status", "Verification", "Joined"].join(","),
        ...users.map((user) =>
          [
            `${user.first_name} ${user.last_name}`,
            user.email,
            user.mobile_number,
            user.gender,
            `${user.city}, ${user.state}`,
            user.account_status,
            user.verification_status,
            new Date(user.created_at).toLocaleDateString(),
          ].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `dharmasaathi-users-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "User data exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile_number?.includes(searchTerm)

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && user.is_active !== false) ||
      (filterStatus === "inactive" && user.is_active === false) ||
      (filterStatus === "verified" && user.verification_status === "verified") ||
      (filterStatus === "pending" && user.verification_status === "pending") ||
      (filterStatus === "rejected" && user.verification_status === "rejected") ||
      (filterStatus === "premium" &&
        ["premium", "elite", "sparsh", "sangam", "samarpan"].includes(user.account_status)) ||
      (filterStatus === "incomplete" && !user.onboarding_completed)

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "premium":
      case "elite":
      case "sparsh":
      case "sangam":
      case "samarpan":
        return "bg-purple-100 text-purple-800"
      case "basic":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateAge = (birthdate: string) => {
    if (!birthdate) return "N/A"
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="DharmaSaathi" width={120} height={40} className="h-10 w-auto" />
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Admin Dashboard
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchAdminData} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Verification</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+{stats.todaySignups} today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.verifiedUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalUsers > 0 ? ((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1) : 0}% verified
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                  <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.premiumUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0}% premium
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingVerifications.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gender Split</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.maleUsers}M / {stats.femaleUsers}F
                  </div>
                  <p className="text-xs text-muted-foreground">Male / Female ratio</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Complete Profiles</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedProfiles.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalUsers > 0 ? ((stats.completedProfiles / stats.totalUsers) * 100).toFixed(1) : 0}%
                    complete
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalMatches.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Successful connections</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
                <CardDescription>Latest user registrations and profile updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 8).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.user_photos?.[0] || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.first_name?.[0] || "U"}
                            {user.last_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.first_name || "Unknown"} {user.last_name || "User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.city && user.state ? `${user.city}, ${user.state}` : "Location not set"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(user.verification_status)}>
                          {user.verification_status || "pending"}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending Verification</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="premium">Premium Users</SelectItem>
                      <SelectItem value="incomplete">Incomplete Profiles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
                <CardDescription>Manage all user accounts and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.user_photos?.[0] || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.first_name?.[0] || "U"}
                            {user.last_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {user.first_name || "Unknown"} {user.last_name || "User"}
                            </h3>
                            {user.is_active === false && <Badge variant="destructive">Inactive</Badge>}
                            {!user.onboarding_completed && <Badge variant="outline">Incomplete</Badge>}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email || "No email"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.mobile_number || "No phone"}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {user.city && user.state ? `${user.city}, ${user.state}` : "Location not set"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(user.verification_status)}>
                              {user.verification_status || "pending"}
                            </Badge>
                            <Badge className={getStatusColor(user.account_status)}>
                              {user.account_status || "basic"}
                            </Badge>
                            {user.gender && <Badge variant="outline">{user.gender}</Badge>}
                            {user.birthdate && <Badge variant="outline">{calculateAge(user.birthdate)} years</Badge>}
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={actionLoading?.startsWith(user.id)}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => fetchUserDetails(user)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.verification_status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, "verify")}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, "reject")}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "makeBasic")}>
                            <Crown className="w-4 h-4 mr-2" />
                            Make Basic
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "makePremium")}>
                            <Crown className="w-4 h-4 mr-2" />
                            Make Premium
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "makeElite")}>
                            <Crown className="w-4 h-4 mr-2" />
                            Make Elite
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.is_active !== false ? (
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, "deactivate")}>
                              <Ban className="w-4 h-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, "activate")}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications ({stats.pendingVerifications})</CardTitle>
                <CardDescription>Review and approve user verification requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter((u) => u.verification_status === "pending")
                    .map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.user_photos?.[0] || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.first_name?.[0] || "U"}
                              {user.last_name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">
                              {user.first_name || "Unknown"} {user.last_name || "User"}
                            </h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{user.gender || "Not specified"}</Badge>
                              {user.birthdate && <Badge variant="outline">{calculateAge(user.birthdate)} years</Badge>}
                              <Badge variant="outline">
                                {user.city && user.state ? `${user.city}, ${user.state}` : "Location not set"}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              Submitted {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, "reject")}
                            disabled={actionLoading === user.id + "reject"}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(user.id, "verify")}
                            disabled={actionLoading === user.id + "verify"}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}

                  {users.filter((u) => u.verification_status === "pending").length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No pending verifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                  <CardDescription>Breakdown of user characteristics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Male Users</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${stats.totalUsers > 0 ? (stats.maleUsers / stats.totalUsers) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                        <Badge variant="outline">{stats.maleUsers}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Female Users</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full"
                            style={{
                              width: `${stats.totalUsers > 0 ? (stats.femaleUsers / stats.totalUsers) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                        <Badge variant="outline">{stats.femaleUsers}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Verified Users</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${stats.totalUsers > 0 ? (stats.verifiedUsers / stats.totalUsers) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                        <Badge variant="outline">{stats.verifiedUsers}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Premium Users</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{
                              width: `${stats.totalUsers > 0 ? (stats.premiumUsers / stats.totalUsers) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                        <Badge variant="outline">{stats.premiumUsers}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status Distribution</CardTitle>
                  <CardDescription>User account types and verification status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Verified</span>
                      <Badge className="bg-green-100 text-green-800">{stats.verifiedUsers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{stats.pendingVerifications}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rejected</span>
                      <Badge className="bg-red-100 text-red-800">
                        {users.filter((u) => u.verification_status === "rejected").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Complete Profiles</span>
                      <Badge className="bg-blue-100 text-blue-800">{stats.completedProfiles}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Incomplete Profiles</span>
                      <Badge className="bg-gray-100 text-gray-800">{stats.totalUsers - stats.completedProfiles}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Signups Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>User registrations over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() - i)
                    const dateStr = date.toISOString().split("T")[0]
                    const count = users.filter((u) => u.created_at?.startsWith(dateStr)).length

                    return (
                      <div key={dateStr} className="flex items-center justify-between">
                        <span className="text-sm">{date.toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (count /
                                    Math.max(
                                      ...Array.from({ length: 7 }, (_, j) => {
                                        const d = new Date()
                                        d.setDate(d.getDate() - j)
                                        return users.filter((u) =>
                                          u.created_at?.startsWith(d.toISOString().split("T")[0]),
                                        ).length
                                      }),
                                    )) *
                                    100,
                                  100,
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete profile information and activity for {selectedUser?.first_name} {selectedUser?.last_name}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.user_photos?.[0] || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.first_name?.[0] || "U"}
                    {selectedUser.last_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedUser.first_name || "Unknown"} {selectedUser.last_name || "User"}
                  </h3>
                  <p className="text-gray-600">
                    {selectedUser.birthdate ? `${calculateAge(selectedUser.birthdate)} years old` : "Age not specified"}
                    , {selectedUser.gender || "Gender not specified"}
                  </p>
                  <p className="text-gray-600">
                    {selectedUser.city && selectedUser.state
                      ? `${selectedUser.city}, ${selectedUser.state}`
                      : "Location not set"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getStatusColor(selectedUser.verification_status)}>
                      {selectedUser.verification_status || "pending"}
                    </Badge>
                    <Badge className={getStatusColor(selectedUser.account_status)}>
                      {selectedUser.account_status || "basic"}
                    </Badge>
                    {selectedUser.onboarding_completed && (
                      <Badge className="bg-green-100 text-green-800">Complete Profile</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <Mail className="w-4 h-4 inline mr-2" />
                      {selectedUser.email || "No email"}
                      {selectedUser.email_verified && <CheckCircle className="w-3 h-3 inline ml-1 text-green-500" />}
                    </p>
                    <p>
                      <Phone className="w-4 h-4 inline mr-2" />
                      {selectedUser.mobile_number || "No phone"}
                      {selectedUser.mobile_verified && <CheckCircle className="w-3 h-3 inline ml-1 text-green-500" />}
                    </p>
                    <p>
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Joined {new Date(selectedUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Profile Details</h4>
                  <div className="space-y-2 text-sm">
                    <p>Education: {selectedUser.education || "Not specified"}</p>
                    <p>Profession: {selectedUser.profession || "Not specified"}</p>
                    <p>Income: {selectedUser.annual_income || "Not specified"}</p>
                    <p>Diet: {selectedUser.diet || "Not specified"}</p>
                    <p>Temple Visits: {selectedUser.temple_visit_freq || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* About Me */}
              {selectedUser.about_me && (
                <div>
                  <h4 className="font-medium mb-2">About Me</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedUser.about_me}</p>
                </div>
              )}

              {/* Partner Expectations */}
              {selectedUser.partner_expectations && (
                <div>
                  <h4 className="font-medium mb-2">Partner Expectations</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedUser.partner_expectations}</p>
                </div>
              )}

              {/* Photos */}
              {selectedUser.user_photos && selectedUser.user_photos.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Photos ({selectedUser.user_photos.length})</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedUser.user_photos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Messages */}
              {userMessages.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recent Messages</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {userMessages.map((message) => (
                      <div key={message.id} className="text-sm bg-gray-50 p-2 rounded">
                        <p className="font-medium">
                          {message.sender_name} → {message.receiver_name}
                        </p>
                        <p className="text-gray-600">{message.message}</p>
                        <p className="text-xs text-gray-400">{new Date(message.created_at).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => setEditingUser(selectedUser)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                {selectedUser.verification_status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleUserAction(selectedUser.id, "verify")}
                      disabled={actionLoading === selectedUser.id + "verify"}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUserAction(selectedUser.id, "reject")}
                      disabled={actionLoading === selectedUser.id + "reject"}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedUser.is_active !== false ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUserAction(selectedUser.id, "deactivate")}
                    disabled={actionLoading === selectedUser.id + "deactivate"}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleUserAction(selectedUser.id, "activate")}
                    disabled={actionLoading === selectedUser.id + "activate"}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>Update user information and settings</DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={editingUser.first_name || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={editingUser.last_name || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input
                  id="mobile_number"
                  value={editingUser.mobile_number || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, mobile_number: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={editingUser.city || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={editingUser.state || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, state: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="about_me">About Me</Label>
                <Textarea
                  id="about_me"
                  value={editingUser.about_me || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, about_me: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="verification_status">Verification Status</Label>
                  <Select
                    value={editingUser.verification_status || "pending"}
                    onValueChange={(value) => setEditingUser({ ...editingUser, verification_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="account_status">Account Status</Label>
                  <Select
                    value={editingUser.account_status || "basic"}
                    onValueChange={(value) => setEditingUser({ ...editingUser, account_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                      <SelectItem value="sparsh">Sparsh</SelectItem>
                      <SelectItem value="sangam">Sangam</SelectItem>
                      <SelectItem value="samarpan">Samarpan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleEditUser(editingUser)} disabled={actionLoading === "edit"}>
                  {actionLoading === "edit" ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
