"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string
  read_time_minutes: number
  views_count: number
  likes_count: number
  published_at: string
  tags: string[]
  meta_title?: string
  meta_description?: string
  blog_authors: {
    name: string
    bio: string
    avatar_url: string
  }
  blog_categories: {
    name: string
    slug: string
    color: string
  }
}

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image_url: string
  read_time_minutes: number
  published_at: string
  blog_authors: {
    name: string
  }
  blog_categories: {
    name: string
    color: string
  }
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blog/posts/${slug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Blog post not found')
        } else {
          toast.error('Failed to load blog post')
        }
        return
      }

      const data = await response.json()
      setPost(data.post)
      setRelatedPosts(data.relatedPosts || [])

      // Track page view
      await fetch('/api/blog/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'page_view',
          data: { post_id: data.post.id, slug }
        })
      })

    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        })
      } catch (error) {
        // Fallback to copying URL
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-3 mt-4">$1</h3>')\
      .replace(/^\*\*(.*)\*\*/gim, '<strong
