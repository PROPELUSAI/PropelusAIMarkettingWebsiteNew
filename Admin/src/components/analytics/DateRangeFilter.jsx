/**
 * DateRangeFilter — Preset and custom date range selector.
 * Presets: Last 7 / 14 / 30 / 90 days, This Month, Last Month.
 * Custom mode shows two date inputs. Fires onDateChange(start, end)
 * to update all sibling analytics reports.
 */
import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const DateRangeFilter = ({ onDateChange }) => {
  const [preset, setPreset] = useState('last7days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const presets = {
    today: { label: 'Today', start: new Date(), end: new Date() },
    yesterday: { label: 'Yesterday', start: subDays(new Date(), 1), end: subDays(new Date(), 1) },
    last7days: { label: 'Last 7 Days', start: subDays(new Date(), 7), end: new Date() },
    last30days: { label: 'Last 30 Days', start: subDays(new Date(), 30), end: new Date() },
    thisMonth: { label: 'This Month', start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
    lastMonth: { 
      label: 'Last Month', 
      start: startOfMonth(subMonths(new Date(), 1)), 
      end: endOfMonth(subMonths(new Date(), 1)) 
    },
    last90days: { label: 'Last 90 Days', start: subDays(new Date(), 90), end: new Date() },
  };

  const handlePresetChange = (presetKey) => {
    setPreset(presetKey);
    if (presetKey !== 'custom') {
      const { start, end } = presets[presetKey];
      onDateChange(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'));
    }
  };

  const handleCustomDateChange = () => {
    if (customStart && customEnd) {
      onDateChange(customStart, customEnd);
    }
  };

  return (
    <div className="date-range-filter">
      <div className="preset-buttons">
        {Object.entries(presets).map(([key, { label }]) => (
          <button
            key={key}
            className={`preset-btn ${preset === key ? 'active' : ''}`}
            onClick={() => handlePresetChange(key)}
          >
            {label}
          </button>
        ))}
        <button
          className={`preset-btn ${preset === 'custom' ? 'active' : ''}`}
          onClick={() => setPreset('custom')}
        >
          Custom
        </button>
      </div>

      {preset === 'custom' && (
        <div className="custom-date-inputs">
          <div className="date-input-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              max={customEnd || format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          <div className="date-input-group">
            <label>End Date:</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              min={customStart}
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          <button 
            className="apply-btn" 
            onClick={handleCustomDateChange}
            disabled={!customStart || !customEnd}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
