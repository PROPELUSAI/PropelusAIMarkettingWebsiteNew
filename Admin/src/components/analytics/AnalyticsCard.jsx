/**
 * AnalyticsCard — Reusable wrapper card for analytics widgets.
 * Renders an optional title and a content area. Used by every
 * analytics sub-report to maintain consistent styling.
 */
export const AnalyticsCard = ({ title, children, className = '' }) => {
  return (
    <div className={`analytics-card ${className}`}>
      {title && <h3 className="analytics-card-title">{title}</h3>}
      <div className="analytics-card-content">{children}</div>
    </div>
  );
};
