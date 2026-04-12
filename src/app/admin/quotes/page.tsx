'use client'
import { useState, useEffect } from 'react'

interface Quote {
  id: string; status: string; total: number; createdAt: string; category: string;
  user?: { name?: string; email?: string; companyName?: string }
  items: any[]
}

const STATUSES = ['pending', 'sent', 'approved']

const statusColor: Record<string, string> = {
  pending: '#d4a847',
  sent: '#4a9eff',
  approved: '#4caf7d',
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<Quote | null>(null)

  const load = async () => {
    try {
      const response = await fetch('/admin/api/quotes')
      if (!response.ok) throw new Error(`Error: ${response.status}`)
      const data = await response.json()
      if (Array.isArray(data)) setQuotes(data)
    } catch (error) {
      console.error("Failed to load quotes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/admin/api/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (response.ok) {
        await load()
        if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const filtered = quotes.filter(q => !statusFilter || q.status === statusFilter)

  return (
    <div>
      <style>{`
        .quotes-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .quotes-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .quotes-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 620px;
        }

        /* Mobile card view */
        .quotes-cards {
          display: none;
          flex-direction: column;
          gap: 10px;
        }
        .quotes-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 16px;
          cursor: pointer;
        }
        .quotes-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .quotes-card-id {
          font-family: monospace;
          font-size: 12px;
          color: var(--text-muted);
        }
        .quotes-card-name {
          font-weight: 500;
          font-size: 14px;
          margin-top: 2px;
        }
        .quotes-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .quotes-card-total {
          font-weight: 600;
          font-size: 15px;
        }
        .quotes-card-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        @media (max-width: 640px) {
          .quotes-table-wrap { display: none; }
          .quotes-cards { display: flex; }
        }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Quotes</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{quotes.length} quotes</p>
      </div>

      {/* Filters */}
      <div className="quotes-filters">
        {['', ...STATUSES].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border)',
              background: statusFilter === s ? 'var(--accent)' : 'var(--surface)',
              color: statusFilter === s ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: '13px', fontWeight: '500',
            }}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="quotes-table-wrap" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="quotes-table">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Quote ID', 'Customer', 'Company', 'Status', 'Total', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(quote => (
                  <tr key={quote.id} onClick={() => setSelected(quote)} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                    <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>#{quote.id.slice(-6)}</td>
                    <td style={{ padding: '14px 20px', fontWeight: '500', whiteSpace: 'nowrap' }}>{quote.user?.name ?? 'Guest'}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{quote.user?.companyName ?? '—'}</td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
                        color: statusColor[quote.status] ?? 'var(--text-muted)',
                        background: (statusColor[quote.status] ?? '#888') + '20',
                        padding: '3px 8px', borderRadius: '4px',
                      }}>{quote.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: '500', whiteSpace: 'nowrap' }}>${quote.total.toFixed(2)}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
                      <select value={quote.status} onChange={e => updateStatus(quote.id, e.target.value)}
                        style={{ padding: '5px 8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', background: 'var(--surface2)', color: 'var(--text)', cursor: 'pointer' }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>No quotes found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="quotes-cards">
            {filtered.map(quote => (
              <div key={quote.id} className="quotes-card" onClick={() => setSelected(quote)}>
                <div className="quotes-card-top">
                  <div>
                    <div className="quotes-card-id">#{quote.id.slice(-6)}</div>
                    <div className="quotes-card-name">{quote.user?.name ?? 'Guest'}</div>
                    {quote.user?.companyName && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{quote.user.companyName}</div>
                    )}
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
                    color: statusColor[quote.status] ?? 'var(--text-muted)',
                    background: (statusColor[quote.status] ?? '#888') + '20',
                    padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap',
                  }}>{quote.status}</span>
                </div>
                <div className="quotes-card-bottom">
                  <div className="quotes-card-total">${quote.total.toFixed(2)}</div>
                  <div className="quotes-card-date">
                    {new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div onClick={e => e.stopPropagation()}>
                    <select value={quote.status} onChange={e => updateStatus(quote.id, e.target.value)}
                      style={{ padding: '5px 8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', background: 'var(--surface2)', color: 'var(--text)', cursor: 'pointer' }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No quotes found</div>
            )}
          </div>
        </>
      )}

      {/* Quote Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }} onClick={() => setSelected(null)}>
          <div style={{ background: 'var(--surface)', borderRadius: '12px', width: '580px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Quote #{selected.id.slice(-6)}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Customer</div>
                  <div style={{ fontWeight: '500' }}>{selected.user?.name ?? 'Guest'}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selected.user?.email ?? '—'}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selected.user?.companyName ?? ''}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Status</div>
                  <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--surface2)', color: 'var(--text)', width: '100%' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Items</div>
                <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                  {Array.isArray(selected.items) && selected.items.map((item: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < selected.items.length - 1 ? '1px solid var(--border)' : 'none', gap: '12px' }}>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontWeight: '500' }}>{item.name ?? item.productName ?? 'Product'}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '8px', fontSize: '13px' }}>× {item.quantity ?? 1}</span>
                      </div>
                      <span style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>${((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface2)', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: '600' }}>Total</span>
                    <span style={{ fontWeight: '600' }}>${selected.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}