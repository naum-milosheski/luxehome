'use client';

import AdminSidebar from '@/components/AdminSidebar';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

    return (
        <div className="min-h-screen bg-brand-bg">
            {/* Mobile Header */}
            <div className="md:hidden bg-white p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30">
                <Link href="/" className="text-xl font-bold tracking-tight text-brand-dark">
                    LuxeHome<span className="text-brand-lime">.</span>
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-brand-dark hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 md:ml-64 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
