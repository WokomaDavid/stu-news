import React from 'react'

export default function FormInput({ label, className = '', ...props }) {
  return (
    <label className={`block text-sm ${props.required ? 'after:content-["*"] after:ml-1 after:text-red-500' : ''}`}>
      {label && <span className="block text-gray-700 dark:text-gray-200 mb-1">{label}</span>}
      <input
        className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...props}
      />
    </label>
  )
}
