const Logo = ({ className = 'h-8 w-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0" stopColor="#2563eb" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#g)" />
    <path d="M6 12h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
  </svg>
)

export default Logo
