'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PieChart, PlusCircle } from 'lucide-react';
import styles from './Layout.module.css';
import clsx from 'clsx';

export default function Layout({ children }) {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/budget', label: 'Budget', icon: PieChart },
    ];

    return (
        <div className={styles.container}>
            <header className={clsx(styles.header, 'glass')}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <span className={styles.logoText}>$</span>
                    </div>
                    <h1>ExpenseFlow</h1>
                </div>
                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(styles.navLink, isActive && styles.active)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </header>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
