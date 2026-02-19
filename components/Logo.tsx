export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 192 40"
      role="img"
      aria-label="Cedewise Direct"
      className={className}
    >
      <defs>
        <linearGradient id="cd-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <g>
        <circle cx="20" cy="20" r="12" fill="url(#cd-grad)" />
        <path d="M18 20h4M20 18v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g fill="currentColor">
        <text x="40" y="25" fontFamily="Inter, ui-sans-serif, system-ui, Arial" fontSize="16" fontWeight="600">
          Cedewise Direct
        </text>
      </g>
    </svg>
  );
}

