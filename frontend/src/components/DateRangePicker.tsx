import React, { useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  placeholderText?: string;
  showIcon?: boolean;
  excludeDates?: Date[];
  excludeDateIntervals?: { start: Date; end: Date }[];
  monthsShown?: number;
  startLabel?: string;
  endLabel?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  minDate = new Date(),
  maxDate,
  disabled = false,
  className = '',
  placeholderText,
  showIcon = true,
  excludeDates,
  excludeDateIntervals,
  monthsShown = 1,
  startLabel,
  endLabel,
}) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  // Default labels if not provided
  const defaultStartLabel = startLabel || t('common.checkIn', 'Check-in');
  const defaultEndLabel = endLabel || t('common.checkOut', 'Check-out');

  // Custom button to open the date picker
  const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={`
          flex items-center justify-between
          w-full px-3 py-2
          bg-white border rounded
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          ${isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'}
          transition-colors
        `}
      >
        <span className={`${!value ? 'text-gray-400' : 'text-gray-700'}`}>
          {value || placeholderText || t('common.selectDates', 'Select dates')}
        </span>
        {showIcon && <FaCalendarAlt className="text-gray-400" />}
      </button>
    )
  );

  CustomInput.displayName = 'DatePickerButton';

  return (
    <div className={`${className}`}>
      {(startLabel || endLabel) && (
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
          <div>{defaultStartLabel}</div>
          <div>{defaultEndLabel}</div>
        </div>
      )}
      
      <ReactDatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(dates) => onChange(dates as [Date | null, Date | null])}
        minDate={minDate}
        maxDate={maxDate}
        monthsShown={monthsShown}
        excludeDates={excludeDates}
        excludeDateIntervals={excludeDateIntervals}
        disabled={disabled}
        onCalendarOpen={() => setIsFocused(true)}
        onCalendarClose={() => setIsFocused(false)}
        customInput={<CustomInput />}
        calendarClassName="shadow-lg border border-gray-200 rounded-lg"
        dateFormat="dd MMM yyyy"
        showPopperArrow={false}
        popperClassName="z-50"
        popperPlacement="bottom-start"
        placeholderText={placeholderText}
        formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
        showDisabledMonthNavigation
      />
    </div>
  );
};

export default DateRangePicker;