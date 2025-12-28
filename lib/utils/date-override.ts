/**
 * Date override utility for testing day-based features.
 * 
 * This allows simulating different dates for testing purposes
 * without changing the system clock. Only works in development.
 * 
 * Usage:
 * - Set override: setDateOverride('2024-01-15')
 * - Clear override: clearDateOverride()
 * - Get current date (with override): getCurrentDateString()
 */

let dateOverride: string | null = null;

/**
 * Sets a date override for testing.
 * Only works in development mode.
 * 
 * @param dateString - Date in YYYY-MM-DD format
 */
export function setDateOverride(dateString: string): void {
  if (process.env.NODE_ENV === 'development') {
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      throw new Error('Date must be in YYYY-MM-DD format');
    }
    dateOverride = dateString;
    console.log(`[DEV] Date override set to: ${dateString}`);
  }
}

/**
 * Clears the date override.
 */
export function clearDateOverride(): void {
  dateOverride = null;
  console.log('[DEV] Date override cleared');
}

/**
 * Gets the current date string, using override if set.
 * 
 * @returns Date string in YYYY-MM-DD format
 */
export function getCurrentDateString(): string {
  if (dateOverride && process.env.NODE_ENV === 'development') {
    return dateOverride;
  }
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Gets the date override if set, null otherwise.
 */
export function getDateOverride(): string | null {
  return dateOverride;
}

