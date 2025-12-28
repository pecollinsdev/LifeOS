import React from 'react';
import { Card, PageHeader } from '@/shared/components';

export interface PlaceholderPageProps {
  title: string;
  description: string;
}

/**
 * PlaceholderPage component for features not yet implemented.
 * 
 * Provides consistent UI for scaffolded features that will
 * be implemented following the Tasks pattern.
 */
export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-safe-bottom">
      <PageHeader title={title} showBack />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">{description}</p>
            <p className="text-sm text-gray-500">
              This feature will be implemented following the Tasks module pattern.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

