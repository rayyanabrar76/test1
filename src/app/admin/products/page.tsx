'use client'
import { useState, useEffect, useRef } from 'react'

interface Product {
  id: string; slug: string; name: string; brand: string;
  description: string; price: number;
  image: string; gallery: string[]; category: string; createdAt: string;
  pdf_link?: string; pdf_links?: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [uploadingPdfLinks, setUploadingPdfLinks] = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', brand: 'APS', description: '', price: '',
    image: '', gallery: [] as string[], category: '',
    pdf_link: '', pdf_links: [] as string[],
  })
  const fileRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const pdfRef = useRef<HTMLInputElement>(null)
  const pdfLinksRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const data = await fetch('/api/products', { cache: 'no-store' }).then(r => r.json())
    setProducts(data); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', slug: '', brand: 'APS', description: '', price: '', image: '', gallery: [], category: '', pdf_link: '', pdf_links: [] })
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name, slug: p.slug, brand: p.brand, description: p.description,
      price: p.price.toString(), image: p.image, gallery: p.gallery || [],
      category: p.category, pdf_link: p.pdf_link || '', pdf_links: p.pdf_links || [],
    })
    setModalOpen(true)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/admin/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    return data.url
  }

  const uploadPdf = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/admin/api/upload-pdf', { method: 'POST', body: formData })
    const data = await res.json()
    return data.url
  }

  const handleMainImage = async (file: File) => {
    setUploading(true)
    const url = await uploadImage(file)
    setForm(f => ({ ...f, image: url }))
    setUploading(false)
  }

  const handleGalleryImages = async (files: FileList) => {
    setUploadingGallery(true)
    const urls = await Promise.all(Array.from(files).map(uploadImage))
    setForm(f => ({ ...f, gallery: [...f.gallery, ...urls] }))
    setUploadingGallery(false)
  }

  const handleMainPdf = async (file: File) => {
    setUploadingPdf(true)
    const url = await uploadPdf(file)
    setForm(f => ({ ...f, pdf_link: url }))
    setUploadingPdf(false)
  }

  const handlePdfLinks = async (files: FileList) => {
    setUploadingPdfLinks(true)
    const urls = await Promise.all(Array.from(files).map(uploadPdf))
    setForm(f => ({ ...f, pdf_links: [...f.pdf_links, ...urls] }))
    setUploadingPdfLinks(false)
  }

  const removeGalleryImage = (index: number) => {
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }))
  }

  const removePdfLink = (index: number) => {
    setForm(f => ({ ...f, pdf_links: f.pdf_links.filter((_, i) => i !== index) }))
  }

  const getPublicId = (url: string) => {
    const match = url.match(/\/store-products\/(.+)$/)
    return match ? `store-products/${match[1].replace(/\.[^/.]+$/, '')}` : null
  }

  const deleteCloudinaryImage = async (url: string) => {
    if (!url.includes('cloudinary')) return
    const publicId = getPublicId(url)
    if (publicId) await fetch(`/admin/api/upload/${encodeURIComponent(publicId)}`, { method: 'DELETE' })
  }

  const save = async () => {
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/admin/api/products/${editing.slug}` : '/admin/api/products'
    if (editing && editing.image && editing.image !== form.image) await deleteCloudinaryImage(editing.image)
    if (editing && editing.gallery) {
      const removed = editing.gallery.filter(img => !form.gallery.includes(img))
      await Promise.all(removed.map(deleteCloudinaryImage))
    }
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    await load(); setSaving(false); setModalOpen(false)
  }

  const del = async (id: string) => {
    const product = products.find(p => p.id === id)
    if (product) {
      if (product.image) await deleteCloudinaryImage(product.image)
      if (product.gallery) await Promise.all(product.gallery.map(deleteCloudinaryImage))
    }
    await fetch(`/admin/api/products/${id}`, { method: 'DELETE' })
    await load(); setDeleteConfirm(null)
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const isBusy = saving || uploading || uploadingGallery || uploadingPdf || uploadingPdfLinks

  return (
    <div>
      <style>{`
        .prod-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 12px;
        }
        .prod-search {
          width: 280px;
        }
        .prod-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .prod-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 680px;
        }

        /* Mobile card list */
        .prod-cards {
          display: none;
          flex-direction: column;
          gap: 10px;
        }
        .prod-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .prod-card-info { flex: 1; min-width: 0; }
        .prod-card-name {
          font-weight: 500;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .prod-card-meta {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .prod-card-actions {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .prod-search { width: 100%; margin-bottom: 12px; }
          .prod-table-wrap { display: none; }
          .prod-cards { display: flex; }
          .prod-header { flex-wrap: wrap; }
          .prod-header h1 { font-size: 20px; }
        }
      `}</style>

      <div className="prod-header">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Products</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{products.length} products</p>
        </div>
        <button onClick={openNew} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: '500', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}>
          + Add Product
        </button>
      </div>

      <input
        className="prod-search"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: '9px 14px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--surface)', color: 'var(--text)', marginBottom: '16px' }}
      />

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="prod-table-wrap" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table className="prod-table">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Product', 'Brand', 'Category', 'Price', 'Gallery', 'PDF', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>⊡</div>
                        )}
                        <div>
                          <div style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>{product.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{product.brand}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{product.category}</td>
                    <td style={{ padding: '14px 20px', fontWeight: '500', whiteSpace: 'nowrap' }}>${product.price.toFixed(2)}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                      {product.gallery?.length > 0 ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {product.gallery.slice(0, 3).map((img, i) => (
                            <img key={i} src={img} alt="" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                          ))}
                          {product.gallery.length > 3 && <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center' }}>+{product.gallery.length - 3}</span>}
                        </div>
                      ) : <span style={{ fontSize: '12px' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      {product.pdf_link ? (
                        <a href={product.pdf_link} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: '11px', color: '#e05252', fontWeight: '600', textDecoration: 'none' }}>
                          📄 Datasheet
                        </a>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {product.pdf_links?.length ? `📄 ${product.pdf_links.length} PDFs` : '—'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(product)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                        <button onClick={() => setDeleteConfirm(product.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e0525220', background: '#e0525210', color: '#e05252', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="prod-cards">
            {filtered.map(product => (
              <div key={product.id} className="prod-card">
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>⊡</div>
                )}
                <div className="prod-card-info">
                  <div className="prod-card-name">{product.name}</div>
                  <div className="prod-card-meta">{product.brand} · {product.category} · ${product.price.toFixed(2)}</div>
                </div>
                <div className="prod-card-actions">
                  <button onClick={() => openEdit(product)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                  <button onClick={() => setDeleteConfirm(product.id)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #e0525220', background: '#e0525210', color: '#e05252', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No products found</div>
            )}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }} onClick={() => setModalOpen(false)}>
          <div style={{ background: 'var(--surface)', borderRadius: '12px', width: '560px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {[
                { label: 'Product Name', key: 'name', placeholder: 'e.g. Industrial Valve' },
                { label: 'Slug', key: 'slug', placeholder: 'e.g. industrial-valve' },
                { label: 'Brand', key: 'brand', placeholder: 'APS' },
                { label: 'Category', key: 'category', placeholder: 'e.g. Valves' },
                { label: 'Price', key: 'price', placeholder: '0.00' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                  <input value={form[field.key as keyof typeof form] as string} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface2)', color: 'var(--text)', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              ))}

              {/* Main Image */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Main Image</label>
                {form.image ? (
                  <div style={{ position: 'relative' }}>
                    <img src={form.image} alt="preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
                    <button onClick={() => setForm(f => ({ ...f, image: '' }))}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '16px' }}>×</button>
                  </div>
                ) : (
                  <div onClick={() => fileRef.current?.click()}
                    style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {uploading ? 'Uploading...' : <><div style={{ fontSize: '20px', marginBottom: '6px' }}>↑</div><div style={{ fontSize: '13px', fontWeight: '500' }}>Click to upload main image</div></>}
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleMainImage(f) }} />
              </div>

              {/* Gallery Images */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  Gallery Images ({form.gallery.length})
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                  {form.gallery.map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} />
                      <button onClick={() => removeGalleryImage(i)}
                        style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                  <div onClick={() => galleryRef.current?.click()}
                    style={{ border: '2px dashed var(--border)', borderRadius: '6px', height: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px', gap: '4px' }}>
                    {uploadingGallery ? 'Uploading...' : <><span style={{ fontSize: '18px' }}>+</span><span>Add</span></>}
                  </div>
                </div>
                <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => { if (e.target.files) handleGalleryImages(e.target.files) }} />
              </div>

              {/* Main Datasheet PDF */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  Main Datasheet (PDF)
                </label>
                {form.pdf_link ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface2)' }}>
                    <span style={{ fontSize: '20px' }}>📄</span>
                    <a href={form.pdf_link} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: '13px', color: '#e05252', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>View PDF</a>
                    <button onClick={() => setForm(f => ({ ...f, pdf_link: '' }))}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>×</button>
                  </div>
                ) : (
                  <div onClick={() => pdfRef.current?.click()}
                    style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {uploadingPdf ? 'Uploading PDF...' : <><div style={{ fontSize: '24px', marginBottom: '6px' }}>📄</div><div style={{ fontSize: '13px', fontWeight: '500' }}>Click to upload datasheet PDF</div></>}
                  </div>
                )}
                <input ref={pdfRef} type="file" accept="application/pdf" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleMainPdf(f) }} />
              </div>

              {/* Model PDFs */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                  Model PDFs ({form.pdf_links.length}) — one per model
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                  {form.pdf_links.map((url, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface2)' }}>
                      <span style={{ fontSize: '16px' }}>📄</span>
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: '#e05252', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Model PDF {i + 1}
                      </a>
                      <button onClick={() => removePdfLink(i)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}>×</button>
                    </div>
                  ))}
                  <div onClick={() => pdfLinksRef.current?.click()}
                    style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '14px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px' }}>
                    {uploadingPdfLinks ? 'Uploading...' : '+ Add Model PDF(s)'}
                  </div>
                </div>
                <input ref={pdfLinksRef} type="file" accept="application/pdf" multiple style={{ display: 'none' }}
                  onChange={e => { if (e.target.files) handlePdfLinks(e.target.files) }} />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Product description..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface2)', color: 'var(--text)', fontSize: '14px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={() => setModalOpen(false)} style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
                <button onClick={save} disabled={isBusy}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontWeight: '500', opacity: isBusy ? 0.7 : 1 }}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }} onClick={() => setDeleteConfirm(null)}>
          <div style={{ background: 'var(--surface)', borderRadius: '12px', width: '400px', maxWidth: '100%', padding: '24px', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Delete Product?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>This will delete the product and all its images permanently.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => del(deleteConfirm)} style={{ padding: '9px 16px', borderRadius: '8px', border: 'none', background: '#e05252', color: '#fff', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}