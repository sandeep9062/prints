"use client";

import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Home,
  Building2,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import {
  useGetMyAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  Address,
} from "@/services/addressApi";

const emptyForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function AddressBookPage() {
  const { data, isLoading } = useGetMyAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const addresses = data?.addresses || [];

  const handleAdd = async () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.street ||
      !form.city ||
      !form.state ||
      !form.pincode
    )
      return;
    try {
      await addAddress(form).unwrap();
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id).unwrap();
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900">
            Address Book
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Manage your saved addresses
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2.5 px-5 py-2.5 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-stone-800 transition-all duration-200 shadow-sm"
        >
          {showForm ? (
            <X className="w-3.5 h-3.5" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          {showForm ? "Cancel" : "Add New Address"}
        </button>
      </div>

      {/* Add Address Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-6 animate-fadeIn">
          <h3 className="font-semibold text-stone-900 mb-4">New Address</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Full Name *"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition-all text-sm"
            />
            <input
              placeholder="Phone *"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition-all text-sm"
            />
            <input
              placeholder="Street / Address *"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition-all text-sm md:col-span-2"
            />
            <input
              placeholder="City *"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition-all text-sm"
            />
            <input
              placeholder="State *"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition-all text-sm"
            />
            <input
              placeholder="Pincode *"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition-all text-sm"
            />
            <input
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 transition-all text-sm"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAdd}
              disabled={isAdding}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-stone-800 transition-all disabled:opacity-50 shadow-sm"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isAdding ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
        </div>
      )}

      {/* Addresses Grid */}
      {!isLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.length === 0 && !showForm && (
            <div className="md:col-span-2 py-16 text-center text-stone-400">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-stone-300" />
              <p>No addresses saved yet.</p>
            </div>
          )}
          {addresses.map((addr: Address) => (
            <div
              key={addr._id}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                      <Home className="w-5 h-5 text-stone-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900">
                        {addr.fullName}
                      </h3>
                      <span className="text-xs text-stone-400">Default</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(addr._id)}
                      disabled={isDeleting}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {addr.street}, {addr.city}, {addr.state}, {addr.country},{" "}
                  {addr.pincode}
                </p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-stone-50">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <p className="text-sm text-stone-500">{addr.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
