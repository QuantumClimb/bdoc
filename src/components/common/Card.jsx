/**
 * Common Card Component
 * Reusable card container with optional header and footer
 */

export function Card({
  children,
  header,
  footer,
  className = "",
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${className}`}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          {typeof header === "string" ? (
            <h3 className="text-lg font-semibold text-gray-800">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}
      
      <div className="px-6 py-4">
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {typeof footer === "string" ? (
            <p className="text-sm text-gray-600">{footer}</p>
          ) : (
            footer
          )}
        </div>
      )}
    </div>
  );
}

export default Card;
