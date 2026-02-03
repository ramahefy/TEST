import React from 'react'

export default function Icon({ name, size = 16 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }
  switch (name) {
    case 'mail':
      return (
        <svg {...common} aria-hidden>
          <path d="M3 5h18v14H3V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'lock':
      return (
        <svg {...common} aria-hidden>
          <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'login':
      return (
        <svg {...common} aria-hidden>
          <path d="M15 3h6v18h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 8l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'edit':
      return (
        <svg {...common} aria-hidden>
          <path d="M3 21v-3l11-11 3 3L6 21H3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'trash':
      return (
        <svg {...common} aria-hidden>
          <path d="M3 6h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'reset':
      return (
        <svg {...common} aria-hidden>
          <path d="M21 12a9 9 0 10-2.6 6.1L21 21v-9h-9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'user':
      return (
        <svg {...common} aria-hidden>
          <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'toggle-on':
      return (
        <svg {...common} aria-hidden>
          <rect x="2" y="7" width="20" height="10" rx="5" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="16" cy="12" r="3" fill="currentColor"/>
        </svg>
      )
    case 'toggle-off':
      return (
        <svg {...common} aria-hidden>
          <rect x="2" y="7" width="20" height="10" rx="5" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="8" cy="12" r="3" fill="currentColor"/>
        </svg>
      )
    case 'plus':
      return (
        <svg {...common} aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'refresh':
      return (
        <svg {...common} aria-hidden>
          <path d="M21 12a9 9 0 10-2.6 6.1L21 21v-9h-9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'menu':
      return (
        <svg {...common} aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'logout':
      return (
        <svg {...common} aria-hidden>
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'key':
      return (
        <svg {...common} aria-hidden>
          <path d="M21 2v6l-9 9-4 1 1-4 9-9h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return null
  }
}
