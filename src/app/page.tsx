"use client";

import { useState } from 'react';
import { SearchPanel } from './components/SearchPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { EmptyState } from './components/EmptyState';
import { FooterBar } from './components/FooterBar';
import { VacantRow } from '@/types/vacant';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

export default function Home() {
  const [properties, setProperties] = useState<VacantRow[]>([]);
  const [searchedZip, setSearchedZip] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (zipCode: string) => {
    setIsLoading(true);
    setSearchedZip(zipCode);

    try {
      const res = await fetch(`/api/vacant?zip=${zipCode}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Search failed");
      }

      const data = await res.json();
      const results = data.rows || [];

      setProperties(results);

      if (results.length === 0) {
        toast.info(`No vacant properties found in ZIP ${zipCode}`);
      } else {
        toast.success(`Found ${results.length} vacant properties`);
      }
    } catch (error) {
      toast.error("Failed to fetch property data. Please try again.");
      console.error(error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (properties.length === 0) return;

    const headers = [
      'Address',
      'ZIP Code',
      'OPA Account',
      'Indicator',
      'Last Updated',
      'Owner',
      'Type',
      'Latitude',
      'Longitude'
    ];

    const rows = properties.map(p => [
      p.address,
      p.zipcode,
      p.opaAccount,
      p.indicator,
      p.lastUpdated,
      p.ownerName || '',
      p.propertyType || '',
      p.lat?.toString() || '',
      p.lon?.toString() || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vacant_properties_${searchedZip}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('CSV exported successfully');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Composite background layers */}
      <div className="decorative-blob" style={{
        position: 'fixed',
        top: '30%',
        left: '-5%',
        width: '300px',
        height: '300px',
        background: 'var(--pastel-purple)',
        zIndex: 0,
      }} />
      <div className="decorative-blob" style={{
        position: 'fixed',
        bottom: '20%',
        right: '-5%',
        width: '250px',
        height: '250px',
        background: 'var(--pastel-blue)',
        zIndex: 0,
        animationDelay: '2s',
      }} />

      <div className="relative z-10 h-full flex flex-col">
        <Toaster />

        <SearchPanel onSearch={handleSearch} isLoading={isLoading} />

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="neomorph rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
              <p className="text-muted-foreground">Searching properties...</p>
            </div>
          </div>
        ) : searchedZip ? (
          <ResultsPanel
            properties={properties}
            zipCode={searchedZip}
            onExportCSV={handleExportCSV}
          />
        ) : (
          <EmptyState />
        )}

        <FooterBar />
      </div>
    </div>
  );
}
