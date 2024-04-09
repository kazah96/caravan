export function MapSkeleton() {
  return (
    <div
      className="track__mapValues d-flex text-center bg-white border-bottom border-5 align-items-center justify-content-center"
      style={{ position: 'relative' }}
    >
      <div className="skeleton" />
    </div>
  );
}

export function SegmentsSkeleton() {
  return (
    <div
      className="d-flex text-center bg-white border-bottom border-5 align-items-center justify-content-center mb-4"
      style={{ height: 71, position: 'relative' }}
    >
      <div className="skeleton" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div
      className="d-flex text-center bg-white border-bottom border-5 align-items-center justify-content-center"
      style={{ height: 500, position: 'relative' }}
    >
      <div className="skeleton" />
    </div>
  );
}
