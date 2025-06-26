import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const filter = searchParams.get("filter") || "all"
    const search = searchParams.get("search") || ""
    const includeStats = searchParams.get("include_stats") === "true"
    const sortBy = searchParams.get("sort_by") || "created_at"
    const sortOrder = searchParams.get("sort_order") || "desc"
    const genderFilter = searchParams.get("gender_filter") || "all"
    const photoFilter = searchParams.get("photo_filter") || "all"
    const profileCompletionFilter = searchParams.get("profile_completion_filter") || "all"
    const verificationFilter = searchParams.get("verification_filter") || "all"
    const ageRangeFilter = searchParams.get("age_range_filter") || "all"

    const offset = (page - 1) * limit

    // Build the base query
    let query = supabase.from("users").select(`
        id, first_name, last_name, email, mobile_number, birthdate, gender,
        city, state, country, account_status, verification_status, created_at,
        updated_at, user_photos, is_active, email_verified, mobile_verified,
        about_me, partner_expectations, education, profession, annual_income,
        diet, temple_visit_freq, onboarding_completed, last_login_at, role,
        height, weight, marital_status, mother_tongue, religion, caste,
        subcaste, gotra, manglik, family_type, family_status, family_values,
        disability, smoking, drinking, hobbies, interests, favorite_books,
        favorite_movies, favorite_music, favorite_spiritual_quote,
        daily_spiritual_practices, spiritual_organizations
      `)

    // Apply filters
    if (filter !== "all") {
      switch (filter) {
        case "active":
          query = query.eq("is_active", true)
          break
        case "inactive":
          query = query.eq("is_active", false)
          break
        case "verified":
          query = query.eq("verification_status", "verified")
          break
        case "pending":
          query = query.eq("verification_status", "pending")
          break
        case "rejected":
          query = query.eq("verification_status", "rejected")
          break
        case "premium":
          query = query.in("account_status", ["premium", "elite", "sparsh", "sangam", "samarpan"])
          break
        case "incomplete":
          query = query.eq("onboarding_completed", false)
          break
      }
    }

    // Apply verification filter
    if (verificationFilter !== "all") {
      query = query.eq("verification_status", verificationFilter)
    }

    // Apply gender filter
    if (genderFilter !== "all") {
      query = query.eq("gender", genderFilter)
    }

    // Apply photo filter
    if (photoFilter !== "all") {
      if (photoFilter === "has_photos") {
        query = query.not("user_photos", "is", null).neq("user_photos", "{}")
      } else if (photoFilter === "no_photos") {
        query = query.or("user_photos.is.null,user_photos.eq.{}")
      }
    }

    // Apply age range filter
    if (ageRangeFilter !== "all") {
      const today = new Date()
      let minDate: Date, maxDate: Date

      switch (ageRangeFilter) {
        case "18-25":
          minDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
          maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
          break
        case "26-30":
          minDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate())
          maxDate = new Date(today.getFullYear() - 26, today.getMonth(), today.getDate())
          break
        case "31-35":
          minDate = new Date(today.getFullYear() - 35, today.getMonth(), today.getDate())
          maxDate = new Date(today.getFullYear() - 31, today.getMonth(), today.getDate())
          break
        case "36-40":
          minDate = new Date(today.getFullYear() - 40, today.getMonth(), today.getDate())
          maxDate = new Date(today.getFullYear() - 36, today.getMonth(), today.getDate())
          break
        case "40+":
          minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
          maxDate = new Date(today.getFullYear() - 40, today.getMonth(), today.getDate())
          break
        default:
          minDate = maxDate = today
      }

      if (ageRangeFilter !== "all") {
        query = query
          .gte("birthdate", minDate.toISOString().split("T")[0])
          .lte("birthdate", maxDate.toISOString().split("T")[0])
      }
    }

    // Apply search
    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,mobile_number.ilike.%${search}%`,
      )
    }

    // Get total count for pagination
    const { count } = await query

    // Apply sorting, pagination and execute query
    const { data: users, error } = await query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Filter by profile completion if needed
    let filteredUsers = users || []
    if (profileCompletionFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) => {
        const completionScore = calculateProfileCompletion(user)
        if (profileCompletionFilter === "complete") {
          return completionScore >= 80
        } else if (profileCompletionFilter === "incomplete") {
          return completionScore < 80
        }
        return true
      })
    }

    const totalPages = Math.ceil((count || 0) / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    const pagination = {
      page,
      limit,
      total: count || 0,
      totalPages,
      hasNext,
      hasPrev,
    }

    let stats = null
    if (includeStats) {
      // Fetch statistics
      const { data: allUsers } = await supabase
        .from("users")
        .select("account_status, verification_status, gender, onboarding_completed, created_at")

      if (allUsers) {
        const today = new Date()
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())

        stats = {
          totalUsers: allUsers.length,
          activeUsers: allUsers.filter((u) => u.verification_status === "verified").length,
          verifiedUsers: allUsers.filter((u) => u.verification_status === "verified").length,
          premiumUsers: allUsers.filter((u) =>
            ["premium", "elite", "sparsh", "sangam", "samarpan"].includes(u.account_status),
          ).length,
          todaySignups: allUsers.filter((u) => new Date(u.created_at) >= todayStart).length,
          totalMatches: 0, // This would need to be calculated from a matches table
          totalMessages: 0, // This would need to be calculated from a messages table
          pendingVerifications: allUsers.filter((u) => u.verification_status === "pending").length,
          maleUsers: allUsers.filter((u) => u.gender === "male").length,
          femaleUsers: allUsers.filter((u) => u.gender === "female").length,
          completedProfiles: allUsers.filter((u) => u.onboarding_completed).length,
        }
      }
    }

    return NextResponse.json({
      users: filteredUsers,
      pagination,
      stats,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateProfileCompletion(user: any): number {
  let score = 0
  const totalFields = 20

  const fields = [
    user.first_name,
    user.last_name,
    user.email,
    user.mobile_number,
    user.birthdate,
    user.gender,
    user.city,
    user.state,
    user.education,
    user.profession,
    user.about_me,
    user.partner_expectations,
    user.height,
    user.religion,
    user.mother_tongue,
    user.marital_status,
    user.diet,
    user.annual_income,
  ]

  fields.forEach((field) => {
    if (field && field.toString().trim() !== "") score += 1
  })

  if (user.user_photos && user.user_photos.length > 0) score += 1
  if (user.daily_spiritual_practices && user.daily_spiritual_practices.length > 0) score += 1

  return Math.round((score / totalFields) * 100)
}
