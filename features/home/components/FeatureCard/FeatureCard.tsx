'use client';

import React from 'react';
import Link from 'next/link';
import { Icon, Badge } from '@/shared/components';

/**
 * Feature card configuration.
 */
export interface FeatureCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  href: string;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
  stats?: string | number;
  subtitle?: string;
}

/**
 * FeatureCard component - iOS-style feature card.
 * 
 * Features:
 * - iOS-style gradient backgrounds
 * - Smooth press animations
 * - Rounded corners and subtle shadows
 * - Stats badge display
 * - Dark mode compatible
 * - Touch-optimized interactions
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  href,
  gradientFrom,
  gradientTo,
  iconBg,
  stats,
  subtitle,
}) => {
  return (
    <Link href={href} className="block group">
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 active:scale-[0.98]">
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        />
        
        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Icon and text */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Icon container */}
              <div
                className={`${iconBg} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
              >
                <Icon name={icon} size={28} className="text-white" />
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-xl font-bold text-text-primary">
                    {title}
                  </h3>
                  {stats !== undefined && (
                    <Badge variant="primary" size="sm" className="font-bold">
                      {stats}
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-text-secondary mb-1">
                  {description}
                </p>
                {subtitle && (
                  <p className="text-xs font-medium text-text-tertiary">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Chevron */}
            <div className="flex-shrink-0 pt-1">
              <Icon
                name="chevron-right"
                size={20}
                className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

