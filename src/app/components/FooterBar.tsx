import { useState } from 'react';
import { Database, Clock } from 'lucide-react';
import { getDataSourceInfo } from '../utils/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';

export function FooterBar() {
  const dataSource = getDataSourceInfo();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t gradient-overlay-purple relative overflow-hidden">
      <div className="decorative-circle" style={{
        bottom: '-20px',
        right: '20%',
        width: '70px',
        height: '70px',
        background: 'var(--pastel-blue)',
      }} />
      
      <div className="px-6 py-3 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" />
            <span>City of Philadelphia Open Data</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated: {new Date(dataSource.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
              Data Source Info
            </Button>
          </DialogTrigger>
          <DialogContent className="neomorph composite-layer">
            <DialogHeader>
              <DialogTitle>Data Source Information</DialogTitle>
              <DialogDescription className="space-y-3 pt-2">
                <div>
                  <div className="font-medium text-foreground mb-1">Source</div>
                  <div>{dataSource.source}</div>
                </div>
                <div>
                  <div className="font-medium text-foreground mb-1">API Endpoint</div>
                  <div className="font-mono text-xs break-all neomorph-inset p-2 rounded">
                    {dataSource.endpoint}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-foreground mb-1">Last Updated</div>
                  <div>{new Date(dataSource.lastUpdated).toLocaleString()}</div>
                </div>
                <div className="pt-2 border-t text-xs space-y-2">
                  <p>
                    This application pulls live municipal GIS data and presents it for researchers, housing advocates, and real-estate professionals. It is not an official City of Philadelphia application; always verify critical information independently.
                  </p>
                  <p className="text-muted-foreground">
                    Please avoid excessive automated scraping; upstream limits may block abusive traffic.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
