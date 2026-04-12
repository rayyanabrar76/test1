'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/products', label: 'Products', icon: '⊡' },
  { href: '/admin/quotes', label: 'Quotes', icon: '◎' },
  { href: '/admin/customers', label: 'Customers', icon: '◉' },
]

export default function Sidebar() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Store</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginTop: '2px' }}>Admin Panel</div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="sidebar-close-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '20px',
            cursor: 'pointer',
            lineHeight: 1,
            display: 'none',
          }}
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {nav.map(({ href, label, icon }) => {
          const active = path === href || (href !== '/' && path.startsWith(href))
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                marginBottom: '2px',
                background: active ? 'var(--surface2)' : 'transparent',
                color: active ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: active ? '500' : '400',
                fontSize: '14px',
                transition: 'all 0.15s',
                cursor: 'pointer',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
              }}>
                <span>{icon}</span>
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
        <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>Neon Database</span>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        /* ---- Inject top padding on mobile so page content clears the top bar ---- */
        @media (max-width: 768px) {
          body {
            padding-top: 56px !important;
          }
        }

        .sidebar-close-btn { display: none !important; }

        /* Mobile top bar — hidden on desktop */
        .sidebar-topbar {
          display: none;
        }

        @media (max-width: 768px) {
          /* Show close button inside drawer */
          .sidebar-close-btn { display: block !important; }

          /* Mobile top bar sits at the top, takes real space */
          .sidebar-topbar {
            display: flex;
            align-items: center;
            gap: 12px;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 56px;
            z-index: 1000;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            padding: 0 16px;
          }

          .sidebar-topbar-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--text);
          }

          /* Desktop sidebar — hide on mobile */
          .sidebar-desktop {
            display: none !important;
          }

          /* Mobile drawer */
          .sidebar-drawer {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 240px;
            z-index: 999;
            background: var(--surface);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }

          .sidebar-drawer.open {
            transform: translateX(0);
          }

          /* Backdrop */
          .sidebar-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 998;
          }
        }

        @media (min-width: 769px) {
          .sidebar-topbar,
          .sidebar-drawer,
          .sidebar-backdrop {
            display: none !important;
          }
        }
      `}</style>

      {/* ✅ Mobile top bar — takes real space, won't overlap content */}
      <div className="sidebar-topbar">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            width: '34px',
            height: '34px',
            borderRadius: '7px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ☰
        </button>
        <span className="sidebar-topbar-title">Admin Panel</span>
      </div>

      {/* Desktop sidebar */}
      <aside className="sidebar-desktop" style={{
        width: '220px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      {/* Mobile drawer */}
      <aside className={`sidebar-drawer ${open ? 'open' : ''}`}>
        <SidebarContent />
      </aside>
    </>
  )
}