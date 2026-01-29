'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const isLogin = pathname?.startsWith('/login');
    const isSignup = pathname?.startsWith('/signup');

    if (isAdmin || isLogin || isSignup) {
        return null;
    }

    return <Footer />;
}
