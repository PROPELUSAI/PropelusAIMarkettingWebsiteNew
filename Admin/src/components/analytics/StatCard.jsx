/**
 * StatCard — Single KPI card with title, value, optional change indicator,
 * and an icon. Shows a skeleton loader when data is still fetching.
 * Positive changes render green ▲, negative render red ▼.
 */
export const StatCard = ({ title, value, change, icon, loading = false }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  if (loading) {
    return (
      <div className="stat-card skeleton">
        <div className="skeleton-text"></div>
        <div className="skeleton-value"></div>
      </div>
    );
  }

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {change !== undefined && (
        <div className={`stat-card-change ${isPositive ? 'positive' : isNegative ? 'negative' : ''}`}>
          {isPositive && '↑'} {isNegative && '↓'} {Math.abs(change)}%
        </div>
      )}
    </div>
  );
};
