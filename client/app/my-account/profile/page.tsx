"use client";

import { User, Edit2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
        <h2 className="text-2xl font-serif text-stone-900">My Profile</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="bg-white border border-stone-100 shadow-sm p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-stone-100">
          <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center">
            <User className="w-10 h-10 text-stone-400" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-stone-900">
              Sandeep Saini
            </h3>
            <p className="text-stone-500">sandeep@example.com</p>
            <p className="text-stone-500">+91 9729907448</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-2">
              Full Name
            </label>
            <p className="text-stone-900">Sandeep Saini</p>
          </div>
          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-2">
              Email Address
            </label>
            <p className="text-stone-900">sandeep@example.com</p>
          </div>
          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-2">
              Phone Number
            </label>
            <p className="text-stone-900">+91 9729907448</p>
          </div>
          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-2">
              Member Since
            </label>
            <p className="text-stone-900">December 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
