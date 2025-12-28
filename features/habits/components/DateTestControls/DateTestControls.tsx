'use client';

import React, { useState, useEffect } from 'react';
import { getDateOverride, setDateOverride, clearDateOverride, getCurrentDateString } from '@/lib/utils/date-override';
import { useHabitActions } from '../../store/habitStore';
import { Card, Button, Input } from '@/shared/components';

/**
 * DateTestControls component - Development only.
 * 
 * Allows testing day resets by simulating different dates.
 * Only visible in development mode.
 */
export const DateTestControls: React.FC = () => {
  const [overrideDate, setOverrideDate] = useState('');
  const [currentDate, setCurrentDate] = useState(getCurrentDateString());
  const { loadHabits, recalculateStreaks } = useHabitActions();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Update current date display periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(getCurrentDateString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDateChange = async (newDate: string) => {
    setDateOverride(newDate);
    setOverrideDate(newDate);
    setCurrentDate(getCurrentDateString());
    // Recalculate streaks (this already updates the store with fresh data)
    await recalculateStreaks();
  };

  const handleSetOverride = async () => {
    if (overrideDate.trim()) {
      try {
        await handleDateChange(overrideDate.trim());
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Invalid date');
      }
    }
  };

  const handleClearOverride = async () => {
    clearDateOverride();
    setOverrideDate('');
    setCurrentDate(getCurrentDateString());
    // Recalculate streaks (this already updates the store with fresh data)
    await recalculateStreaks();
  };

  const handleSetYesterday = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];
    await handleDateChange(dateStr);
  };

  const handleSetTomorrow = async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await handleDateChange(dateStr);
  };

  const hasOverride = getDateOverride() !== null;

  return (
    <Card className="bg-yellow-50 border-yellow-200 mb-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-yellow-900">🧪 Dev: Date Testing</h3>
            <p className="text-xs text-yellow-700 mt-0.5">
              Current date: <strong>{currentDate}</strong>
              {hasOverride && <span className="ml-2 text-yellow-600">(OVERRIDDEN)</span>}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Input
            type="date"
            value={overrideDate}
            onChange={(e) => setOverrideDate(e.target.value)}
            className="flex-1 min-w-[150px]"
            placeholder="YYYY-MM-DD"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSetOverride}
            disabled={!overrideDate.trim()}
          >
            Set Date
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetYesterday}
          >
            Yesterday
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetTomorrow}
          >
            Tomorrow
          </Button>
          {hasOverride && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearOverride}
            >
              Clear
            </Button>
          )}
        </div>

        <p className="text-xs text-yellow-600">
          💡 Tip: Mark a habit complete, then click "Tomorrow" to see it reset. Click "Clear" to return to today.
        </p>
      </div>
    </Card>
  );
};

