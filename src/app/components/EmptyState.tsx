import { Search } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center relative">
      {/* Decorative elements */}
      <div className="decorative-blob float-animation" style={{
        top: '10%',
        left: '10%',
        width: '180px',
        height: '180px',
        background: 'var(--pastel-purple)',
      }} />
      <div className="decorative-circle" style={{
        bottom: '15%',
        right: '12%',
        width: '120px',
        height: '120px',
        background: 'var(--pastel-pink)',
      }} />
      
      <div className="text-center max-w-md px-6 relative z-10">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full neomorph p-6 composite-accent">
            <Search className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">No Search Yet</h2>
        <p className="text-muted-foreground mb-6">
          Enter a Philadelphia ZIP code above to search for vacant properties in that area.
        </p>
        <div className="neomorph rounded-lg p-4 text-sm text-left composite-layer">
          <div className="font-medium mb-2">Try these ZIP codes:</div>
          <div className="space-y-1">
            <div><span className="font-mono badge-pastel-purple px-2 py-1 rounded">19140</span> — North Philadelphia</div>
            <div><span className="font-mono badge-pastel-blue px-2 py-1 rounded">19134</span> — Kensington</div>
            <div><span className="font-mono badge-pastel-green px-2 py-1 rounded">19121</span> — Strawberry Mansion</div>
            <div><span className="font-mono badge-pastel-peach px-2 py-1 rounded">19132</span> — Nicetown</div>
            <div><span className="font-mono badge-pastel-pink px-2 py-1 rounded">19139</span> — West Philadelphia</div>
          </div>
        </div>
      </div>
    </div>
  );
}