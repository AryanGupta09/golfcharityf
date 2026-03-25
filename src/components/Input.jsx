import clsx from 'clsx'

export default function Input({ label, error, required = false, className, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {label}{required && <span className="text-coral-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-3 min-h-[44px] rounded-xl',
          'bg-gray-50 dark:bg-dark-700',
          'border border-gray-200 dark:border-dark-600',
          'text-gray-900 dark:text-white text-sm',
          'placeholder-gray-400 dark:placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent',
          'transition-all duration-200',
          error && 'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  )
}
