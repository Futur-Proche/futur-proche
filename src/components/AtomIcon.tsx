export const AtomIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="16" r="3" fill="hsl(51, 100%, 50%)" />
    <ellipse cx="16" cy="16" rx="14" ry="6" stroke="hsl(51, 100%, 50%)" strokeWidth="1.5" fill="none" />
    <ellipse cx="16" cy="16" rx="14" ry="6" stroke="hsl(51, 100%, 50%)" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)" />
    <ellipse cx="16" cy="16" rx="14" ry="6" stroke="hsl(51, 100%, 50%)" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)" />
  </svg>
);
