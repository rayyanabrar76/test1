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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Customers</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{customers.length} customers</p>
      </div>

      <input placeholder="Search by name, email or company..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ padding: '9px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', width: '320px', background: 'var(--surface)', color: 'var(--text)', marginBottom: '16px' }} />

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Customer', 'Email', 'Company', 'Quotes', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
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
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                          {(customer.name ?? 'G')[0].toUpperCase()}
                        </div>
                      )}
                      <span style={{ fontWeight: '500' }}>{customer.name ?? 'Unknown'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{customer.email ?? '—'}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{customer.companyName ?? '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                      {customer._count.quotes}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
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
      )}
    </div>
  )
}