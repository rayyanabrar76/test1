'use client'
import { useState, useEffect } from 'react'

interface Customer {
  id: string; name?: string; email?: string; companyName?: string;
  image?: string; createdAt: string;
  _count: { quotes: number }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async () => {
    const data = await fetch('/admin/api/customers').then(r => r.json())
    setCustomers(data); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = customers.filter(c =>
    (c.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.companyName ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <style>{`
        .cust-search {
          width: 320px;
        }
        .cust-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .cust-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 560px;
        }

        /* Mobile card view */
        .cust-cards {
          display: none;
          flex-direction: column;
          gap: 10px;
        }
        .cust-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cust-card-info { flex: 1; min-width: 0; }
        .cust-card-name {
          font-weight: 500;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cust-card-email {
          font-size: 12px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cust-card-meta {
          display: flex;
          gap: 8px;
          margin-top: 4px;
          flex-wrap: wrap;
        }
        .cust-card-badge {
          font-size: 11px;
          color: var(--text-muted);
          background: var(--surface2);
          border: 1px solid var(--border);
          padding: 2px 7px;
          border-radius: 4px;
        }

        @media (max-width: 640px) {
          .cust-search { width: 100%; }
          .cust-table-wrap { display: none; }
          .cust-cards { display: flex; }
        }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Customers</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{customers.length} customers</p>
      </div>

      <input
        className="cust-search"
        placeholder="Search by name, email or company..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          padding: '9px 14px', border: '1px solid var(--border)', borderRadius: '8px',
          fontSize: '14px', background: 'var(--surface)', color: 'var(--text)', marginBottom: '16px',
        }}
      />

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="cust-table-wrap" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="cust-table">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Customer', 'Email', 'Company', 'Quotes', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(customer => (
                  <tr key={customer.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {customer.image ? (
                          <img src={customer.image} alt={customer.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: 'var(--text-muted)', flexShrink: 0 }}>
                            {(customer.name ?? 'G')[0].toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>{customer.name ?? 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{customer.email ?? '—'}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{customer.companyName ?? '—'}</td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                        {customer._count.quotes}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="cust-cards">
            {filtered.map(customer => (
              <div key={customer.id} className="cust-card">
                {customer.image ? (
                  <img src={customer.image} alt={customer.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {(customer.name ?? 'G')[0].toUpperCase()}
                  </div>
                )}
                <div className="cust-card-info">
                  <div className="cust-card-name">{customer.name ?? 'Unknown'}</div>
                  <div className="cust-card-email">{customer.email ?? '—'}</div>
                  <div className="cust-card-meta">
                    {customer.companyName && <span className="cust-card-badge">{customer.companyName}</span>}
                    <span className="cust-card-badge">{customer._count.quotes} quotes</span>
                    <span className="cust-card-badge">
                      {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No customers found</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}