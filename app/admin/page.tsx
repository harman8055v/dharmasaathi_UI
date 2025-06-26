"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

interface UserType {
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
  last_login_at: string
  role: string
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

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface AdminUser {
  id: string
  email: string
  role: string
  first_name: string
  last_name: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserType[]>([])
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
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [notificationModal, setNotificationModal] = useState<{
    open: boolean
    user: UserType | null
    message: string
    type: string
  }>({
    open: false,
    user: null,
    message: "",
    type: "profile_update",
  })
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [genderFilter, setGenderFilter] = useState("all")
  const [photoFilter, setPhotoFilter] = useState("all")
  const [profileCompletionFilter, setProfileCompletionFilter] = useState("all")
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [imageZoomModal, setImageZoomModal] = useState<{
    open: boolean
    images: string[]
    currentIndex: number
  }>({
    open: false,
    images: [],
    currentIndex: 0,
  })

  useEffect(() => {
    fetchCurrentAdminUser()
    if (activeTab === "overview") {
      fetchAdminData(1, true) // Include stats for overview
    } else {
      fetchAdminData(1, false)
    }
  }, [activeTab, filterStatus, searchTerm, sortBy, sortOrder, genderFilter, photoFilter, profileCompletionFilter])

  const fetchCurrentAdminUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("id, email, role, first_name, last_name")
          .eq("id", session.user.id)
          .single()

        if (userData) {
          setAdminUser(userData)
        }
      }
    } catch (error) {
      console.error("Error fetching admin user:", error)
    }
  }

  const fetchAdminData = async (page = 1, includeStats = false) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        filter: filterStatus,
        search: searchTerm,
        include_stats: includeStats.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
        gender_filter: genderFilter,
        photo_filter: photoFilter,
        profile_completion_filter: profileCompletionFilter,
      })

      const response = await fetch(`/api/admin/dashboard?${params}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("Dashboard data received:", {
        usersCount: data.users?.length,
        pagination: data.pagination,
        stats: data.stats,
      })

      setUsers(data.users || [])
      setPagination(data.pagination)
      if (data.stats) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch admin data"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage \
