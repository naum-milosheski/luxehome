'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Users, Settings, LogOut, Package, X } from 'lucide-react';
import clsx from 'clsx';
import { signOut } from '@/lib/auth';

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Add Property', href: '/admin/add-property', icon: PlusCircle },
    { label: 'My Inventory', href: '/admin/inventory', icon: Package },
    { label: 'Leads CRM', href: '/admin/leads', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside
                className={clsx(
                    "w-64 bg-brand-card border-r border-gray-100 h-[100svh] fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 overflow-hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 flex items-center justify-between w-full">
                    <div>
                        <Link href="/" className="text-2xl font-bold tracking-tight text-brand-dark">
                            LuxeHome<span className="text-brand-lime">.</span>
                        </Link>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Admin Panel</p>
                    </div>
                    {/* Close button for mobile/tablet */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-brand-dark transition-colors -mr-2"
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        // Normalize pathname (remove trailing slash)
                        const normalizedPathname = pathname?.endsWith('/') && pathname !== '/'
                            ? pathname.slice(0, -1)
                            : pathname;

                        // Special handling for Dashboard to match /admin exactly (not child routes)
                        const isActive = item.href === '/admin'
                            ? normalizedPathname === '/admin'
                            : normalizedPathname?.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                    isActive
                                        ? "bg-brand-lime text-brand-dark shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-brand-dark"
                                )}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all w-full font-medium"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
