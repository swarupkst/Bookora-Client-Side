"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AdminShell({ children, title, subtitle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      
      {/* Mobile Sidebar */}
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      {/* Main Admin Area */}
      <div className="lg:pl-72">
        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
          
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="mt-1 text-sm text-zinc-500">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
          
        </main>
      </div>
    </div>
  );
}