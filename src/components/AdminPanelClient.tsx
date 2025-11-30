"use client";

import { useEffect, useState } from 'react';
import { Perfume } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { uploadImageToSupabase } from '@/utils/supabaseUtils';

// Helper to create an empty product
function emptyProduct(): Partial<Perfume & { imageData?: string; imageFile?: File }> {
  return {
    name: '',
    category: 'unisex',
    image: '/placeholder.jpg',
    sizes: [{ size: '100ml', price: 0 }],
    description: '',
    notes: '',
    imageData: undefined,
    imageFile: undefined
  };
}

// Reusable Styles
const INPUT_CLASS = "w-full p-3 rounded-xl bg-primary-dark border border-white/10 text-white placeholder-gray-500 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none transition duration-300 shadow-inner";
const LABEL_CLASS = "block mb-2 text-accent-gold/90 font-bold tracking-wider uppercase text-xs";
const CARD_CLASS = "bg-primary-darker rounded-2xl border border-white/5 shadow-xl overflow-hidden";

export default function AdminPanelClient() {
  const [items, setItems] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Partial<Perfume & { imageData?: string; imageFile?: File }> | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Partial<Perfume> | null>(null);

  async function fetchList() {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Perfume[];
      setItems(products);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchList(); }, []);

  // --- Handlers ---

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const payload = editing || emptyProduct();

    if (!payload.name || !payload.sizes || payload.sizes.length === 0) {
      alert('Please provide name and at least one size with price.');
      return;
    }

    // Check if image is selected (either new file or existing placeholder which is not allowed for new products usually)
    if (!payload.imageFile && (!payload.image || payload.image === '/placeholder.jpg')) {
      alert('Please select an image.');
      return;
    }

    const hasValidPrice = payload.sizes.every(s => s.price > 0);
    if (!hasValidPrice) {
      alert('All sizes must have a price greater than 0.');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = payload.image || "";
      if (payload.imageFile) {
        imageUrl = await uploadImageToSupabase(payload.imageFile);
      }

      // Remove temporary fields
      const { imageData, imageFile, ...productData } = payload;

      await addDoc(collection(db, "products"), {
        ...productData,
        image: imageUrl,
        createdAt: new Date().toISOString()
      });

      setEditing(null);
      setCreating(false);
      fetchList();
      alert('Product added successfully!');
    } catch (error) {
      console.error("Error adding product:", error);
      alert('Failed to create product.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!editing) return;

    if (!editing.name || !editing.sizes || editing.sizes.length === 0) {
      alert('Please provide name and at least one size with price.');
      return;
    }

    const hasValidPrice = editing.sizes.every(s => s.price >= 0);
    if (!hasValidPrice) {
      alert('All sizes must have a valid price.');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = editing.image || "";
      if (editing.imageFile) {
        imageUrl = await uploadImageToSupabase(editing.imageFile);
      }

      // Remove temporary fields and id
      const { imageData, imageFile, id: _id, ...productData } = editing;

      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        ...productData,
        image: imageUrl
      });

      setEditing(null);
      fetchList();
      alert('Product updated successfully!');
    } catch (error) {
      console.error("Error updating product:", error);
      alert('Failed to update product.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string | undefined) {
    if (!id) return;

    try {
      await deleteDoc(doc(db, "products", id));
      fetchList();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error("Error deleting product:", error);
      alert('Failed to delete product.');
    }
  }

  return (
    <div className="min-h-screen bg-primary-dark text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-200 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400 text-sm md:text-base">Manage your exclusive fragrance collection.</p>
          </div>

          <button
            onClick={() => {
              if (creating) {
                setCreating(false);
                setEditing(null);
              } else {
                setCreating(true);
                setEditing(emptyProduct());
              }
            }}
            className={`
              w-full md:w-auto px-8 py-3 rounded-full font-bold shadow-lg transform transition-all duration-300 hover:scale-105
              ${creating
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gradient-to-r from-accent-gold to-yellow-500 text-primary-dark hover:shadow-accent-gold/20'}
            `}
          >
            {creating ? 'Cancel' : '+ New Product'}
          </button>
        </div>

        {/* --- Editor Section --- */}
        {(creating || (editing && !creating)) && (
          <div className={`${CARD_CLASS} p-6 md:p-8 mb-12 animate-fade-in border-accent-gold/20`}>
            <h2 className="text-2xl font-bold text-accent-gold mb-8 pb-4 border-b border-white/10">
              {creating ? 'Create New Product' : 'Edit Product'}
            </h2>

            <form onSubmit={creating ? handleCreate : (e) => { e.preventDefault(); handleUpdate(editing?.id!) }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Image Section (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-black/40 border-2 border-dashed border-gray-700 flex items-center justify-center relative group">
                    {editing?.image || editing?.imageData ? (
                      <img src={editing.imageData || editing.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-medium">Change Image</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) return alert("Image max 2MB");
                          const reader = new FileReader();
                          reader.onload = () => setEditing({
                            ...editing,
                            imageData: reader.result as string,
                            imageFile: file
                          });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-center text-gray-500">Click to upload (Max 2MB)</p>
                </div>

                {/* Details Section (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={LABEL_CLASS}>Product Name</label>
                      <input
                        value={editing?.name ?? ""}
                        onChange={e => setEditing({ ...editing, name: e.target.value })}
                        className={INPUT_CLASS}
                        placeholder="e.g. Midnight Rose"
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS}>Category</label>
                      <select
                        value={editing?.category ?? 'unisex'}
                        onChange={e => setEditing({ ...editing, category: e.target.value })}
                        className={`${INPUT_CLASS} appearance-none cursor-pointer`}
                      >
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLASS}>Description</label>
                    <input
                      value={editing?.description ?? ""}
                      onChange={e => setEditing({ ...editing, description: e.target.value })}
                      className={INPUT_CLASS}
                      placeholder="Short engaging description..."
                    />
                  </div>

                  <div>
                    <label className={LABEL_CLASS}>Fragrance Notes</label>
                    <textarea
                      value={editing?.notes ?? ""}
                      onChange={e => setEditing({ ...editing, notes: e.target.value })}
                      className={`${INPUT_CLASS} h-24 resize-none`}
                      placeholder="Top: ... Middle: ... Base: ..."
                    />
                  </div>

                  {/* Sizes & Prices */}
                  <div className="bg-primary-dark/50 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <label className={LABEL_CLASS}>Sizes & Prices</label>
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, sizes: [...(editing?.sizes || []), { size: '50ml', price: 0 }] })}
                        className="text-xs bg-accent-gold text-primary-dark px-3 py-1 rounded-full font-bold hover:bg-yellow-400 transition whitespace-nowrap"
                      >
                        + Add Variant
                      </button>
                    </div>
                    <div className="space-y-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {(editing?.sizes || []).map((s, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 bg-black/20 rounded-lg">
                          {/* Input container: Stacks vertically on small screens, uses grid for 2 columns */}
                          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Size Input */}
                            <input
                              value={s.size}
                              onChange={e => {
                                const newSizes = [...(editing?.sizes || [])];
                                newSizes[idx].size = e.target.value;
                                setEditing({ ...editing, sizes: newSizes });
                              }}
                              className={`${INPUT_CLASS} py-2`}
                              placeholder="Size (e.g. 50ml)"
                            />
                            {/* Price Input */}
                            <input
                              type="number"
                              value={s.price}
                              onChange={e => {
                                const newSizes = [...(editing?.sizes || [])];
                                newSizes[idx].price = Number(e.target.value);
                                setEditing({ ...editing, sizes: newSizes });
                              }}
                              className={`${INPUT_CLASS} py-2`}
                              placeholder="Price (e.g. 120)"
                            />
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const newSizes = (editing?.sizes || []).filter((_, i) => i !== idx);
                              setEditing({ ...editing, sizes: newSizes });
                            }}
                            // Use ml-auto to push it to the right, self-center for vertical alignment with the stacked inputs
                            className="text-red-400 hover:text-red-300 p-2 self-center flex-shrink-0"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto px-8 py-3 bg-accent-gold text-primary-dark font-bold rounded-xl shadow-lg hover:bg-yellow-400 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : (creating ? 'Create Product' : 'Save Changes')}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* --- Product List --- */}

        {/* Mobile Cards (Visible < md) */}
        <div className="md:hidden space-y-6">
          {loading && !creating && !editing ? <p className="text-center text-gray-500">Loading...</p> : items.map(p => (
            <div key={p.id} className={`${CARD_CLASS} flex flex-col border-white/10 shadow-lg`}>
              <div className="relative h-48 w-full">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-accent-gold border border-accent-gold/20 uppercase">
                  {p.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {p.sizes.map(s => (
                    <span key={s.size} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-md text-gray-300">
                      {s.size} • ${s.price}
                    </span>
                  ))}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setEditing(p); setCreating(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="py-2.5 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition border border-white/5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(p)}
                    className="py-2.5 rounded-lg bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition border border-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table (Visible >= md) */}
        <div className="hidden md:block">
          <div className={`${CARD_CLASS} overflow-hidden`}>
            <table className="w-full text-left">
              <thead className="bg-white/5 text-accent-gold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-6 font-bold">Product</th>
                  <th className="p-6 font-bold">Category</th>
                  <th className="p-6 font-bold">Variants</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && !creating && !editing ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : items.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition duration-150 group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-gray-800" />
                        <div>
                          <p className="font-bold text-white group-hover:text-accent-gold transition">{p.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10 uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {p.sizes.map(s => (
                          <span key={s.size} className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded">
                            {s.size} <span className="text-gray-500">/</span> ${s.price}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition">
                        <button
                          onClick={() => { setEditing(p); setCreating(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="p-2 hover:bg-accent-gold/20 rounded-lg text-accent-gold transition"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => setConfirmDelete(p)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Delete Modal --- */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-primary-darker border border-red-500/20 rounded-2xl p-8 max-w-sm w-full shadow-2xl transform scale-100 transition-all">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Product?</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Are you sure you want to delete <span className="text-white font-semibold">{confirmDelete.name}</span>? This action cannot be undone.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="py-2.5 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => { await handleDelete(confirmDelete.id); setConfirmDelete(null); }}
                    className="py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition shadow-lg shadow-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.5); }
      `}</style>
    </div>
  );
}