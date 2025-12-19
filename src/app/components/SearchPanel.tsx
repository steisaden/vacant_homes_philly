import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

// Common Philly Zips for reference
const SAMPLE_ZIPS = ['19140', '19134', '19121', '19132', '19139'];

interface SearchPanelProps {
  onSearch: (zipCode: string) => void;
  isLoading: boolean;
}

export function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [zipCode, setZipCode] = useState('');
  const availableZips = SAMPLE_ZIPS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim().length === 5) {
      onSearch(zipCode.trim());
    }
  };

  return (
    <div className="border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="decorative-blob float-animation" style={{
        top: '-20px',
        left: '10%',
        width: '150px',
        height: '150px',
        background: 'var(--pastel-blue)',
      }} />
      <div className="decorative-circle" style={{
        top: '10px',
        right: '15%',
        width: '80px',
        height: '80px',
        background: 'var(--pastel-purple)',
      }} />

      <div className="px-6 py-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-semibold">Philadelphia Vacant Property Finder</h1>
            <p className="text-sm text-muted-foreground">Search municipal vacancy data by ZIP code</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="neomorph hover:neomorph-hover">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="neomorph composite-layer">
              <DialogHeader>
                <DialogTitle>About This Tool</DialogTitle>
                <DialogDescription className="space-y-3 pt-2">
                  <p>
                    This application transforms raw municipal GIS data into an accessible vacancy lookup tool,
                    consuming official City of Philadelphia Vacant Property Indicator datasets.
                  </p>
                  <p>
                    <strong>Available ZIP Codes:</strong> {availableZips.join(', ')}
                  </p>
                  <div className="text-xs space-y-2">
                    <p>
                      Data sourced live from City of Philadelphia Open Data (Vacant Property Indicators - Buildings) via ArcGIS REST API.
                    </p>

                    <div className="border-t pt-2 mt-2">
                      <h4 className="font-semibold text-sm mb-1">Usage Policy</h4>
                      <p className="text-muted-foreground">
                        This tool is provided &quot;as is&quot; for informational purposes only. It is not an official City of Philadelphia application.
                        Do not rely on this data for legal or commercial decisions without independent verification.
                        Excessive automated scraping is prohibited and may result in IP blocking.
                      </p>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter ZIP code (e.g., 19140)"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
            maxLength={5}
            className="max-w-xs neomorph-inset"
          />
          <Button type="submit" disabled={isLoading || zipCode.length !== 5} className="neomorph hover:neomorph-hover text-foreground font-medium">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>
    </div >
  );
}