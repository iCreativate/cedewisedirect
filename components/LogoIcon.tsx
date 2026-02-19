export default function LogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      role="img"
      aria-label="Cedewise Direct"
      className={className}
    >
      <defs>
        <linearGradient id="cd-grad-icon" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="16" fill="url(#cd-grad-icon)" />
      <path d="M18 20h4M20 18v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

