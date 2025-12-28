'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, Icon, PageHeader, Badge, ThemeToggle } from '@/shared/components';
import { useActiveTasksCount, useTaskActions } from '@/features/tasks';

/**
 * Feature card configuration.
 * Each domain gets a card on the home dashboard.
 */
interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  href: string;
  color: string;
  stats?: string | number;
}

/**
 * HomeDashboard component - Main dashboard view.
 * 
 * Displays an overview of all life domains with quick stats
 * and navigation to detailed views. Mobile-optimized grid layout.
 * 
 * Performance: Uses selector to get only active tasks count, not entire tasks array.
 */
export const HomeDashboard: React.FC = () => {
  // Performance: Only subscribe to the count, not the entire tasks array
  const activeTasksCount = useActiveTasksCount();
  const { loadTasks } = useTaskActions();

  useEffect(() => {
    loadTasks();
    // Performance: loadTasks is stable (from selector), but include it for safety
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Performance: Memoize features array to prevent recreation on every render
  const features: FeatureCard[] = useMemo(() => [
    {
      id: 'tasks',
      title: 'Tasks',
      description: 'Manage your to-dos',
      icon: 'tasks',
      href: '/tasks',
      color: 'bg-blue-500',
      stats: activeTasksCount > 0 ? activeTasksCount : undefined,
    },
    {
      id: 'habits',
      title: 'Habits',
      description: 'Track daily habits',
      icon: 'habits',
      href: '/habits',
      color: 'bg-green-500',
    },
    {
      id: 'finance',
      title: 'Finance',
      description: 'Track expenses & budget',
      icon: 'finance',
      href: '/finance',
      color: 'bg-yellow-500',
    },
    {
      id: 'fitness',
      title: 'Fitness',
      description: 'Workouts & activity',
      icon: 'fitness',
      href: '/fitness',
      color: 'bg-red-500',
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Meals & calories',
      icon: 'nutrition',
      href: '/nutrition',
      color: 'bg-purple-500',
    },
  ], [activeTasksCount]);

  return (
    <div className="min-h-screen bg-background pb-safe-bottom">
      <PageHeader
        title="LifeOS"
        subtitle="Your personal life dashboard"
        rightAction={<ThemeToggle />}
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-3">
          {features.map((feature) => (
            <Link key={feature.id} href={feature.href}>
              <Card className="hover:shadow-md transition-all active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div
                    className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon name={feature.icon} size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                        {feature.title}
                      </h2>
                      {feature.stats !== undefined && (
                        <Badge variant="primary">{feature.stats}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                  <Icon
                    name="chevron-right"
                    size={20}
                    className="text-neutral-400 dark:text-neutral-500 flex-shrink-0"
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

