"use client";

import { useEffect, useState } from 'react';
import { Perfume } from '@/types';
// NOTE: Assuming primary-dark is a very dark color (e.g., #0A0A0A)
// and accent-gold is a rich gold (e.g., #D4AF37)

function emptyProduct(): Partial<Perfume & { imageData?: string }> {
  return { name: '', category: 'unisex', image: '/placeholder.jpg', sizes: [{ size: '100ml', price: 0 }], description: '', notes: '', imageData: undefined };
}

// Reusable Input/Select/Textarea class for consistency and better look
const INPUT_CLASS = "p-3 rounded-lg bg-primary-darker/50 border border-accent-gold/20 text-white placeholder-gray-500 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none transition duration-300 shadow-inner";

// Reusable Label/Span class
const LABEL_SPAN_CLASS = "mb-1 text-accent-gold/90 font-semibold tracking-wider uppercase text-xs";

export default function AdminPanelClient() {
  const [items, setItems] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Partial<Perfume & { imageData?: string }> | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Partial<Perfume> | null>(null);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setItems(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchList(); }, []);

  // --- Handlers (Logic remains the same) ---

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const payload = editing || emptyProduct();

    if (!payload.name || !payload.sizes || payload.sizes.length === 0) {
      alert('Please provide name and at least one size with price.');
      return;
    }
    if (!payload.imageData && (!payload.image || payload.image === '/placeholder.jpg')) {
      alert('Please select an image.');
      return;
    }

    // Ensure price is not 0 for creation
    const hasValidPrice = payload.sizes.every(s => s.price > 0);
    if (!hasValidPrice) {
      alert('All sizes must have a price greater than 0.');
      return;
    }

    const res = await fetch('/api/admin/products', { method: 'POST', body: JSON.stringify(payload), headers: { 'content-type': 'application/json' } });
    if (res.ok) {
      setEditing(null);
      setCreating(false);
      fetchList();
      try { new BroadcastChannel('admin-products').postMessage('updated'); } catch { }
    } else {
      alert('Failed to create product.');
    }
  }

  async function handleUpdate(id: string) {
    if (!editing) return;

    if (!editing.name || !editing.sizes || editing.sizes.length === 0) {
      alert('Please provide name and at least one size with price.');
      return;
    }

    const hasValidPrice = editing.sizes.every(s => s.price >= 0); // Allow 0 for updates if logic allows
    if (!hasValidPrice) {
      alert('All sizes must have a valid price.');
      return;
    }

    const res = await fetch(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(editing), headers: { 'content-type': 'application/json' } });
    if (res.ok) {
      setEditing(null);
      fetchList();
      try { new BroadcastChannel('admin-products').postMessage('updated'); } catch { }
    } else {
      alert('Failed to update product.');
    }
  }

  async function handleDelete(id: string | undefined) {
    if (!id) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchList();
      try { new BroadcastChannel('admin-products').postMessage('updated'); } catch { }
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-primary-darkest"> {/* New dark background for the page */}
      <div className="max-w-7xl mx-auto rounded-3xl bg-primary-dark/80 backdrop-blur-sm border border-accent-gold/10 shadow-[0_0_50px_rgba(212,175,55,0.1)] p-6 sm:p-10">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-10 border-b border-accent-gold/20 pb-4">
          <div>
            <h2 className="text-4xl font-extrabold text-accent-gold tracking-tighter">✨ Product Administration</h2>
            <p className="text-base text-gray-300 mt-2 font-light">Efficiently manage your entire perfume catalog.</p>
          </div>
          <div>
            {creating ? (
              <button onClick={() => { setCreating(false); setEditing(null); }} className="px-5 py-2 rounded-full bg-gray-600 text-white font-medium hover:bg-gray-700 transition duration-300 shadow-lg">
                Cancel Creation
              </button>
            ) : (
              <button onClick={() => { setCreating(true); setEditing(emptyProduct()); }} className="px-6 py-3 rounded-full bg-gradient-to-r from-accent-gold to-yellow-400 text-primary-dark font-bold shadow-2xl shadow-accent-gold/30 hover:opacity-95 transition duration-300 transform hover:scale-[1.02]">
                + New Product
              </button>
            )}
          </div>
        </div>

        {/* --- Create Product Panel (New Styling) --- */}
        {(creating || (editing && !creating)) && (
          <form
            onSubmit={creating ? handleCreate : (e) => { e.preventDefault(); handleUpdate(editing?.id!) }}
            className="mb-12 w-full rounded-2xl bg-primary-darker/60 border border-accent-gold/20 p-8 shadow-3xl shadow-primary-darker"
          >
            <h3 className="text-2xl font-bold text-accent-gold mb-8">{creating ? 'Create New Product' : 'Edit Product'}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

              {/* LEFT: Image Upload */}
              <div className="col-span-1 flex flex-col items-center gap-6 p-4 bg-primary-dark/30 rounded-xl border border-gray-700/50">

                {/* Preview Card */}
                <div className="w-full aspect-square max-w-[200px] rounded-2xl overflow-hidden bg-primary-darker/50 border-2 border-accent-gold/30 shadow-xl flex items-center justify-center">
                  {editing?.image ? (
                    <img src={editing.image} alt="preview" className="w-full h-full object-cover transition-opacity duration-500" />
                  ) : (
                    <div className="text-gray-500 text-sm font-light">Image Preview</div>
                  )}
                </div>

                {/* Upload Input */}
                <label className="w-full text-xs text-gray-300 flex flex-col gap-2">
                  <span className={LABEL_SPAN_CLASS}>Image File (Max 2MB) *</span>
                  <input
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) return alert("Image must be smaller than 2MB");
                      const reader = new FileReader();
                      reader.onload = () =>
                        setEditing({
                          ...editing,
                          imageData: reader.result as string,
                          image: reader.result as string, // For immediate preview
                        });
                      reader.readAsDataURL(file);
                    }}
                    type="file"
                    accept="image/*"
                    className="block w-full text-gray-300 text-sm bg-primary-darker/50 border border-accent-gold/20 rounded-lg p-2 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-gold/80 file:text-primary-dark hover:file:bg-accent-gold transition"
                  />
                </label>
              </div>

              {/* RIGHT: Fields (takes 3/4 of space) */}
              <div className="lg:col-span-3 space-y-6">

                {/* Name + Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col text-xs text-gray-300">
                    <span className={LABEL_SPAN_CLASS}>Name *</span>
                    <input
                      value={editing?.name ?? ""}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className={INPUT_CLASS}
                      placeholder="Ex: Amber Noir"
                    />
                  </label>

                  <label className="flex flex-col text-xs text-gray-300">
                    <span className={LABEL_SPAN_CLASS}>Category</span>
                    <select
                      value={editing?.category ?? 'unisex'}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      className={`${INPUT_CLASS} appearance-none cursor-pointer`}
                    >
                      <option value="men" className='bg-primary-dark'>Men</option>
                      <option value="women" className='bg-primary-dark'>Women</option>
                      <option value="unisex" className='bg-primary-dark'>Unisex</option>
                    </select>
                  </label>
                </div>

                {/* Description */}
                <label className="flex flex-col text-xs text-gray-300">
                  <span className={LABEL_SPAN_CLASS}>Description</span>
                  <input
                    value={editing?.description ?? ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="A captivating short description..."
                    className={INPUT_CLASS}
                  />
                </label>

                {/* Notes */}
                <label className="flex flex-col text-xs text-gray-300">
                  <span className={LABEL_SPAN_CLASS}>Fragrance Notes</span>
                  <textarea
                    value={editing?.notes ?? ""}
                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                    placeholder="Top: Bergamot, Pink Pepper. Middle: Rose, Jasmine. Base: Amber, Musk..."
                    className={`${INPUT_CLASS} h-28 resize-none`}
                  />
                </label>

                {/* Sizes */}
                <div className="rounded-xl bg-primary-dark/50 border border-accent-gold/20 p-5 shadow-inner">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-700/50 pb-2">
                    <h4 className="text-sm text-accent-gold font-bold tracking-wider">Available Sizes & Prices *</h4>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          sizes: [...(editing?.sizes || []), { size: "50ml", price: 0 }],
                        })
                      }
                      className="text-xs px-4 py-1.5 rounded-full bg-accent-gold text-primary-dark font-semibold hover:bg-yellow-400 transition"
                    >
                      + Add Size
                    </button>
                  </div>

                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {(editing?.sizes || []).map((s, idx) => (
                      <div key={idx} className="flex gap-3 items-center bg-primary-darker/40 p-2 rounded-lg border border-gray-700/50">
                        <input
                          value={s.size}
                          onChange={(e) => {
                            const newSizes = (editing!.sizes || []).map((ss, i) =>
                              i === idx ? { ...ss, size: e.target.value } : ss
                            );
                            setEditing({ ...editing!, sizes: newSizes });
                          }}
                          placeholder="Size (e.g., 100ml)"
                          className={`${INPUT_CLASS} p-2 text-sm flex-1`}
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                          <input
                            type="number"
                            value={s.price}
                            onChange={(e) => {
                              const newSizes = (editing!.sizes || []).map((ss, i) =>
                                i === idx ? { ...ss, price: Number(e.target.value) } : ss
                              );
                              setEditing({ ...editing!, sizes: newSizes });
                            }}
                            placeholder="Price"
                            className={`${INPUT_CLASS} p-2 pl-6 w-28 text-sm`}
                            step="0.01"
                            min="0"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const newSizes = (editing!.sizes || []).filter((_, i) => i !== idx);
                            setEditing({ ...editing!, sizes: newSizes });
                          }}
                          className="px-3 py-1.5 rounded-md bg-red-700/80 text-white text-xs font-medium hover:bg-red-600 transition"
                        >
                          <span className='hidden sm:inline'>Remove</span>
                          <span className='sm:hidden'>🗑️</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => { setCreating(false); setEditing(null); }}
                    className="px-6 py-2.5 rounded-full bg-gray-700 text-white font-medium shadow-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-full bg-gradient-to-r from-accent-gold to-yellow-400 text-primary-dark font-bold shadow-lg hover:opacity-95 transition duration-300 transform hover:scale-105"
                  >
                    {creating ? 'Create Product' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Separator if editing/creating */}
        {(creating || (editing && !creating)) && (
          <hr className="border-accent-gold/10 my-10" />
        )}

        {/* --- Product List Table --- */}
        <h3 className="text-2xl font-bold text-gray-300 mb-6">Product List</h3>
        <div className="overflow-x-auto w-full rounded-xl border border-accent-gold/10 shadow-lg bg-primary-darker/50">
          <table className="w-full text-left table-auto">
            <thead className="bg-primary-darker/70">
              <tr className="text-sm text-accent-gold uppercase tracking-wider">
                <th className="p-4 rounded-tl-xl">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4 hidden sm:table-cell">Category</th>
                <th className="p-4 hidden md:table-cell">Sizes & Prices</th>
                <th className="p-4 rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className='text-white/80'>
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-400">Loading products...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500 font-medium">No products found. Click "+ New Product" to start.</td></tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="border-t border-accent-gold/10 hover:bg-primary-dark/30 transition duration-150">
                    <td className="py-4 px-4"><img src={p.image} alt={p.name} className="w-20 h-14 object-cover rounded-md border border-gray-700/50 shadow-md" /></td>
                    <td className="py-4 px-4 font-semibold">{p.name}</td>
                    <td className="py-4 px-4 capitalize hidden sm:table-cell text-accent-gold/70">{p.category}</td>
                    <td className="py-4 px-4 text-xs text-gray-400 hidden md:table-cell">
                      {(p.sizes || []).map(s => <span key={s.size} className="inline-block bg-primary-darker/70 rounded-full px-3 py-1 mr-2 mb-1 border border-accent-gold/10">{s.size} **${s.price.toFixed(2)}**</span>)}
                    </td>
                    <td className="py-4 px-4 flex gap-3">
                      <button
                        onClick={() => { setEditing(p); setCreating(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="px-4 py-1.5 rounded-full bg-accent-gold/20 text-accent-gold text-sm font-medium hover:bg-accent-gold/30 transition shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p)}
                        className="px-4 py-1.5 rounded-full bg-red-700/30 text-red-400 text-sm font-medium hover:bg-red-700/40 transition shadow-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Delete confirmation modal (Refined Styling) --- */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}></div>
            <div className="relative bg-primary-darker border border-red-500/30 rounded-xl p-8 w-full max-w-md z-10 shadow-2xl">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-red-700/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-3xl text-red-400">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-red-400">Confirm Deletion</h3>
                <p className="text-sm text-gray-300">
                  Are you absolutely sure you want to permanently remove <strong className="text-white font-bold">{confirmDelete.name}</strong>?
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-5 py-2 rounded-full bg-gray-600 text-white font-medium hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => { await handleDelete(confirmDelete.id); setConfirmDelete(null); }}
                  className="px-5 py-2 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      {/* Style for the custom scrollbar (usually requires global CSS but can sometimes work inline/tailwind custom setup) */}
      <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #D4AF3740; /* accent-gold/40 */
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #D4AF3780; /* accent-gold/80 */
            }
        `}</style>
    </div>
  );
}