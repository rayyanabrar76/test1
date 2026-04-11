import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  const [products, quotes, customers] = await Promise.all([
    prisma.product.count(),
    prisma.quote.count(),
    prisma.user.count(),
  ])
  const revenue = await prisma.quote.aggregate({ _sum: { total: true } })
  const recentQuotes = await prisma.quote.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })
  return { products, quotes, customers, revenue: revenue._sum.total ?? 0, recentQuotes }
}

const statusColor: Record<string, string> = {
  pending: '#d4a847',
  sent: '#4a9eff',
  approved: '#4caf7d',
}

export default async function Dashboard() {
  const stats = await getStats()

  const cards = [
    { label: 'Products', value: stats.products, href: '/products' },
    { label: 'Quotes', value: stats.quotes, href: '/quotes' },
    { label: 'Customers', value: stats.customers, href: '/customers' },
    { label: 'Revenue', value: `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, href: '/quotes' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Welcome to your store admin</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {cards.map(card => (
          <Link key={card.label} href={card.href}>
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>{card.label}</div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--text)' }}>{card.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Quotes */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600' }}>Recent Quotes</h2>
          <Link href="/quotes"><span style={{ fontSize: '13px', color: 'var(--accent)' }}>View all →</span></Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Quote ID', 'Customer', 'Status', 'Total', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.recentQuotes.map((quote: (typeof stats.recentQuotes)[0]) => (
              <tr key={quote.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 24px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>#{quote.id.slice(-6)}</td>
                <td style={{ padding: '14px 24px', fontWeight: '500' }}>{quote.user?.name ?? 'Guest'}</td>
                <td style={{ padding: '14px 24px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
                    color: statusColor[quote.status] ?? 'var(--text-muted)',
                    background: (statusColor[quote.status] ?? '#888') + '20',
                    padding: '3px 8px', borderRadius: '4px',
                  }}>{quote.status}</span>
                </td>
                <td style={{ padding: '14px 24px', fontWeight: '500' }}>${quote.total.toFixed(2)}</td>
                <td style={{ padding: '14px 24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  {new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {stats.recentQuotes.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No quotes yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}