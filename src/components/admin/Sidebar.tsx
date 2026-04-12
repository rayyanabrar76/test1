'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/products', label: 'Products', icon: '⊡' },
  { href: '/admin/quotes', label: 'Quotes', icon: '◎' },
  { href: '/admin/customers', label: 'Customers', icon: '◉' },
]

export default function Sidebar() {
  const path = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 1. Detect screen size for responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setIsOpen(false) // Reset menu state if resizing to desktop
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 2. Close sidebar automatically when navigating on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [path])

  // Common styles for transitions
  const transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'

  return (
    <>
      {/* MOBILE TOP BAR (Hidden on Desktop) */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '56px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          zIndex: 40,
          justifyContent: 'space-between'
        }}>
          <button 
            onClick={() => setIsOpen(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              color: 'var(--text)', 
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            ☰
          </button>
          <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text)' }}>Admin Panel</span>
          <div style={{ width: '40px' }} /> {/* Visual balance spacer */}
        </div>
      )}

      {/* OVERLAY / BACKDROP (Mobile only) */}
      {isMobile && isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* THE SIDEBAR */}
      <aside style={{
        width: '240px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        height: '100vh',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: transition,
        transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
      }}>
        
        {/* Logo Section */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Store</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginTop: '2px' }}>Admin Panel</div>
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
          {nav.map(({ href, label, icon }) => {
            const active = path === href || (href !== '/admin' && path.startsWith(href))
            
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  background: active ? 'var(--surface2)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: active ? '500' : '400',
                  fontSize: '14px',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                  borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                }}>
                  <span style={{ fontSize: '18px', opacity: active ? 1 : 0.7 }}>{icon}</span>
                  {label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          Connected to<br />
          <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: '600' }}>Neon Database</span>
        </div>
      </aside>

      {/* CONTENT SPACER (Prevents content from being hidden under the mobile top bar) */}
      {isMobile && <div style={{ height: '56px', width: '100%' }} />}
    </>
  )
}