'use client';

import { useState, useEffect, useCallback } from 'react';

interface EmbeddedCalendarProps {
  /** The current ISO string value */
  value?: string;
  /** Called with an ISO string when selection changes */
  onChange?: (value: string) => void;
  /** Show validation error */
  error?: string;
  /** Label text */
  label?: string;
  /** Required field */
  required?: boolean;
  /** Compact mode — shorter time list, smaller overall footprint (for popups) */
  compact?: boolean;
  /** Whether the control is disabled */
  disabled?: boolean;
}

interface TimeSlot {
  hour: number;
  minute: number;
  display: string;
  value: string;
}

export default function EmbeddedCalendar({
  value,
  onChange,
  error,
  label = 'Preferred Date & Time',
  required = false,
  compact = false,
  disabled = false,
}: EmbeddedCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [minDateTime, setMinDateTime] = useState<Date>(new Date());

  // Business-hours time slots: 09:00 – 21:30, 30-min intervals
  const timeSlots: TimeSlot[] = (() => {
    const slots: TimeSlot[] = [];
    const start = 9;
    const end = 22;
    for (let h = start; h < end; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
        slots.push({
          hour: h,
          minute: m,
          display: `${displayH}:${mm} ${period}`,
          value: `${hh}:${mm}`,
        });
      }
    }
    return slots;
  })();

  // Min date = 24 h from now
  useEffect(() => {
    const tick = () => setMinDateTime(new Date(Date.now() + 24 * 60 * 60 * 1000));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Hydrate from prop
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setCurrentMonth(d);
        setSelectedTime(
          `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
        );
      }
    }
  }, [value]);

  const emitValue = useCallback(
    (date: Date, time: string) => {
      if (!date || !time || !onChange) return;
      const [hh, mm] = time.split(':').map(Number);
      const copy = new Date(date);
      copy.setHours(hh, mm, 0, 0);
      onChange(copy.toISOString());
    },
    [onChange],
  );

  const handleDateSelect = (d: Date) => {
    setSelectedDate(d);
    emitValue(d, selectedTime);
  };

  const handleTimeSelect = (t: string) => {
    setSelectedTime(t);
    if (selectedDate) emitValue(selectedDate, t);
  };

  /* -------- Calendar helpers -------- */

  const isDateDisabled = (d: Date): boolean => {
    const ref = new Date();
    ref.setHours(0, 0, 0, 0);
    const check = new Date(d);
    check.setHours(0, 0, 0, 0);
    return check < ref;
  };

  const isTimeDisabled = (slot: TimeSlot): boolean => {
    if (!selectedDate) return false;
    const test = new Date(selectedDate);
    test.setHours(slot.hour, slot.minute, 0, 0);
    return test < minDateTime;
  };

  const getDaysInMonth = (ref: Date): (Date | null)[] => {
    const y = ref.getFullYear();
    const m = ref.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < first.getDay(); i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(y, m, d));
    return days;
  };

  const navigateMonth = (dir: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const n = new Date(prev);
      n.setMonth(n.getMonth() + (dir === 'next' ? 1 : -1));
      return n;
    });
  };

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const days = getDaysInMonth(currentMonth);

  /* -------- Render -------- */

  const calHeight = compact ? 'max-h-[200px]' : 'max-h-[280px]';

  return (
    <div className="embedded-calendar-new">
      {label && (
        <label className="block text-sm font-medium text-surface-600 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div
        className={`rounded-lg border ${
          error ? 'border-red-400' : 'border-[var(--border-light)]'
        } bg-[var(--bg-light)] transition focus-within:border-[var(--brand)] focus-within:shadow-[0_0_0_3px_rgba(99,91,255,0.1)] ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <div className={`flex ${compact ? 'flex-col sm:flex-row' : 'flex-col md:flex-row'}`}>
          {/* ── Date grid ── */}
          <div className={`${compact ? 'sm:w-[62%]' : 'md:w-[65%]'} p-3`}>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => navigateMonth('prev')}
                className="p-1 rounded hover:bg-[var(--bg-warm)] transition-colors"
                disabled={disabled}
              >
                <svg className="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {monthNames[currentMonth.getMonth()].slice(0, 3)} {currentMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className="p-1 rounded hover:bg-[var(--bg-warm)] transition-colors"
                disabled={disabled}
              >
                <svg className="w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day header */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {dayNames.map((d, i) => (
                <div key={i} className="text-center text-[0.65rem] font-medium text-surface-400 select-none">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day, idx) => {
                if (!day) return <div key={idx} />;
                const off = isDateDisabled(day);
                const sel =
                  selectedDate &&
                  day.toDateString() === selectedDate.toDateString();
                const today =
                  day.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={off || disabled}
                    onClick={() => handleDateSelect(day)}
                    className={`
                      ${compact ? 'h-7 text-xs' : 'h-9 text-sm'}
                      w-full rounded-md flex items-center justify-center transition-all
                      ${off ? 'text-surface-300 line-through cursor-not-allowed' : ''}
                      ${sel ? 'bg-brand-500 text-white font-semibold shadow-sm' : ''}
                      ${today && !sel ? 'bg-brand-50 text-brand-600 font-semibold' : ''}
                      ${!off && !sel && !today ? 'text-[var(--text-primary)] hover:bg-brand-50' : ''}
                    `}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Time column ── */}
          <div
            className={`${
              compact ? 'sm:w-[38%] border-t sm:border-t-0 sm:border-l' : 'md:w-[35%] border-t md:border-t-0 md:border-l'
            } border-[var(--border-light)] p-3`}
          >
            <p className="text-xs font-semibold text-surface-500 mb-2 tracking-wide uppercase">
              Time
            </p>
            <div className={`${calHeight} overflow-y-auto pr-1 cal-time-scroll space-y-1`}>
              {timeSlots.map((slot) => {
                const off = isTimeDisabled(slot);
                const sel = selectedTime === slot.value;
                return (
                  <button
                    key={slot.value}
                    type="button"
                    disabled={off || disabled}
                    onClick={() => handleTimeSelect(slot.value)}
                    className={`
                      w-full ${compact ? 'py-1 text-xs' : 'py-1.5 text-sm'}
                      rounded-md font-medium transition-all
                      ${off ? 'text-surface-300 line-through cursor-not-allowed' : ''}
                      ${sel ? 'bg-brand-500 text-white shadow-sm' : ''}
                      ${!off && !sel ? 'text-[var(--text-primary)] hover:bg-brand-50 border border-transparent hover:border-brand-200' : ''}
                    `}
                  >
                    {slot.display}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Selected summary ── */}
        {selectedDate && selectedTime && (
          <div className="border-t border-[var(--border-light)] px-3 py-2 bg-brand-50/40 flex items-center gap-2 rounded-b-lg">
            <svg className="w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-brand-700 font-medium">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              at{' '}
              {timeSlots.find((s) => s.value === selectedTime)?.display || selectedTime}
            </span>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      <p className="mt-1 text-xs text-surface-400">
        Select a date & time at least 24 hours from now
      </p>
    </div>
  );
}
