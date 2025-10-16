import React from 'react'

export default function FormButton({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-white bg-primary hover:opacity-95 shadow ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
