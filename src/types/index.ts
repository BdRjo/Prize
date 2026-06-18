// Types for the CMS data models

export interface User {
  id: string
  email: string
  name: string
  password: string
  role: 'admin' | 'editor' | 'viewer'
  avatar?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: string
  createdAt: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string
  group: string
  label: string
  type: string
}

export interface Navigation {
  id: string
  label: string
  url: string
  parentId?: string
  order: number
  active: boolean
  target: string
}

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  builderData?: string
  metaTitle?: string
  metaDesc?: string
  metaImage?: string
  published: boolean
  order: number
  template: string
  authorId?: string
  createdAt: string
  updatedAt: string
}

export interface News {
  id: string
  title: string
  slug: string
  summary?: string
  content: string
  image?: string
  categoryId?: string
  featured: boolean
  published: boolean
  authorId?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface NewsCategory {
  id: string
  name: string
  slug: string
  icon?: string
  color?: string
  order: number
}

export interface AwardCategory {
  id: string
  title: string
  slug: string
  description?: string
  icon?: string
  image?: string
  order: number
  active: boolean
  criteria?: string
  createdAt: string
  updatedAt: string
}

export interface VolunteerField {
  id: string
  title: string
  slug: string
  description?: string
  icon?: string
  image?: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  image?: string
  location?: string
  startDate: string
  endDate?: string
  published: boolean
  authorId?: string
  createdAt: string
  updatedAt: string
}

export interface Partner {
  id: string
  name: string
  logo: string
  url?: string
  order: number
  active: boolean
  type: string
  createdAt: string
  updatedAt: string
}

export interface Media {
  id: string
  name: string
  url: string
  type: string
  mimeType?: string
  size?: number
  alt?: string
  folder?: string
  uploadedBy?: string
  createdAt: string
}

export interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  image: string
  link?: string
  linkText?: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Step {
  id: string
  title: string
  description?: string
  icon?: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  read: boolean
  replied: boolean
  createdAt: string
}

export interface AboutSection {
  id: string
  title: string
  content: string
  image?: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Statistic {
  id: string
  label: string
  value: string
  icon?: string
  order: number
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string
  order: number
  active: boolean
}

// Admin panel view types
export type AdminView = 
  | 'dashboard' 
  | 'pages' 
  | 'news' 
  | 'categories' 
  | 'volunteer-fields'
  | 'events'
  | 'partners'
  | 'media'
  | 'settings'
  | 'users'
  | 'messages'
  | 'navigation'
  | 'hero-slides'
  | 'steps'
  | 'builder'
  | 'statistics'
  | 'social-links'

// Builder block types
export interface BuilderBlock {
  id: string
  type: 'heading' | 'paragraph' | 'image' | 'button' | 'divider' | 'html' | 'columns' | 'hero' | 'card' | 'list' | 'video' | 'spacer'
  content: string
  properties: Record<string, unknown>
  children?: BuilderBlock[]
  order: number
}

export interface BuilderPage {
  id: string
  title: string
  slug: string
  blocks: BuilderBlock[]
  published: boolean
  createdAt: string
  updatedAt: string
}
