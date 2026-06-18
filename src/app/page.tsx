'use client'

import { useState, useEffect, useCallback } from 'react'

// ============================================================
// TYPES
// ============================================================
interface NavItem { id: string; label: string; url: string; order: number; active: boolean; target: string }
interface NewsItem { id: string; title: string; slug: string; summary?: string; content: string; image?: string; featured: boolean; published: boolean; publishedAt?: string; createdAt: string; updatedAt: string }
interface AwardCategory { id: string; title: string; slug: string; description?: string; icon?: string; image?: string; order: number; active: boolean; criteria?: string; createdAt: string; updatedAt: string }
interface VolunteerField { id: string; title: string; slug: string; description?: string; icon?: string; image?: string; order: number; active: boolean; createdAt: string; updatedAt: string }
interface Step { id: string; title: string; description?: string; icon?: string; order: number; active: boolean; createdAt: string; updatedAt: string }
interface Partner { id: string; name: string; logo: string; url?: string; order: number; active: boolean; type: string; createdAt: string; updatedAt: string }
interface HeroSlide { id: string; title: string; subtitle?: string; image: string; link?: string; linkText?: string; order: number; active: boolean; createdAt: string; updatedAt: string }
interface Statistic { id: string; label: string; value: string; icon?: string; order: number }
interface SocialLink { id: string; platform: string; url: string; icon?: string; order: number; active: boolean }
interface AboutSection { id: string; title: string; content: string; image?: string; order: number; active: boolean; createdAt: string; updatedAt: string }
interface SiteSetting { id: string; key: string; value: string; group: string; label: string; type: string }
interface PageItem { id: string; title: string; slug: string; content: string; builderData?: string; published: boolean; order: number; template: string; createdAt: string; updatedAt: string }
interface EventItem { id: string; title: string; slug: string; description?: string; content?: string; image?: string; location?: string; startDate: string; published: boolean; createdAt: string; updatedAt: string }
interface ContactMessage { id: string; name: string; email: string; phone?: string; subject?: string; message: string; read: boolean; replied: boolean; createdAt: string }
interface MediaItem { id: string; name: string; url: string; type: string; alt?: string; folder?: string; createdAt: string }
interface UserItem { id: string; email: string; name: string; role: string; active: boolean; createdAt: string; updatedAt: string }
interface BuilderBlock { id: string; type: string; content: string; properties: Record<string, unknown>; children?: BuilderBlock[]; order: number }

type AdminView = 'dashboard' | 'pages' | 'news' | 'categories' | 'volunteer-fields' | 'events' | 'partners' | 'media' | 'settings' | 'users' | 'messages' | 'navigation' | 'hero-slides' | 'steps' | 'builder' | 'statistics' | 'social-links' | 'about-sections'

// ============================================================
// API HELPER
// ============================================================
async function apiFetch(collection: string, options?: RequestInit & { params?: Record<string, string> }) {
  const url = `/api/${collection}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// ============================================================
// ICONS (inline SVGs to avoid dependency issues)
// ============================================================
function Icons({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    home: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    newspaper: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
    trophy: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    users: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    heart: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    settings: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    calendar: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    image: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    mail: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    menu: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
    link: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    edit: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    trash: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    plus: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    x: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    chevronLeft: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
    chevronRight: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
    search: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    lock: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    layout: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
    eye: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    barChart: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    globe: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    save: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
    logout: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    dashboard: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    handHeart: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>,
    facebook: <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    twitter: <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
    instagram: <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
    youtube: <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    linkedin: <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    code: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    arrowLeft: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
    check: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  }
  return icons[name] || <span className={className}>?</span>
}

// ============================================================
// PUBLIC WEBSITE COMPONENTS
// ============================================================

function PublicHeader({ navigation, onAdminClick }: { navigation: NavItem[]; onAdminClick: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#1B5E20] text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>info@alhusseinvolunteeraward.jo</span>
            <span>|</span>
            <span dir="ltr">+962 6 1234567</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onAdminClick} className="hover:opacity-80 flex items-center gap-1" title="لوحة التحكم">
              <Icons name="lock" className="w-4 h-4" />
            </button>
            <button className="hover:opacity-80 flex items-center gap-1">
              <Icons name="globe" className="w-4 h-4" />
              <span>EN</span>
            </button>
          </div>
        </div>
      </div>
      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#1B5E20] rounded-full flex items-center justify-center text-white font-bold text-lg">ج</div>
          <div>
            <h1 className="text-[#1B5E20] font-bold text-sm leading-tight">جائزة الحسين بن عبدالله الثاني</h1>
            <p className="text-[#8D6E63] text-xs">للعمل التطوعي</p>
          </div>
        </div>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.filter(n => n.active).sort((a, b) => a.order - b.order).map(item => (
            <a key={item.id} href={item.url} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1B5E20] hover:bg-green-50 rounded-md transition-colors">
              {item.label}
            </a>
          ))}
          <a href="#" className="mr-2 px-4 py-2 bg-[#8D6E63] text-white rounded-md text-sm hover:bg-[#5D4037] transition-colors">
            تسجيل الدخول
          </a>
        </nav>
        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Icons name={mobileMenuOpen ? 'x' : 'menu'} className="w-6 h-6" />
        </button>
      </div>
      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 pb-4">
          {navigation.filter(n => n.active).sort((a, b) => a.order - b.order).map(item => (
            <a key={item.id} href={item.url} className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-md">
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}

function HeroSection({ slides }: { slides: HeroSlide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const activeSlides = slides.filter(s => s.active).sort((a, b) => a.order - b.order)
  
  useEffect(() => {
    if (activeSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeSlides.length])

  if (activeSlides.length === 0) return (
    <section className="relative h-[500px] bg-gradient-to-bl from-[#1B5E20] via-[#2E7D32] to-[#5D4037] flex items-center justify-center">
      <div className="text-center text-white px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">جائزة الحسين بن عبدالله الثاني للعمل التطوعي</h2>
        <p className="text-xl opacity-90">تقدير العطاء وتشجيع العمل التطوعي في المجتمع الأردني</p>
      </div>
    </section>
  )

  const slide = activeSlides[currentSlide]
  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-[#1B5E20] via-[#2E7D32] to-[#5D4037]" />
      <div className="absolute inset-0 bg-black/30" />
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl animate-fade-in-up" key={currentSlide}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{slide.title}</h2>
            {slide.subtitle && <p className="text-lg md:text-xl text-white/90 mb-6">{slide.subtitle}</p>}
            {slide.linkText && (
              <a href={slide.link || '#'} className="inline-block px-6 py-3 bg-[#F9A825] text-[#1B5E20] font-bold rounded-lg hover:bg-yellow-400 transition-colors">
                {slide.linkText}
              </a>
            )}
          </div>
        </div>
      </div>
      {/* Slide indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {activeSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-[#F9A825] w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
      {/* Navigation arrows */}
      {activeSlides.length > 1 && (
        <>
          <button onClick={() => setCurrentSlide(prev => (prev - 1 + activeSlides.length) % activeSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full hover:bg-white/40 text-white">
            <Icons name="chevronLeft" className="w-6 h-6" />
          </button>
          <button onClick={() => setCurrentSlide(prev => (prev + 1) % activeSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full hover:bg-white/40 text-white">
            <Icons name="chevronRight" className="w-6 h-6" />
          </button>
        </>
      )}
    </section>
  )
}

function NewsSection({ news }: { news: NewsItem[] }) {
  const [currentNews, setCurrentNews] = useState(0)
  const publishedNews = news.filter(n => n.published)
  if (publishedNews.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#1B5E20]">أخبار</h2>
          <div className="flex items-center gap-2">
            {publishedNews.slice(0, 3).map((_, i) => (
              <button key={i} onClick={() => setCurrentNews(i)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === currentNews ? 'bg-[#1B5E20] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6" key={currentNews}>
          {publishedNews.slice(currentNews, currentNews + 3).map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-[#1B5E20]/10 to-[#8D6E63]/10 flex items-center justify-center">
                <Icons name="newspaper" className="w-16 h-16 text-[#1B5E20]/30" />
              </div>
              <div className="p-5">
                <span className="text-xs text-[#8D6E63]">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ar-JO') : ''}</span>
                <h3 className="font-bold text-gray-900 mt-2 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.summary}</p>
                <a href="#" className="text-[#1B5E20] text-sm font-medium mt-3 inline-block hover:underline">اقرأ المزيد ←</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection({ abouts, statistics }: { abouts: AboutSection[]; statistics: Statistic[] }) {
  const about = abouts[0]
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-right">
            {about ? (
              <>
                <h2 className="text-3xl font-bold text-[#1B5E20] mb-6">{about.title}</h2>
                <div className="text-gray-700 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: about.content }} />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-[#1B5E20] mb-6">من نحن</h2>
                <p className="text-gray-700 leading-relaxed">جائزة الحسين بن عبدالله الثاني للعمل التطوعي هي جائزة وطنية تأسست لتكريم وتشجيع العاملين في مجال العمل التطوعي والأهلي في المملكة الأردنية الهاشمية.</p>
              </>
            )}
            <a href="#" className="inline-block mt-6 px-6 py-2.5 bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] transition-colors">اقرأ المزيد</a>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl h-64 flex items-center justify-center">
              <Icons name="handHeart" className="w-24 h-24 text-white/30" />
            </div>
            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              {statistics.map((stat) => (
                <div key={stat.id} className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <span className="text-2xl mb-1 block">{stat.icon}</span>
                  <span className="text-2xl font-bold text-[#1B5E20]">{stat.value}</span>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoriesSection({ categories }: { categories: AwardCategory[] }) {
  const activeCategories = categories.filter(c => c.active).sort((a, b) => a.order - b.order)
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B5E20] mb-3">فئات الجائزة</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">تشجيع العمل التطوعي وتكريم المتميزين في مختلف المجالات</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeCategories.map((cat) => (
            <div key={cat.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FFF8E1] rounded-full flex items-center justify-center text-3xl">
                {cat.icon || '🏆'}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{cat.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{cat.description}</p>
              <a href="#" className="text-[#1B5E20] text-sm font-medium hover:underline">اقرأ المزيد ←</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VolunteerFieldsSection({ fields }: { fields: VolunteerField[] }) {
  const activeFields = fields.filter(f => f.active).sort((a, b) => a.order - b.order)
  return (
    <section className="py-16 bg-[#1B5E20]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">مجالات العمل التطوعي</h2>
          <p className="text-white/70 max-w-2xl mx-auto">تنوع المجالات التطوعية يعكس شمولية العمل التطوعي في خدمة المجتمع</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {activeFields.map((field) => (
            <div key={field.id} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center hover:bg-white/20 transition-colors cursor-pointer">
              <span className="text-3xl block mb-2">{field.icon || '🤝'}</span>
              <p className="text-white text-sm font-medium">{field.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StepsSection({ steps }: { steps: Step[] }) {
  const activeSteps = steps.filter(s => s.active).sort((a, b) => a.order - b.order)
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B5E20] mb-3">خطوات التقديم</h2>
          <p className="text-gray-600">خطوات بسيطة للتقديم على الجائزة</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {activeSteps.map((step, i) => (
            <div key={step.id} className="text-center relative">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#1B5E20] rounded-full flex items-center justify-center text-white relative">
                <span className="text-2xl">{step.icon || (i + 1)}</span>
                <span className="absolute -top-1 -right-1 w-7 h-7 bg-[#F9A825] rounded-full flex items-center justify-center text-[#1B5E20] font-bold text-xs">{i + 1}</span>
              </div>
              {i < activeSteps.length - 1 && (
                <div className="hidden md:block absolute top-10 -left-4 w-8 border-t-2 border-dashed border-[#1B5E20]/30" />
              )}
              <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PartnersSection({ partners }: { partners: Partner[] }) {
  const activePartners = partners.filter(p => p.active).sort((a, b) => a.order - b.order)
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B5E20] mb-3">شركاؤنا</h2>
          <p className="text-gray-600">نتعاون مع مؤسسات رائدة لتعزيز ثقافة التطوع</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {activePartners.map((partner) => (
            <a key={partner.id} href={partner.url || '#'} className="bg-gray-50 rounded-xl p-6 flex items-center justify-center h-24 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-[#1B5E20]/10 rounded-lg flex items-center justify-center mb-2">
                  <Icons name="users" className="w-6 h-6 text-[#1B5E20]" />
                </div>
                <p className="text-xs font-medium text-gray-700">{partner.name}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function PublicFooter({ socialLinks }: { socialLinks: SocialLink[] }) {
  const activeSocial = socialLinks.filter(s => s.active).sort((a, b) => a.order - b.order)
  const iconMap: Record<string, string> = { facebook: 'facebook', twitter: 'twitter', instagram: 'instagram', youtube: 'youtube', linkedin: 'linkedin' }

  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#1B5E20] rounded-full flex items-center justify-center text-white font-bold">ج</div>
              <div>
                <h3 className="font-bold text-sm">جائزة الحسين</h3>
                <p className="text-xs text-gray-400">للعمل التطوعي</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">جائزة وطنية لتكريم وتشجيع العاملين في مجال العمل التطوعي والأهلي في المملكة الأردنية الهاشمية.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">الرئيسية</a></li>
              <li><a href="#" className="hover:text-white transition-colors">عن الجائزة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الفئات والشروط</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الفعاليات</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">معلومات</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
              <li><a href="#" className="hover:text-white transition-colors">خريطة الموقع</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">تواصل معنا</h3>
            <p className="text-sm text-gray-400 mb-4">info@alhusseinvolunteeraward.jo</p>
            <div className="flex gap-3">
              {activeSocial.map(link => (
                <a key={link.id} href={link.url} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1B5E20] transition-colors">
                  <Icons name={iconMap[link.platform] || 'globe'} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          جميع الحقوق محفوظة © {new Date().getFullYear()} جائزة الحسين بن عبدالله الثاني للعمل التطوعي
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// ADMIN CMS COMPONENTS
// ============================================================

function AdminSidebar({ currentView, onNavigate, onLogout }: { currentView: AdminView; onNavigate: (v: AdminView) => void; onLogout: () => void }) {
  const menuItems: { key: AdminView; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'لوحة التحكم', icon: 'dashboard' },
    { key: 'pages', label: 'الصفحات', icon: 'layout' },
    { key: 'builder', label: 'مُنشئ الصفحات', icon: 'code' },
    { key: 'news', label: 'الأخبار', icon: 'newspaper' },
    { key: 'categories', label: 'فئات الجائزة', icon: 'trophy' },
    { key: 'volunteer-fields', label: 'مجالات التطوع', icon: 'heart' },
    { key: 'events', label: 'الفعاليات', icon: 'calendar' },
    { key: 'hero-slides', label: 'الشرائح الرئيسية', icon: 'image' },
    { key: 'steps', label: 'الخطوات', icon: 'chevronLeft' },
    { key: 'partners', label: 'الشركاء', icon: 'users' },
    { key: 'statistics', label: 'الإحصائيات', icon: 'barChart' },
    { key: 'about-sections', label: 'من نحن', icon: 'eye' },
    { key: 'navigation', label: 'القوائم', icon: 'menu' },
    { key: 'social-links', label: 'روابط التواصل', icon: 'globe' },
    { key: 'media', label: 'المكتبة', icon: 'image' },
    { key: 'messages', label: 'الرسائل', icon: 'mail' },
    { key: 'settings', label: 'الإعدادات', icon: 'settings' },
    { key: 'users', label: 'المستخدمون', icon: 'users' },
  ]

  return (
    <aside className="w-64 bg-[#1a1a2e] text-white min-h-screen flex flex-col overflow-y-auto admin-scroll">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1B5E20] rounded-full flex items-center justify-center font-bold">ج</div>
          <div>
            <h2 className="font-bold text-sm">لوحة التحكم</h2>
            <p className="text-xs text-gray-400">CMS</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map(item => (
          <button key={item.key} onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${currentView === item.key ? 'bg-[#1B5E20] text-white' : 'text-gray-300 hover:bg-white/10'}`}>
            <Icons name={item.icon} className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10">
          <Icons name="logout" className="w-4 h-4" />
          <span>العودة للموقع</span>
        </button>
      </div>
    </aside>
  )
}

// Generic data table component for admin
function DataTable<T extends { id: string }>({ 
  items, columns, onEdit, onDelete, onAdd, addLabel 
}: { 
  items: T[]; columns: { key: string; label: string; render?: (item: T) => React.ReactNode }[]; 
  onEdit: (item: T) => void; onDelete: (id: string) => void; onAdd?: () => void; addLabel?: string 
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div />
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] transition-colors text-sm">
            <Icons name="plus" className="w-4 h-4" /> {addLabel || 'إضافة'}
          </button>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                {columns.map(col => (
                  <th key={col.key} className="px-4 py-3 text-right font-medium text-gray-600">{col.label}</th>
                ))}
                <th className="px-4 py-3 text-right font-medium text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Icons name="edit" className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Icons name="trash" className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">لا توجد بيانات</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Generic form modal
function FormModal({ title, isOpen, onClose, children }: { title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto admin-scroll">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><Icons name="x" className="w-5 h-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ============================================================
// ADMIN VIEW: Dashboard
// ============================================================
function DashboardView() {
  const [stats, setStats] = useState({ news: 0, categories: 0, partners: 0, messages: 0, pages: 0, events: 0 })
  
  useEffect(() => {
    async function loadStats() {
      try {
        const [news, categories, partners, messages, pages, events] = await Promise.all([
          apiFetch('news'), apiFetch('categories'), apiFetch('partners'),
          apiFetch('messages'), apiFetch('pages'), apiFetch('events'),
        ])
        setStats({ news: news.length, categories: categories.length, partners: partners.length, messages: messages.length, pages: pages.length, events: events.length })
      } catch {}
    }
    loadStats()
  }, [])

  const cards = [
    { label: 'الأخبار', value: stats.news, icon: 'newspaper', color: 'bg-blue-500' },
    { label: 'فئات الجائزة', value: stats.categories, icon: 'trophy', color: 'bg-yellow-500' },
    { label: 'الشركاء', value: stats.partners, icon: 'users', color: 'bg-green-500' },
    { label: 'الرسائل', value: stats.messages, icon: 'mail', color: 'bg-red-500' },
    { label: 'الصفحات', value: stats.pages, icon: 'layout', color: 'bg-purple-500' },
    { label: 'الفعاليات', value: stats.events, icon: 'calendar', color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">لوحة التحكم</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white`}>
              <Icons name={card.icon} className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// ADMIN VIEW: Generic CRUD
// ============================================================
function GenericCRUDView<T extends { id: string }>({ 
  collection, title, columns, renderForm, newItemTemplate 
}: { 
  collection: string; title: string; columns: { key: string; label: string; render?: (item: T) => React.ReactNode }[];
  renderForm: (item: T, onChange: (item: T) => void) => React.ReactNode;
  newItemTemplate: T
}) {
  const [items, setItems] = useState<T[]>([])
  const [editing, setEditing] = useState<T | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState<T>(newItemTemplate)
  const [loading, setLoading] = useState(true)

  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        const data = await apiFetch(collection)
        if (!cancelled) setItems(data)
      } catch {}
      if (!cancelled) setLoading(false)
    }
    fetchData()
    return () => { cancelled = true }
  }, [collection, refreshKey])

  const load = useCallback(() => { setRefreshKey(k => k + 1) }, [])

  const handleSave = async () => {
    try {
      if (isAdding) {
        await apiFetch(collection, { method: 'POST', body: JSON.stringify(form) })
      } else if (editing) {
        await apiFetch(collection, { method: 'PUT', body: JSON.stringify(form) })
      }
      setEditing(null)
      setIsAdding(false)
      setForm(newItemTemplate)
      load()
    } catch {}
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    try {
      await apiFetch(`${collection}?id=${id}`, { method: 'DELETE' })
      load()
    } catch {}
  }

  const handleEdit = (item: T) => {
    setEditing(item)
    setForm(item)
    setIsAdding(false)
  }

  const handleAdd = () => {
    setEditing(newItemTemplate)
    setForm({ ...newItemTemplate })
    setIsAdding(true)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <DataTable items={items} columns={columns} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} addLabel={`إضافة ${title}`} />
      <FormModal title={isAdding ? `إضافة ${title}` : `تعديل ${title}`} isOpen={!!editing} onClose={() => { setEditing(null); setIsAdding(false) }}>
        {renderForm(form, setForm)}
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32]">
            <Icons name="save" className="w-4 h-4" /> حفظ
          </button>
          <button onClick={() => { setEditing(null); setIsAdding(false) }} className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300">إلغاء</button>
        </div>
      </FormModal>
    </div>
  )
}

// ============================================================
// ADMIN VIEW: HTML Page Builder
// ============================================================
function BuilderView() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [currentPage, setCurrentPage] = useState<PageItem | null>(null)
  const [blocks, setBlocks] = useState<BuilderBlock[]>([])
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [htmlMode, setHtmlMode] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [newPageTitle, setNewPageTitle] = useState('')
  const [newPageSlug, setNewPageSlug] = useState('')

  useEffect(() => {
    apiFetch('pages').then(setPages).catch(() => {})
  }, [])

  const addBlock = (type: string) => {
    const newBlock: BuilderBlock = {
      id: `block-${Date.now()}`,
      type,
      content: type === 'heading' ? 'عنوان جديد' : type === 'paragraph' ? 'نص الفقرة هنا...' : '',
      properties: {},
      order: blocks.length,
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id: string, updates: Partial<BuilderBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id))
  }

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id)
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return
    const newBlocks = [...blocks]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]]
    newBlocks.forEach((b, i) => b.order = i)
    setBlocks(newBlocks)
  }

  const savePage = async () => {
    if (!currentPage) return
    try {
      await apiFetch('pages', {
        method: 'PUT',
        body: JSON.stringify({
          id: currentPage.id,
          content: htmlMode ? htmlContent : renderBlocksToHtml(blocks),
          builderData: JSON.stringify(blocks),
        }),
      })
      alert('تم الحفظ بنجاح!')
    } catch {}
  }

  const createNewPage = async () => {
    try {
      const page = await apiFetch('pages', {
        method: 'POST',
        body: JSON.stringify({ title: newPageTitle, slug: newPageSlug, content: '', published: false, order: pages.length, template: 'default' }),
      })
      setPages([...pages, page])
      setCurrentPage(page)
      setBlocks([])
      setNewPageTitle('')
      setNewPageSlug('')
    } catch {}
  }

  const renderBlocksToHtml = (blocks: BuilderBlock[]): string => {
    return blocks.map(block => {
      switch (block.type) {
        case 'heading': return `<h2>${block.content}</h2>`
        case 'paragraph': return `<p>${block.content}</p>`
        case 'image': return `<img src="${block.content}" alt="${block.properties.alt || ''}" style="max-width:100%" />`
        case 'button': return `<a href="${block.properties.link || '#'}" class="btn">${block.content}</a>`
        case 'divider': return `<hr />`
        case 'spacer': return `<div style="height:${block.properties.height || 40}px"></div>`
        case 'html': return block.content
        default: return `<div>${block.content}</div>`
      }
    }).join('\n')
  }

  const blockTypes = [
    { type: 'heading', label: 'عنوان', icon: '📝' },
    { type: 'paragraph', label: 'فقرة', icon: '📄' },
    { type: 'image', label: 'صورة', icon: '🖼️' },
    { type: 'button', label: 'زر', icon: '🔘' },
    { type: 'divider', label: 'فاصل', icon: '➖' },
    { type: 'spacer', label: 'مسافة', icon: '↕️' },
    { type: 'html', label: 'HTML', icon: '💻' },
    { type: 'video', label: 'فيديو', icon: '🎬' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">مُنشئ الصفحات</h2>
        {currentPage && (
          <button onClick={savePage} className="flex items-center gap-2 px-4 py-2 bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32]">
            <Icons name="save" className="w-4 h-4" /> حفظ الصفحة
          </button>
        )}
      </div>

      {!currentPage ? (
        <div>
          {/* Page list */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h3 className="font-bold mb-4">الصفحات الموجودة</h3>
            {pages.map(page => (
              <div key={page.id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50 cursor-pointer" onClick={() => {
                setCurrentPage(page)
                try {
                  if (page.builderData) setBlocks(JSON.parse(page.builderData))
                  else setBlocks([])
                } catch { setBlocks([]) }
                setHtmlContent(page.content || '')
              }}>
                <div>
                  <span className="font-medium">{page.title}</span>
                  <span className="text-sm text-gray-400 mr-2">/{page.slug}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${page.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {page.published ? 'منشور' : 'مسودة'}
                </span>
              </div>
            ))}
          </div>
          {/* New page form */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold mb-4">إنشاء صفحة جديدة</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان الصفحة</label>
                <input type="text" value={newPageTitle} onChange={e => setNewPageTitle(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="عنوان الصفحة" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الرابط</label>
                <input type="text" value={newPageSlug} onChange={e => setNewPageSlug(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="page-slug" dir="ltr" />
              </div>
            </div>
            <button onClick={createNewPage} className="mt-4 px-4 py-2 bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] text-sm">إنشاء الصفحة</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {/* Block types sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
              <h3 className="font-bold mb-3 text-sm">العناصر</h3>
              <div className="grid grid-cols-2 gap-2">
                {blockTypes.map(bt => (
                  <button key={bt.type} onClick={() => addBlock(bt.type)}
                    className="p-3 bg-gray-50 rounded-lg text-center hover:bg-[#1B5E20]/10 transition-colors text-sm">
                    <span className="text-xl block mb-1">{bt.icon}</span>
                    <span>{bt.label}</span>
                  </button>
                ))}
              </div>
              <hr className="my-4" />
              <div className="flex gap-2">
                <button onClick={() => setHtmlMode(!htmlMode)}
                  className={`flex-1 py-2 rounded-lg text-sm ${htmlMode ? 'bg-[#1B5E20] text-white' : 'bg-gray-100'}`}>
                  HTML
                </button>
                <button onClick={() => setHtmlMode(false)}
                  className={`flex-1 py-2 rounded-lg text-sm ${!htmlMode ? 'bg-[#1B5E20] text-white' : 'bg-gray-100'}`}>
                  مرئي
                </button>
              </div>
              <button onClick={() => setCurrentPage(null)} className="w-full mt-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                العودة للقائمة
              </button>
            </div>
          </div>
          {/* Builder area */}
          <div className="col-span-9">
            {htmlMode ? (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <textarea value={htmlContent} onChange={e => setHtmlContent(e.target.value)}
                  className="w-full h-[600px] font-mono text-sm border rounded-lg p-3" dir="ltr" placeholder="<h1>Hello World</h1>" />
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
                    <Icons name="plus" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>اختر عنصراً من القائمة الجانبية للبدء</p>
                  </div>
                )}
                {blocks.map((block) => (
                  <div key={block.id} className={`builder-block bg-white rounded-xl shadow-sm p-4 ${selectedBlock === block.id ? 'selected' : ''}`}
                    onClick={() => setSelectedBlock(block.id)}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{block.type}</span>
                      <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up') }} className="p-1 hover:bg-gray-100 rounded text-xs">↑</button>
                        <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down') }} className="p-1 hover:bg-gray-100 rounded text-xs">↓</button>
                        <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id) }} className="p-1 hover:bg-red-100 rounded text-red-500 text-xs">✕</button>
                      </div>
                    </div>
                    {block.type === 'heading' && (
                      <input type="text" value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })}
                        className="w-full text-xl font-bold border-none outline-none" placeholder="العنوان" />
                    )}
                    {block.type === 'paragraph' && (
                      <textarea value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })}
                        className="w-full min-h-[80px] border-none outline-none resize-y text-sm" placeholder="نص الفقرة" />
                    )}
                    {block.type === 'image' && (
                      <input type="text" value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm" placeholder="رابط الصورة" dir="ltr" />
                    )}
                    {block.type === 'button' && (
                      <div className="flex gap-2">
                        <input type="text" value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })}
                          className="flex-1 border rounded px-2 py-1 text-sm" placeholder="نص الزر" />
                        <input type="text" value={String(block.properties.link || '')} onChange={e => updateBlock(block.id, { properties: { ...block.properties, link: e.target.value } })}
                          className="flex-1 border rounded px-2 py-1 text-sm" placeholder="الرابط" dir="ltr" />
                      </div>
                    )}
                    {block.type === 'html' && (
                      <textarea value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })}
                        className="w-full min-h-[120px] font-mono text-xs border rounded p-2" dir="ltr" placeholder="<div>HTML code</div>" />
                    )}
                    {block.type === 'divider' && <hr className="border-t-2 border-gray-200" />}
                    {block.type === 'spacer' && (
                      <div className="bg-gray-50 rounded text-center text-xs text-gray-400 py-4">
                        مسافة: <input type="number" value={Number(block.properties.height || 40)} onChange={e => updateBlock(block.id, { properties: { ...block.properties, height: parseInt(e.target.value) } })}
                          className="w-16 border rounded px-1 py-0.5 text-center text-xs mx-1" /> بكسل
                      </div>
                    )}
                    {block.type === 'video' && (
                      <input type="text" value={block.content} onChange={e => updateBlock(block.id, { content: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm" placeholder="رابط الفيديو (YouTube)" dir="ltr" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// ADMIN VIEW: Settings
// ============================================================
function SettingsView() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    apiFetch('settings').then(setSettings).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await apiFetch('settings', {
        method: 'PUT',
        body: JSON.stringify(settings.map(s => ({ id: s.id, value: s.value }))),
      })
      alert('تم الحفظ بنجاح!')
    } catch {}
    setSaving(false)
  }

  const updateSetting = (id: string, value: string) => {
    setSettings(settings.map(s => s.id === id ? { ...s, value } : s))
  }

  const groups = [...new Set(settings.map(s => s.group))]
  const groupLabels: Record<string, string> = { general: 'عام', appearance: 'المظهر', seo: 'SEO', social: 'التواصل الاجتماعي', contact: 'التواصل' }

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">الإعدادات</h2>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] disabled:opacity-50">
          <Icons name="save" className="w-4 h-4" /> {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>
      <div className="space-y-6">
        {groups.map(group => (
          <div key={group} className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold mb-4 text-[#1B5E20]">{groupLabels[group] || group}</h3>
            <div className="space-y-4">
              {settings.filter(s => s.group === group).map(setting => (
                <div key={setting.id}>
                  <label className="block text-sm font-medium mb-1">{setting.label}</label>
                  {setting.type === 'textarea' || setting.type === 'richtext' ? (
                    <textarea value={setting.value} onChange={e => updateSetting(setting.id, e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]" />
                  ) : setting.type === 'color' ? (
                    <div className="flex gap-2 items-center">
                      <input type="color" value={setting.value} onChange={e => updateSetting(setting.id, e.target.value)} className="w-10 h-10 rounded border" />
                      <input type="text" value={setting.value} onChange={e => updateSetting(setting.id, e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" dir="ltr" />
                    </div>
                  ) : (
                    <input type={setting.type === 'number' ? 'number' : 'text'} value={setting.value} onChange={e => updateSetting(setting.id, e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm" dir={setting.type === 'image' ? 'ltr' : 'rtl'} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// MAIN APP
// ============================================================
export default function Home() {
  // State
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [adminView, setAdminView] = useState<AdminView>('dashboard')
  const [initialized, setInitialized] = useState(false)

  // Data state
  const [navigation, setNavigation] = useState<NavItem[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<AwardCategory[]>([])
  const [volunteerFields, setVolunteerFields] = useState<VolunteerField[]>([])
  const [steps, setSteps] = useState<Step[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [statistics, setStatistics] = useState<Statistic[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([])

  // Initialize database
  useEffect(() => {
    fetch('/api/init').then(() => setInitialized(true)).catch(() => setInitialized(true))
  }, [])

  // Load public data
  useEffect(() => {
    if (!initialized) return
    const loadData = async () => {
      try {
        const [nav, n, cat, vf, s, p, hs, stat, sl, about] = await Promise.all([
          apiFetch('navigation?active=true'), apiFetch('news?published=true&limit=6'),
          apiFetch('categories?active=true'), apiFetch('volunteer-fields?active=true'),
          apiFetch('steps?active=true'), apiFetch('partners?active=true'),
          apiFetch('hero-slides?active=true'), apiFetch('statistics'),
          apiFetch('social-links?active=true'), apiFetch('about-sections'),
        ])
        setNavigation(nav); setNews(n); setCategories(cat); setVolunteerFields(vf)
        setSteps(s); setPartners(p); setHeroSlides(hs); setStatistics(stat)
        setSocialLinks(sl); setAboutSections(about)
      } catch (e) {
        console.error('Failed to load data:', e)
      }
    }
    loadData()
  }, [initialized])

  const handleLogin = async () => {
    setLoginError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      if (res.ok) {
        setIsAdmin(true)
        setIsLoggingIn(false)
        setLoginEmail('')
        setLoginPassword('')
      } else {
        setLoginError('بيانات الدخول غير صحيحة')
      }
    } catch {
      setLoginError('حدث خطأ في الاتصال')
    }
  }

  // Admin CRUD views
  const renderAdminView = () => {
    switch (adminView) {
      case 'dashboard': return <DashboardView />
      case 'builder': return <BuilderView />
      case 'settings': return <SettingsView />
      case 'news': return (
        <GenericCRUDView<NewsItem>
          collection="news" title="الأخبار"
          columns={[
            { key: 'title', label: 'العنوان' },
            { key: 'published', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.published ? 'منشور' : 'مسودة'}</span> },
            { key: 'publishedAt', label: 'تاريخ النشر', render: (item) => item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ar-JO') : '-' },
          ]}
          newItemTemplate={{ id: '', title: '', slug: '', summary: '', content: '', image: '', featured: false, published: false, publishedAt: new Date().toISOString(), createdAt: '', updatedAt: '' }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">العنوان</label><input type="text" value={item.title} onChange={e => onChange({ ...item, title: e.target.value, slug: e.target.value.replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '') })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">الرابط</label><input type="text" value={item.slug} onChange={e => onChange({ ...item, slug: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="block text-sm font-medium mb-1">الملخص</label><textarea value={item.summary || ''} onChange={e => onChange({ ...item, summary: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[60px]" /></div>
              <div><label className="block text-sm font-medium mb-1">المحتوى</label><textarea value={item.content} onChange={e => onChange({ ...item, content: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[120px]" /></div>
              <div><label className="block text-sm font-medium mb-1">رابط الصورة</label><input type="text" value={item.image || ''} onChange={e => onChange({ ...item, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={item.published} onChange={e => onChange({ ...item, published: e.target.checked })} /> منشور</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={item.featured} onChange={e => onChange({ ...item, featured: e.target.checked })} /> مميز</label>
              </div>
            </div>
          )}
        />
      )
      case 'categories': return (
        <GenericCRUDView<AwardCategory>
          collection="categories" title="فئات الجائزة"
          columns={[
            { key: 'icon', label: 'الأيقونة', render: (item) => <span className="text-xl">{item.icon}</span> },
            { key: 'title', label: 'العنوان' },
            { key: 'active', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.active ? 'نشط' : 'غير نشط'}</span> },
          ]}
          newItemTemplate={{ id: '', title: '', slug: '', description: '', icon: '🏆', image: '', order: 0, active: true, criteria: '', createdAt: '', updatedAt: '' }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">العنوان</label><input type="text" value={item.title} onChange={e => onChange({ ...item, title: e.target.value, slug: e.target.value.replace(/\s+/g, '-') })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">الأيقونة</label><input type="text" value={item.icon || ''} onChange={e => onChange({ ...item, icon: e.target.value })} className="w-10 border rounded-lg px-3 py-2 text-sm text-center text-2xl" /></div>
              <div><label className="block text-sm font-medium mb-1">الوصف</label><textarea value={item.description || ''} onChange={e => onChange({ ...item, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]" /></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={item.active} onChange={e => onChange({ ...item, active: e.target.checked })} /> نشط</label></div>
            </div>
          )}
        />
      )
      case 'volunteer-fields': return (
        <GenericCRUDView<VolunteerField>
          collection="volunteer-fields" title="مجالات التطوع"
          columns={[
            { key: 'icon', label: 'الأيقونة', render: (item) => <span className="text-xl">{item.icon}</span> },
            { key: 'title', label: 'العنوان' },
            { key: 'active', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.active ? 'نشط' : 'غير نشط'}</span> },
          ]}
          newItemTemplate={{ id: '', title: '', slug: '', description: '', icon: '🤝', image: '', order: 0, active: true, createdAt: '', updatedAt: '' }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">العنوان</label><input type="text" value={item.title} onChange={e => onChange({ ...item, title: e.target.value, slug: e.target.value.replace(/\s+/g, '-') })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">الأيقونة</label><input type="text" value={item.icon || ''} onChange={e => onChange({ ...item, icon: e.target.value })} className="w-10 border rounded-lg px-3 py-2 text-sm text-center text-2xl" /></div>
              <div><label className="block text-sm font-medium mb-1">الوصف</label><textarea value={item.description || ''} onChange={e => onChange({ ...item, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[60px]" /></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={item.active} onChange={e => onChange({ ...item, active: e.target.checked })} /> نشط</label></div>
            </div>
          )}
        />
      )
      case 'partners': return (
        <GenericCRUDView<Partner>
          collection="partners" title="الشركاء"
          columns={[
            { key: 'name', label: 'الاسم' },
            { key: 'type', label: 'النوع' },
            { key: 'active', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.active ? 'نشط' : 'غير نشط'}</span> },
          ]}
          newItemTemplate={{ id: '', name: '', logo: '', url: '', order: 0, active: true, type: 'partner', createdAt: '', updatedAt: '' }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">الاسم</label><input type="text" value={item.name} onChange={e => onChange({ ...item, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">رابط الشعار</label><input type="text" value={item.logo} onChange={e => onChange({ ...item, logo: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="block text-sm font-medium mb-1">الموقع</label><input type="text" value={item.url || ''} onChange={e => onChange({ ...item, url: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="block text-sm font-medium mb-1">النوع</label><select value={item.type} onChange={e => onChange({ ...item, type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="partner">شريك</option><option value="sponsor">راعي</option><option value="supporter">داعم</option></select></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={item.active} onChange={e => onChange({ ...item, active: e.target.checked })} /> نشط</label></div>
            </div>
          )}
        />
      )
      case 'hero-slides': return (
        <GenericCRUDView<HeroSlide>
          collection="hero-slides" title="الشرائح الرئيسية"
          columns={[
            { key: 'title', label: 'العنوان' },
            { key: 'order', label: 'الترتيب' },
            { key: 'active', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.active ? 'نشط' : 'غير نشط'}</span> },
          ]}
          newItemTemplate={{ id: '', title: '', subtitle: '', image: '', link: '', linkText: '', order: 0, active: true, createdAt: '', updatedAt: '' }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">العنوان</label><input type="text" value={item.title} onChange={e => onChange({ ...item, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">العنوان الفرعي</label><input type="text" value={item.subtitle || ''} onChange={e => onChange({ ...item, subtitle: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">رابط الصورة</label><input type="text" value={item.image} onChange={e => onChange({ ...item, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="block text-sm font-medium mb-1">نص الزر</label><input type="text" value={item.linkText || ''} onChange={e => onChange({ ...item, linkText: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">رابط الزر</label><input type="text" value={item.link || ''} onChange={e => onChange({ ...item, link: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={item.active} onChange={e => onChange({ ...item, active: e.target.checked })} /> نشط</label></div>
            </div>
          )}
        />
      )
      case 'steps': return (
        <GenericCRUDView<Step>
          collection="steps" title="الخطوات"
          columns={[
            { key: 'icon', label: 'الأيقونة', render: (item) => <span className="text-xl">{item.icon}</span> },
            { key: 'title', label: 'العنوان' },
            { key: 'active', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.active ? 'نشط' : 'غير نشط'}</span> },
          ]}
          newItemTemplate={{ id: '', title: '', description: '', icon: '📝', order: 0, active: true, createdAt: '', updatedAt: '' }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">العنوان</label><input type="text" value={item.title} onChange={e => onChange({ ...item, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">الأيقونة</label><input type="text" value={item.icon || ''} onChange={e => onChange({ ...item, icon: e.target.value })} className="w-10 border rounded-lg px-3 py-2 text-sm text-center text-2xl" /></div>
              <div><label className="block text-sm font-medium mb-1">الوصف</label><textarea value={item.description || ''} onChange={e => onChange({ ...item, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[60px]" /></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={item.active} onChange={e => onChange({ ...item, active: e.target.checked })} /> نشط</label></div>
            </div>
          )}
        />
      )
      case 'statistics': return (
        <GenericCRUDView<Statistic>
          collection="statistics" title="الإحصائيات"
          columns={[
            { key: 'icon', label: 'الأيقونة', render: (item) => <span className="text-xl">{item.icon}</span> },
            { key: 'label', label: 'التسمية' },
            { key: 'value', label: 'القيمة' },
          ]}
          newItemTemplate={{ id: '', label: '', value: '', icon: '📊', order: 0 }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">التسمية</label><input type="text" value={item.label} onChange={e => onChange({ ...item, label: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">القيمة</label><input type="text" value={item.value} onChange={e => onChange({ ...item, value: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">الأيقونة</label><input type="text" value={item.icon || ''} onChange={e => onChange({ ...item, icon: e.target.value })} className="w-10 border rounded-lg px-3 py-2 text-sm text-center text-2xl" /></div>
            </div>
          )}
        />
      )
      case 'social-links': return (
        <GenericCRUDView<SocialLink>
          collection="social-links" title="روابط التواصل"
          columns={[
            { key: 'platform', label: 'المنصة' },
            { key: 'url', label: 'الرابط' },
            { key: 'active', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.active ? 'نشط' : 'غير نشط'}</span> },
          ]}
          newItemTemplate={{ id: '', platform: '', url: '', icon: '', order: 0, active: true }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">المنصة</label><select value={item.platform} onChange={e => onChange({ ...item, platform: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="facebook">Facebook</option><option value="twitter">Twitter</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option></select></div>
              <div><label className="block text-sm font-medium mb-1">الرابط</label><input type="text" value={item.url} onChange={e => onChange({ ...item, url: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={item.active} onChange={e => onChange({ ...item, active: e.target.checked })} /> نشط</label></div>
            </div>
          )}
        />
      )
      case 'navigation': return (
        <GenericCRUDView<NavItem>
          collection="navigation" title="القوائم"
          columns={[
            { key: 'label', label: 'التسمية' },
            { key: 'url', label: 'الرابط' },
            { key: 'active', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.active ? 'نشط' : 'غير نشط'}</span> },
          ]}
          newItemTemplate={{ id: '', label: '', url: '', order: 0, active: true, target: '_self' }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">التسمية</label><input type="text" value={item.label} onChange={e => onChange({ ...item, label: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">الرابط</label><input type="text" value={item.url} onChange={e => onChange({ ...item, url: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="block text-sm font-medium mb-1">الترتيب</label><input type="number" value={item.order} onChange={e => onChange({ ...item, order: parseInt(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={item.active} onChange={e => onChange({ ...item, active: e.target.checked })} /> نشط</label></div>
            </div>
          )}
        />
      )
      case 'pages': return (
        <GenericCRUDView<PageItem>
          collection="pages" title="الصفحات"
          columns={[
            { key: 'title', label: 'العنوان' },
            { key: 'slug', label: 'الرابط', render: (item) => <span className="text-sm text-gray-400">/{item.slug}</span> },
            { key: 'published', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.published ? 'منشور' : 'مسودة'}</span> },
          ]}
          newItemTemplate={{ id: '', title: '', slug: '', content: '', published: false, order: 0, template: 'default', createdAt: '', updatedAt: '' }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">العنوان</label><input type="text" value={item.title} onChange={e => onChange({ ...item, title: e.target.value, slug: e.target.value.replace(/\s+/g, '-') })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">الرابط</label><input type="text" value={item.slug} onChange={e => onChange({ ...item, slug: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="block text-sm font-medium mb-1">المحتوى (HTML)</label><textarea value={item.content} onChange={e => onChange({ ...item, content: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[200px] font-mono" dir="ltr" /></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={item.published} onChange={e => onChange({ ...item, published: e.target.checked })} /> منشور</label></div>
            </div>
          )}
        />
      )
      case 'events': return (
        <GenericCRUDView<EventItem>
          collection="events" title="الفعاليات"
          columns={[
            { key: 'title', label: 'العنوان' },
            { key: 'location', label: 'المكان' },
            { key: 'startDate', label: 'التاريخ', render: (item) => new Date(item.startDate).toLocaleDateString('ar-JO') },
          ]}
          newItemTemplate={{ id: '', title: '', slug: '', description: '', content: '', image: '', location: '', startDate: new Date().toISOString(), published: false, createdAt: '', updatedAt: '' }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">العنوان</label><input type="text" value={item.title} onChange={e => onChange({ ...item, title: e.target.value, slug: e.target.value.replace(/\s+/g, '-') })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">المكان</label><input type="text" value={item.location || ''} onChange={e => onChange({ ...item, location: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">التاريخ</label><input type="datetime-local" value={item.startDate ? item.startDate.slice(0, 16) : ''} onChange={e => onChange({ ...item, startDate: new Date(e.target.value).toISOString() })} className="w-full border rounded-lg px-3 py-2 text-sm" dir="ltr" /></div>
              <div><label className="block text-sm font-medium mb-1">الوصف</label><textarea value={item.description || ''} onChange={e => onChange({ ...item, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]" /></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={item.published} onChange={e => onChange({ ...item, published: e.target.checked })} /> منشور</label></div>
            </div>
          )}
        />
      )
      case 'about-sections': return (
        <GenericCRUDView<AboutSection>
          collection="about-sections" title="من نحن"
          columns={[
            { key: 'title', label: 'العنوان' },
            { key: 'active', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.active ? 'نشط' : 'غير نشط'}</span> },
          ]}
          newItemTemplate={{ id: '', title: '', content: '', image: '', order: 0, active: true, createdAt: '', updatedAt: '' }}
          renderForm={(item, onChange) => (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">العنوان</label><input type="text" value={item.title} onChange={e => onChange({ ...item, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1">المحتوى (HTML)</label><textarea value={item.content} onChange={e => onChange({ ...item, content: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[200px] font-mono" dir="ltr" /></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={item.active} onChange={e => onChange({ ...item, active: e.target.checked })} /> نشط</label></div>
            </div>
          )}
        />
      )
      case 'media': return <MediaView />
      case 'messages': return <MessagesView />
      case 'users': return <UsersView />
      default: return <DashboardView />
    }
  }

  // Media Library View
  function MediaView() {
    const [media, setMedia] = useState<MediaItem[]>([])

    useEffect(() => {
      apiFetch('media').then(setMedia).catch(() => {})
    }, [])

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">مكتبة الوسائط</h2>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="grid grid-cols-4 gap-4">
            {media.map(item => (
              <div key={item.id} className="border rounded-lg p-3 text-center">
                <div className="h-24 bg-gray-100 rounded flex items-center justify-center mb-2">
                  <Icons name="image" className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs truncate">{item.name}</p>
              </div>
            ))}
            {media.length === 0 && (
              <div className="col-span-4 text-center py-8 text-gray-400">
                لا توجد ملفات. قم برفع ملفاتك من هنا.
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Messages View
  function MessagesView() {
    const [messages, setMessages] = useState<ContactMessage[]>([])

    useEffect(() => {
      apiFetch('messages').then(setMessages).catch(() => {})
    }, [])

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">الرسائل</h2>
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`bg-white rounded-xl shadow-sm p-5 ${!msg.read ? 'border-r-4 border-[#1B5E20]' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{msg.name}</h3>
                  <p className="text-sm text-gray-500">{msg.email}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString('ar-JO')}</span>
              </div>
              {msg.subject && <p className="font-medium text-sm mt-2">{msg.subject}</p>}
              <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
            </div>
          ))}
          {messages.length === 0 && <div className="text-center py-8 text-gray-400">لا توجد رسائل</div>}
        </div>
      </div>
    )
  }

  // Users View
  function UsersView() {
    const [users, setUsers] = useState<UserItem[]>([])

    useEffect(() => {
      apiFetch('users').then(setUsers).catch(() => {})
    }, [])

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">المستخدمون</h2>
        <DataTable<UserItem>
          items={users}
          columns={[
            { key: 'name', label: 'الاسم' },
            { key: 'email', label: 'البريد' },
            { key: 'role', label: 'الدور' },
            { key: 'active', label: 'الحالة', render: (item) => <span className={`text-xs px-2 py-1 rounded-full ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.active ? 'نشط' : 'غير نشط'}</span> },
          ]}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    )
  }

  // LOGIN MODAL
  if (isLoggingIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#1B5E20] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">ج</div>
            <h2 className="text-xl font-bold">تسجيل الدخول</h2>
            <p className="text-sm text-gray-500 mt-1">لوحة تحكم CMS</p>
          </div>
          {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{loginError}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5" placeholder="admin@cms.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5" placeholder="••••••••" />
            </div>
            <button onClick={handleLogin} className="w-full py-2.5 bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] font-medium">
              تسجيل الدخول
            </button>
            <button onClick={() => setIsLoggingIn(false)} className="w-full py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200">
              إلغاء
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">admin@cms.com / admin123</p>
        </div>
      </div>
    )
  }

  // ADMIN PANEL
  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-100" dir="rtl">
        <AdminSidebar currentView={adminView} onNavigate={setAdminView} onLogout={() => setIsAdmin(false)} />
        <main className="flex-1 p-6 overflow-y-auto admin-scroll">
          {renderAdminView()}
        </main>
      </div>
    )
  }

  // PUBLIC WEBSITE
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <PublicHeader navigation={navigation} onAdminClick={() => setIsLoggingIn(true)} />
      <main className="flex-1">
        <HeroSection slides={heroSlides} />
        <NewsSection news={news} />
        <AboutSection abouts={aboutSections} statistics={statistics} />
        <CategoriesSection categories={categories} />
        <VolunteerFieldsSection fields={volunteerFields} />
        <StepsSection steps={steps} />
        <PartnersSection partners={partners} />
      </main>
      <PublicFooter socialLinks={socialLinks} />
    </div>
  )
}
