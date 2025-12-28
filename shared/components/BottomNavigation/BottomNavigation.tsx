'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../Icon';

/**
 * Navigation item configuration.
 */
interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  href: string;
  color: string;
}

/**
 * BottomNavigation component - iOS-style bottom tab bar.
 * 
 * Features:
 * - iOS-style bottom navigation bar
 * - Active state indicators
 * - Safe area support for iPhone
 * - Smooth transitions
 * - Touch-optimized targets (minimum 44px)
 * - Blur backdrop effect (iOS-style)
 * 
 * Navigation items match the main dashboard features.
 */
export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      href: '/',
      color: 'text-blue-600',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: 'tasks',
      href: '/tasks',
      color: 'text-blue-600',
    },
    {
      id: 'habits',
      label: 'Habits',
      icon: 'habits',
      href: '/habits',
      color: 'text-green-600',
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: 'finance',
      href: '/finance',
      color: 'text-yellow-600',
    },
    {
      id: 'fitness',
      label: 'Fitness',
      icon: 'fitness',
      href: '/fitness',
      color: 'text-red-600',
    },
    {
      id: 'nutrition',
      label: 'Nutrition',
      icon: 'nutrition',
      href: '/nutrition',
      color: 'text-purple-600',
    },
  ];

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-t border-gray-200/60" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-6 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all duration-150 active:scale-95 min-h-[60px] ${
                  active
                    ? `${item.color} bg-primary-50`
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  name={item.icon}
                  size={24}
                  className={active ? 'scale-110' : ''}
                />
                <span
                  className={`text-[10px] font-semibold leading-tight ${
                    active ? 'opacity-100' : 'opacity-70'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

