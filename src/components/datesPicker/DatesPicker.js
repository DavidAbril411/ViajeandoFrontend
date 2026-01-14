import styled from '@emotion/styled';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const DatesPicker = ({ startDate, endDate, setStartDate, setEndDate }) => {

  const noches =
    startDate && endDate ? Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)) : 0;

  const onChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      setStartDate(start ?? undefined);
      setEndDate(end ?? undefined);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const Calendar = styled.div`
    border-radius: 10px;
    box-shadow: 0px 4px 4px 0px #00000020;
    border: 1px solid #e5e5e5;
    overflow: hidden;
    width: 242px;
    background-color: #fef7ff;
  `;

  const Popper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  `;

  const CustomMonthContainer = styled.div`
    .react-datepicker__header {
      background-color: #fef7ff;
      border-bottom: 0px;
    }

    .react-datepicker__current-month {
      font-family: Roboto;
      font-size: 12px;
      font-weight: 400;
      line-height: 14.06px;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: #2E9BC6;
      margin-bottom: 10px;
    }

    .react-datepicker__navigation-icon::before {
      border-color: rgba(76, 79, 80, 1);
      border-style: solid;
      border-width: 2px 2px 0 0;
    }

    .react-datepicker__day-names {
      margin-bottom: -8px;
    }

    .react-datepicker__day-name,
    .react-datepicker__day,
    .react-datepicker__time-name {
      margin: 0;
      font-weight: 500;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      width: 32.5px;
      height: 32.5px;
      padding-top: 3px;
      color: rgba(76, 79, 80, 0.7);
      font-family: var(--font-inter);
      font-size: 12px;
      position: relative;
      border-radius: 50%;
    }

    .react-datepicker__day--keyboard-selected,
    .react-datepicker__month-text--keyboard-selected,
    .react-datepicker__quarter-text--keyboard-selected,
    .react-datepicker__year-text--keyboard-selected {
      background-color: #2E9BC450;
    }

    .react-datepicker__day--in-range {
      background-color: transparent;
      position: relative;
    }

    .react-datepicker__day--in-selecting-range {
      background-color: transparent;
    }

    .react-datepicker__day--selected,
    .react-datepicker__month-text--in-selecting-range,
    .react-datepicker__month-text--in-range,
    .react-datepicker__quarter-text--selected,
    .react-datepicker__quarter-text--in-selecting-range,
    .react-datepicker__quarter-text--in-range,
    .react-datepicker__year-text--selected,
    .react-datepicker__year-text--in-selecting-range,
    .react-datepicker__year-text--in-range,
    .react-datepicker__day.react-datepicker__day--range-end,
    .react-datepicker__day:hover {
      background-color: #2E9BC6;
      color: white;
      border-radius: 50%;
      z-index: 2;
    }

    .react-datepicker__day--in-selecting-range::before,
    .react-datepicker__day--in-range::before {
      content: '';
      position: absolute;
      top: calc(50% - 10.5px);
      left: 0;
      width: 100%;
      height: 21px;
      background-color: #d9d9d96b;
      z-index: 0;
      border-radius: 0;
    }

    .react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-start::before,
    .react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-end::before,
    .react-datepicker__day--in-range.react-datepicker__day--range-start::before,
    .react-datepicker__day--in-range.react-datepicker__day--range-end::before {
      display: none;
    }

    .react-datepicker__day--in-selecting-range:not([aria-disabled=true]):hover{
    background-color: #2E9BC6;
    }
}
  `;

  const DatePickerWrapper = styled(
    ({
      className,
      popperContainer: Popper,
      calendarContainer: Calendar,
      ...props
    }) => (
      <CustomMonthContainer>
        <DatePicker
          {...props}
          wrapperClassName={className}
          popperContainer={Popper}
          calendarContainer={Calendar}
        />
      </CustomMonthContainer>
    ),
  )`
    width: 100%;
  `;
  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col items-center">
        <DatePickerWrapper
          popperContainer={Popper}
          calendarContainer={Calendar}
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
        <p className="text-[#2E9BC6] text-[16px]">
          {noches} noches
        </p>
      </div>
    </div>
  );
};

export default DatesPicker;
