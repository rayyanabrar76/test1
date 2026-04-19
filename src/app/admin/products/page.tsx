'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Package, Upload, FileText, Plus, X, Trash2, Pencil, Image as ImageIcon
} from 'lucide-react'

interface MetaEntry { key: string; value: string }

interface Product {
  id: string; slug: string; name: string; brand: string;
  description: string;
  image: string; gallery: string[]; category: string; createdAt: string;
  pdf_link?: string; pdf_links?: string[];
  metadata?: Record<string, string>;
  badges?: string[];
}

const toId = (str: string) =>
  str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''

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
  const [form, setForm] = useState({
    id: '',
    name: '', brand: 'APS', description: '',
    image: '', gallery: [] as string[], category: '',
    pdf_link: '', pdf_links: [] as string[],
    metadata: [] as MetaEntry[],
    badges: [] as string[],
  })
  const fileRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const pdfRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const data = await fetch('/api/products', { cache: 'no-store' }).then(r => r.json())
    setProducts(data); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ id: '', name: '', brand: 'APS', description: '', image: '', gallery: [], category: '', pdf_link: '', pdf_links: [], metadata: [], badges: [] as string[] })
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    const metaEntries: MetaEntry[] = p.metadata
      ? Object.entries(p.metadata).map(([key, value]) => ({ key, value }))
      : []
    const badgeEntries: string[] = Array.isArray(p.badges) ? p.badges : []
    setForm({
      id: p.id || '',
      name: p.name, brand: p.brand, description: p.description,
      image: p.image, gallery: p.gallery || [],
      category: p.category, pdf_link: p.pdf_link || '', pdf_links: p.pdf_links || [],
      metadata: metaEntries,
      badges: badgeEntries,
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

  const removeGalleryImage = (index: number) => {
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }))
  }

  // --- Metadata helpers ---
  const addMetaRow = () => setForm(f => ({ ...f, metadata: [...f.metadata, { key: '', value: '' }] }))
  const updateMetaRow = (index: number, field: 'key' | 'value', val: string) =>
    setForm(f => ({ ...f, metadata: f.metadata.map((e, i) => i === index ? { ...e, [field]: val } : e) }))
  const removeMetaRow = (index: number) =>
    setForm(f => ({ ...f, metadata: f.metadata.filter((_, i) => i !== index) }))

  // --- Badge helpers ---
  const addBadgeRow = () => setForm(f => ({ ...f, badges: [...f.badges, ''] }))
  const updateBadgeRow = (index: number, val: string) =>
    setForm(f => ({ ...f, badges: f.badges.map((b, i) => i === index ? val : b) }))
  const removeBadgeRow = (index: number) =>
    setForm(f => ({ ...f, badges: f.badges.filter((_, i) => i !== index) }))

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
    const url = editing ? `/admin/api/products/${editing.id}` : '/admin/api/products'

    if (editing && editing.image && editing.image !== form.image) {
      await deleteCloudinaryImage(editing.image)
    }
    if (editing && editing.gallery) {
      const removed = editing.gallery.filter(img => !form.gallery.includes(img))
      await Promise.all(removed.map(deleteCloudinaryImage))
    }

    const metadataObject = form.metadata.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key.trim()] = value
      return acc
    }, {} as Record<string, string>)

    const badgesArray = form.badges.filter(v => v.trim() !== '')

    const finalId = form.id.trim() ? toId(form.id) : toId(form.name)

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, id: finalId, metadata: metadataObject, badges: badgesArray })
    })
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
  const isBusy = saving || uploading || uploadingGallery || uploadingPdf
  const previewId = form.id.trim() ? toId(form.id) : (form.name ? toId(form.name) : '')
  const previewUrl = previewId ? `${SITE_URL}/product/${previewId}` : ''

  return (
    <div>
      <style>{`
        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 12px;
        }
        .products-search {
          padding: 9px 14px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          width: 280px;
          background: var(--surface);
          color: var(--text);
          margin-bottom: 16px;
        }
        .products-table-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .products-table { width: 100%; border-collapse: collapse; }
        .product-cards { display: none; flex-direction: column; gap: 0; }
        .product-card {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .product-card:last-child { border-bottom: none; }
        .product-card-thumb {
          width: 48px; height: 48px;
          border-radius: 8px; object-fit: cover;
          border: 1px solid var(--border); flex-shrink: 0;
        }
        .product-card-thumb-placeholder {
          width: 48px; height: 48px;
          border-radius: 8px;
          background: var(--surface2);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .product-card-body { flex: 1; min-width: 0; }
        .product-card-name {
          font-weight: 500; font-size: 14px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .product-card-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .product-card-actions { display: flex; gap: 6px; margin-top: 10px; }
        .products-modal-inner {
          background: var(--surface);
          border-radius: 12px;
          width: 560px;
          max-width: 95vw;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid var(--border);
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 8px;
        }
        .meta-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 8px;
          align-items: center;
        }
        .meta-input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid var(--border);
          border-radius: 7px;
          background: var(--surface2);
          color: var(--text);
          font-size: 13px;
          box-sizing: border-box;
        }
        .meta-input:focus { outline: none; border-color: var(--accent); }
        .icon-btn {
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); display: flex;
          align-items: center; justify-content: center;
          padding: 4px; border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .icon-btn:hover { color: #e05252; background: #e0525210; }
        .advanced-summary {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          user-select: none;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .advanced-summary::-webkit-details-marker { display: none; }
        .advanced-summary::before {
          content: '›';
          font-size: 16px;
          line-height: 1;
          transition: transform 0.2s;
          display: inline-block;
        }
        details[open] .advanced-summary::before { transform: rotate(90deg); }
        .advanced-details {
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 16px;
        }
        .id-preview {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 6px;
          word-break: break-all;
          line-height: 1.5;
        }
        .id-preview-url {
          color: var(--accent);
          text-decoration: none;
        }
        .id-preview-url:hover {
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .products-header { flex-wrap: wrap; }
          .products-search {
            width: 100%;
            border-radius: 12px;
            margin-bottom: 0;
            font-size: 15px;
            padding: 11px 14px;
          }
          .products-table { display: none; }
          .product-cards { display: flex; }
          .products-table-wrap {
            margin-left: -8px;
            margin-right: -8px;
            border-radius: 14px;
            margin-top: 12px;
          }
          .product-card {
            padding: 14px 16px;
            gap: 14px;
          }
          .product-card-thumb { width: 56px; height: 56px; border-radius: 10px; }
          .product-card-thumb-placeholder { width: 56px; height: 56px; border-radius: 10px; }
          .product-card-name { font-size: 15px; }
          .product-card-meta { font-size: 13px; }
          .product-card-actions { gap: 8px; margin-top: 12px; }
          .product-card-actions button { font-size: 14px; padding: 9px 0; border-radius: 10px; }
          .products-modal-inner {
            width: 100vw; max-width: 100vw;
            height: 100dvh; max-height: 100dvh;
            border-radius: 0;
            border-left: none; border-right: none; border-bottom: none;
          }
          .gallery-grid { grid-template-columns: repeat(3, 1fr); }
          .modal-form-content { padding-bottom: 80px !important; }
          .meta-row { grid-template-columns: 1fr 1fr auto; }
        }
      `}</style>

      <div className="products-header">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600' }}>Products</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{products.length} products</p>
        </div>
        <button onClick={openNew} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: '500', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={15} /> Add Product
        </button>
      </div>

      <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
        className="products-search" />

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <div className="products-table-wrap">
          <table className="products-table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Product', 'Brand', 'Category', 'Gallery', 'PDF', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {product.image ? (
                        <Image src={product.image} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} width={40} height={40} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          <Package size={18} />
                        </div>
                      )}
                      <div>
                        <a
                          href={`${SITE_URL}/product/${product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontWeight: '500', color: 'var(--text)', textDecoration: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                        >
                          {product.name}
                        </a>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{product.brand}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{product.category}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                    {product.gallery?.length > 0 ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {product.gallery.slice(0, 3).map((img, i) => (
                          <Image key={i} src={img} alt="" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border)' }} width={24} height={24} />
                        ))}
                        {product.gallery.length > 3 && <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center' }}>+{product.gallery.length - 3}</span>}
                      </div>
                    ) : <span style={{ fontSize: '12px' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {product.pdf_link ? (
                      <a href={product.pdf_link} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '11px', color: '#e05252', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={13} /> Datasheet
                      </a>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {product.pdf_links?.length ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={13} /> {product.pdf_links.length} PDFs</span>
                        ) : '—'}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(product)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(product.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e0525220', background: '#e0525210', color: '#e05252', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="product-cards">
            {filtered.map(product => (
              <div key={product.id} className="product-card">
                {product.image
                  ? <Image src={product.image} alt={product.name} className="product-card-thumb" width={40} height={40} />
                  : <div className="product-card-thumb-placeholder" style={{ color: 'var(--text-muted)' }}><Package size={20} /></div>
                }
                <div className="product-card-body">
                  <a
                    href={`${SITE_URL}/product/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-card-name"
                    style={{ color: 'var(--text)', textDecoration: 'none', display: 'block' }}
                    onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    {product.name}
                  </a>
                  <div className="product-card-meta">{product.brand} · {product.category}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>{product.id}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {product.gallery?.length > 0 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <ImageIcon size={11} /> {product.gallery.length} images
                      </span>
                    )}
                    {product.pdf_link && (
                      <a href={product.pdf_link} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '11px', color: '#e05252', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <FileText size={11} /> Datasheet
                      </a>
                    )}
                  </div>
                  <div className="product-card-actions">
                    <button onClick={() => openEdit(product)} style={{ flex: 1, padding: '7px 0', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(product.id)} style={{ flex: 1, padding: '7px 0', borderRadius: '6px', border: '1px solid #e0525220', background: '#e0525210', color: '#e05252', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }} onClick={() => setModalOpen(false)}>
          <div className="products-modal-inner" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-form-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {[
                { label: 'Product Name', key: 'name', placeholder: 'e.g. Industrial Valve' },
                { label: 'Brand', key: 'brand', placeholder: 'APS' },
                { label: 'Category', key: 'category', placeholder: 'e.g. Valves' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                  <input value={form[field.key as keyof typeof form] as string} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface2)', color: 'var(--text)', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              ))}

              {/* MAIN IMAGE */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Main Image</label>
                {form.image ? (
                  <div style={{ position: 'relative' }}>
                    <Image src={form.image} alt="preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} width={100} height={140} />
                    <button onClick={() => setForm(f => ({ ...f, image: '' }))}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileRef.current?.click()}
                    style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {uploading ? 'Uploading...' : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <Upload size={20} />
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>Click to upload main image</span>
                      </div>
                    )}
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleMainImage(f) }} />
              </div>

              {/* GALLERY */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Gallery Images ({form.gallery.length})</label>
                <div className="gallery-grid">
                  {form.gallery.map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <Image src={img} alt="" style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} width={100} height={70} />
                      <button onClick={() => removeGalleryImage(i)}
                        style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <div onClick={() => galleryRef.current?.click()}
                    style={{ border: '2px dashed var(--border)', borderRadius: '6px', height: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', gap: '4px' }}>
                    {uploadingGallery ? '...' : <><Plus size={18} /><span style={{ fontSize: '11px' }}>Add</span></>}
                  </div>
                </div>
                <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => { if (e.target.files) handleGalleryImages(e.target.files) }} />
              </div>

              {/* MAIN PDF */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Main Datasheet (PDF)</label>
                {form.pdf_link ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface2)' }}>
                    <FileText size={18} color="#e05252" />
                    <a href={form.pdf_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#e05252', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>View PDF</a>
                    <button onClick={() => setForm(f => ({ ...f, pdf_link: '' }))} className="icon-btn"><X size={16} /></button>
                  </div>
                ) : (
                  <div onClick={() => pdfRef.current?.click()} style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {uploadingPdf ? '...' : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <FileText size={22} />
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>Click to upload PDF</span>
                      </div>
                    )}
                  </div>
                )}
                <input ref={pdfRef} type="file" accept="application/pdf" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleMainPdf(f) }} />
              </div>

              {/* METADATA */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metadata</label>
                  <button onClick={addMetaRow}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500', color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
                    <Plus size={13} /> Add Field
                  </button>
                </div>
                {form.metadata.length === 0 ? (
                  <div style={{ padding: '14px', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                    No metadata yet. Click "Add Field" to start.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="meta-row" style={{ paddingRight: '28px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key</span>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value</span>
                    </div>
                    {form.metadata.map((entry, i) => (
                      <div key={i} className="meta-row">
                        <input className="meta-input" placeholder="e.g. voltage" value={entry.key} onChange={e => updateMetaRow(i, 'key', e.target.value)} />
                        <input className="meta-input" placeholder="e.g. 220V" value={entry.value} onChange={e => updateMetaRow(i, 'value', e.target.value)} />
                        <button onClick={() => removeMetaRow(i)} className="icon-btn"><X size={15} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BADGES */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Badges</label>
                  <button onClick={addBadgeRow}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500', color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
                    <Plus size={13} /> Add Badge
                  </button>
                </div>
                {form.badges.length === 0 ? (
                  <div style={{ padding: '14px', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                    No badges yet. Click "Add Badge" to start.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {form.badges.map((badge, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
                        <input
                          className="meta-input"
                          placeholder="e.g. New Arrival"
                          value={badge}
                          onChange={e => updateBadgeRow(i, e.target.value)}
                        />
                        <button onClick={() => removeBadgeRow(i)} className="icon-btn"><X size={15} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Product description..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface2)', color: 'var(--text)', fontSize: '14px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              {/* ADVANCED SETTINGS */}
              <details className="advanced-details">
                <summary className="advanced-summary">Advanced Settings</summary>
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                    Product ID
                  </label>
                  <input
                    value={form.id}
                    onChange={e => setForm(f => ({ ...f, id: toId(e.target.value) }))}
                    placeholder={form.name ? toId(form.name) : 'auto-generated from name'}
                    style={{
                      width: '100%', padding: '9px 12px',
                      border: '1px solid var(--border)', borderRadius: '8px',
                      background: 'var(--surface2)', color: 'var(--text)',
                      fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box'
                    }}
                  />
                  {previewUrl && (
                    <div className="id-preview">
                      URL:{' '}
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="id-preview-url"
                      >
                        {SITE_URL}/product/<strong>{previewId}</strong>
                      </a>
                    </div>
                  )}
                  {!form.id.trim() && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Leave blank to auto-generate from product name.
                    </div>
                  )}
                </div>
              </details>

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

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }} onClick={() => setDeleteConfirm(null)}>
          <div style={{ background: 'var(--surface)', borderRadius: '12px', width: '400px', maxWidth: '90vw', padding: '24px', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
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
