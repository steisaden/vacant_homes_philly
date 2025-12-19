import { useState, useMemo } from 'react';
import { VacantRow } from '@/types/vacant';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Download, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface ResultsPanelProps {
  properties: VacantRow[];
  zipCode: string;
  onExportCSV: () => void;
}

const ITEMS_PER_PAGE = 6;

export function ResultsPanel({ properties, zipCode, onExportCSV }: ResultsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<VacantRow | null>(null);

  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);

  const currentProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return properties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [properties, currentPage]);

  const getVacancyColor = (indicator: string) => {
    const lower = indicator.toLowerCase();
    if (lower.includes('likely')) return 'destructive';
    if (lower.includes('possibly')) return 'secondary';
    return 'default';
  };

  if (properties.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">No vacant properties found</p>
          <p className="text-sm">Try searching a different ZIP code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Results header */}
      <div className="px-6 py-4 border-b gradient-overlay-purple flex items-center justify-between relative">
        <div className="decorative-circle float-animation" style={{
          top: '-10px',
          left: '5%',
          width: '60px',
          height: '60px',
          background: 'var(--pastel-peach)',
        }} />

        <div className="relative z-10">
          <h2 className="font-semibold">Results for ZIP {zipCode}</h2>
          <p className="text-sm text-muted-foreground">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>
        <Button onClick={onExportCSV} variant="outline" size="sm" className="neomorph hover:neomorph-hover relative z-10">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Results grid - fixed height, no scroll */}
      <div className="flex-1 px-6 py-4 relative">
        <div className="decorative-blob" style={{
          top: '20%',
          right: '5%',
          width: '200px',
          height: '200px',
          background: 'var(--pastel-green)',
        }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full relative z-10">
          {currentProperties.map((property, idx) => (
            <div
              key={`${property.opaAccount}-${idx}`}
              className="neomorph hover:neomorph-hover cursor-pointer transition-all bg-card flex flex-col justify-between composite-layer composite-accent p-4"
              onClick={() => setSelectedProperty(property)}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-medium line-clamp-1">{property.address}</h3>
                  <Badge variant={getVacancyColor(property.indicator)} className={`shrink-0 text-xs ${property.indicator.toLowerCase().includes('likely') ? 'badge-pastel-peach' : 'badge-pastel-blue'
                    }`}>
                    {property.indicator.replace(' Vacant', '')}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">OPA Account:</span>
                    <span className="font-mono text-xs">{property.opaAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{property.propertyType || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                Updated: {new Date(property.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between gradient-overlay-blue">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="neomorph hover:neomorph-hover"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="neomorph hover:neomorph-hover"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Property detail modal */}
      <Dialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        <DialogContent className="neomorph composite-layer">
          <DialogHeader>
            <DialogTitle className="flex items-start gap-2">
              <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
              {selectedProperty?.address}
            </DialogTitle>
            <DialogDescription>
              Detailed property information
            </DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={getVacancyColor(selectedProperty.indicator)} className={
                  selectedProperty.indicator.toLowerCase().includes('likely') ? 'badge-pastel-peach' : 'badge-pastel-blue'
                }>
                  {selectedProperty.indicator}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">OPA Account</div>
                  <div className="font-mono">{selectedProperty.opaAccount}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">ZIP Code</div>
                  <div>{selectedProperty.zipcode}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Property Type</div>
                  <div>{selectedProperty.propertyType || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Last Inspection</div>
                  <div>{selectedProperty.lastInspection ? new Date(selectedProperty.lastInspection).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground mb-1">Owner Name</div>
                  <div>{selectedProperty.ownerName || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Latitude</div>
                  <div className="font-mono text-xs">{selectedProperty.lat.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Longitude</div>
                  <div className="font-mono text-xs">{selectedProperty.lon.toFixed(4)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}