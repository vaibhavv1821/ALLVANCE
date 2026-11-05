export * from './iconMap';
export * from './uuid';

export function formatDate(timestamp: number | Date | null | undefined): string {
  if (!timestamp) return 'N/A';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function formatTime(timestamp: number | Date | null | undefined): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(d);
}

export function formatLpa(val?: number | null): string {
  if (val === undefined || val === null || isNaN(val)) return 'N/A';
  return `${Number(val).toFixed(val % 1 === 0 ? 0 : 1)} LPA`;
}
