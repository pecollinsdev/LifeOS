'use client';

import React, { useEffect, useMemo } from 'react';
import { PageHeader, ThemeToggle } from '@/shared/components';
import { FeatureCard } from '../FeatureCard';
import { useActiveTasksCount, useTaskActions } from '@/features/tasks';
import { useHabitsCount, useHabitActions } from '@/features/habits';
import { useBalance, useFinanceActions } from '@/features/finance';
import { useWorkouts, useFitnessActions } from '@/features/fitness';
import { useMeals, useNutritionActions } from '@/features/nutrition';

/**
 * HomeDashboard component - iOS-style main dashboard view.
 * 
 * Features:
 * - iOS-style gradient cards with smooth animations
 * - Real-time stats from all feature modules
 * - Touch-optimized interactions
 * - Dark mode compatible
 * - Mobile-first responsive layout
 * 
 * Performance: Uses selectors to get only needed data, not entire arrays.
 */
export const HomeDashboard: React.FC = () => {
  // Load data from all feature stores
  const activeTasksCount = useActiveTasksCount();
  const habitsCount = useHabitsCount();
  const { balance } = useBalance();
  const workouts = useWorkouts();
  const meals = useMeals();
  
  const { loadTasks } = useTaskActions();
  const { loadHabits } = useHabitActions();
  const { loadTransactions } = useFinanceActions();
  const { loadWorkouts } = useFitnessActions();
  const { loadMeals } = useNutritionActions();

  // Load initial data
  useEffect(() => {
    loadTasks();
    loadHabits();
    loadTransactions();
    loadWorkouts();
    loadMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format currency for finance display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Performance: Memoize features array to prevent recreation on every render
  const features = useMemo(() => [
    {
      id: 'tasks',
      title: 'Tasks',
      description: 'Manage your to-dos',
      icon: 'tasks' as const,
      href: '/tasks',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      stats: activeTasksCount > 0 ? activeTasksCount : undefined,
      subtitle: activeTasksCount > 0 ? `${activeTasksCount} active` : undefined,
    },
    {
      id: 'habits',
      title: 'Habits',
      description: 'Track daily habits',
      icon: 'habits' as const,
      href: '/habits',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-emerald-600',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      stats: habitsCount > 0 ? habitsCount : undefined,
      subtitle: habitsCount > 0 ? `${habitsCount} habit${habitsCount !== 1 ? 's' : ''}` : undefined,
    },
    {
      id: 'finance',
      title: 'Finance',
      description: 'Track expenses & budget',
      icon: 'finance' as const,
      href: '/finance',
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-amber-600',
      iconBg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      stats: balance !== 0 ? formatCurrency(balance) : undefined,
      subtitle: balance !== 0 ? (balance >= 0 ? 'Positive balance' : 'Negative balance') : undefined,
    },
    {
      id: 'fitness',
      title: 'Fitness',
      description: 'Workouts & activity',
      icon: 'fitness' as const,
      href: '/fitness',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-rose-600',
      iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
      stats: workouts.length > 0 ? workouts.length : undefined,
      subtitle: workouts.length > 0 ? `${workouts.length} workout${workouts.length !== 1 ? 's' : ''}` : undefined,
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Meals & calories',
      icon: 'nutrition' as const,
      href: '/nutrition',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-violet-600',
      iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
      stats: meals.length > 0 ? meals.length : undefined,
      subtitle: meals.length > 0 ? `${meals.length} meal${meals.length !== 1 ? 's' : ''}` : undefined,
    },
  ], [activeTasksCount, habitsCount, balance, workouts.length, meals.length]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="LifeOS"
        subtitle="Your personal life dashboard"
        rightAction={<ThemeToggle />}
      />

      <main className="max-w-2xl mx-auto px-5 py-6">
        {/* Welcome section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-text-secondary">
            Here's an overview of your life domains
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </main>
    </div>
  );
};

