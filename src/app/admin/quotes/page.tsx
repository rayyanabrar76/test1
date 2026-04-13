'use client'
import { useState, useEffect } from 'react'

interface Quote {
  id: string; status: string; createdAt: string; category: string;
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
          flex-wrap: nowrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin-bottom: 16px;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .quotes-filters::-webkit-scrollbar { display: none; }
        .quotes-filters button { flex-shrink: 0; }

        .quotes-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .quotes-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 520px;
        }
        .quotes-table tr:hover { background: var(--surface2); }

        .quotes-cards {
          display: none;
          flex-direction: column;
          gap: 10px;
        }
        .quotes-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px 16px;
          cursor: pointer;
        }
        .quotes-card:active { opacity: 0.75; }
        .quotes-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }
        .quotes-card-id {
          font-family: monospace;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 2px;
        }
        .quotes-card-name {
          font-weight: 600;
          font-size: 15px;
        }
        .quotes-card-company {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .quotes-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .quotes-card-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        .quotes-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 16px;
        }
        .quotes-modal {
          background: var(--surface);
          border-radius: 14px;
          width: 100%;
          max-width: 560px;
          max-height: 88dvh;
          overflow-y: auto;
          border: 1px solid var(--border);
        }
        .quotes-modal-header {
          padding: 18px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: var(--surface);
          z-index: 1;
        }
        .quotes-modal-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
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
              padding: '7px 16px', borderRadius: '20px', border: '1px solid var(--border)',
              background: statusFilter === s ? 'var(--accent)' : 'var(--surface)',
              color: statusFilter === s ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: '13px', fontWeight: '500', minHeight: '36px',
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
                  {['Quote ID', 'Customer', 'Company', 'Status', 'Date', 'Actions'].map(h => (
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
                  <tr><td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>No quotes found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="quotes-cards">
            {filtered.map(quote => (
              <div key={quote.id} className="quotes-card" onClick={() => setSelected(quote)}>
                <div className="quotes-card-top">
                  <div style={{ minWidth: 0 }}>
                    <div className="quotes-card-id">#{quote.id.slice(-6)}</div>
                    <div className="quotes-card-name">{quote.user?.name ?? 'Guest'}</div>
                    {quote.user?.companyName && (
                      <div className="quotes-card-company">{quote.user.companyName}</div>
                    )}
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
                    color: statusColor[quote.status] ?? 'var(--text-muted)',
                    background: (statusColor[quote.status] ?? '#888') + '20',
                    padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0,
                  }}>{quote.status}</span>
                </div>
                <div className="quotes-card-bottom">
                  <div className="quotes-card-date">
                    {new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div onClick={e => e.stopPropagation()}>
                    <select value={quote.status} onChange={e => updateStatus(quote.id, e.target.value)}
                      style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', background: 'var(--surface2)', color: 'var(--text)', cursor: 'pointer', minHeight: '36px' }}>
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

      {/* Quote Detail Modal — centered on all screen sizes */}
      {selected && (
        <div className="quotes-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="quotes-modal" onClick={e => e.stopPropagation()}>
            <div className="quotes-modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Quote #{selected.id.slice(-6)}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '22px', cursor: 'pointer', lineHeight: 1, padding: '4px', minWidth: '36px', minHeight: '36px' }}>×</button>
            </div>
            <div className="quotes-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Customer</div>
                  <div style={{ fontWeight: '500' }}>{selected.user?.name ?? 'Guest'}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selected.user?.email ?? '—'}</div>
                  {selected.user?.companyName && (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selected.user.companyName}</div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Status</div>
                  <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--surface2)', color: 'var(--text)', width: '100%', minHeight: '44px' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Items</div>
                <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                  {Array.isArray(selected.items) && selected.items.length > 0
                    ? selected.items.map((item: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: i < selected.items.length - 1 ? '1px solid var(--border)' : 'none', gap: '12px' }}>
                        <span style={{ fontWeight: '500', minWidth: 0, wordBreak: 'break-word' }}>{item.name ?? item.productName ?? 'Product'}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap', flexShrink: 0 }}>× {item.quantity ?? 1}</span>
                      </div>
                    ))
                    : <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No items</div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
