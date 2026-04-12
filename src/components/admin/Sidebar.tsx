'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/products', label: 'Products', icon: '⊡' },
  { href: '/admin/quotes', label: 'Quotes', icon: '◎' },
  { href: '/admin/customers', label: 'Customers', icon: '◉' },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <>
      <style>{`
        .bottom-nav {
          display: none;
        }

        @media (max-width: 768px) {
          /* Hide desktop sidebar on mobile */
          .sidebar-desktop {
            display: none !important;
          }

          /* Bottom nav bar */
          .bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999;
            background: var(--surface);
            border-top: 1px solid var(--border);
            height: 62px;
            align-items: stretch;
          }

          .bottom-nav a {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            text-decoration: none;
            color: var(--text-muted);
            font-size: 10px;
            font-weight: 500;
            transition: color 0.15s;
            padding-bottom: env(safe-area-inset-bottom);
          }

          .bottom-nav a.active {
            color: var(--accent);
          }

          .bottom-nav a .nav-icon {
            font-size: 18px;
            line-height: 1;
          }

          .bottom-nav a .nav-label {
            font-size: 10px;
            letter-spacing: 0.02em;
          }

          /* Push page content above the bottom nav */
          main, .admin-main {
            padding-bottom: 70px !important;
          }
        }

        @media (min-width: 769px) {
          .bottom-nav {
            display: none !important;
          }
        }
      `}</style>

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
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Store</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginTop: '2px' }}>Admin Panel</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 10px', flex: 1 }}>
          {nav.map(({ href, label, icon }) => {
            const active = path === href || (href !== '/admin' && path.startsWith(href))
            return (
              <Link key={href} href={href}>
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
      </aside>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {nav.map(({ href, label, icon }) => {
          const active = path === href || (href !== '/admin' && path.startsWith(href))
          return (
            <Link key={href} href={href} className={active ? 'active' : ''}>
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}