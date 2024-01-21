import React, { useEffect, useState } from 'react';
import {
  Controller,
  FieldError,
  FieldValues,
  UseControllerProps
} from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type ControlledDatePickerProps<T extends FieldValues> = UseControllerProps<T> &
  Partial<DatePickerProps>;

type DatePickerProps = {
  label?: string;
  errorText?: FieldError;
  onChange: (value: any) => void;
  value: any;
  ref: any;
};

const CustomDatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  errorText,
  ref,
  onChange
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            //   fontFamily: 'InterRegular',
            //   width: '100%',
            //   '& .MuiInputLabel-root.Mui-focused': {
            //     transform: 'translate(14px, -9px) scale(0.9);',
            //     color: errorText?.message ? 'red' : '#009FB7'
            //   },
            //   '& .MuiInputLabel-root': {
            //     transform: 'translate(14px, 9px) scale(1)',
            //     fontSize: '13px'
            //   },
            //   '.MuiInputLabel-shrink': {
            //     transform: 'translate(14px, -9px)scale(0.75);'
            //   },
            //   '.MuiInputAdornment-root': {
            //     transform: 'translateY(6px)'
            //   },
            //   '.MuiOutlinedInput-input': {
            //     transform: 'translateY(8px)',
            //     paddingTop: '0px',
            //     paddingBottom: '0px'
            //   },
            '& .Mui-focused fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: errorText?.message ? 'red' : '#009FB7'
            },
            //   '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            //     border:
            //       !isOpen && !errorText?.message
            //         ? '1px solid #D4D4D4'
            //         : errorText?.message
            //         ? '1px solid red'
            //         : '1px solid #009FB7'
            //   },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              border: errorText?.message ? '1px solid red' : '1px solid #D4D4D4'
            }
          }}
          label={label}
          value={value}
          inputRef={ref}
          onChange={(date) => {
            onChange(date);
          }}
        />
      </LocalizationProvider>
      <span
        style={{
          position: 'absolute',
          bottom: -11,
          left: 0,
          color: 'red',
          fontSize: '12px',
          height: '12px'
        }}
      >
        {errorText?.message ?? ''}
      </span>
    </div>
  );
};

export const ControlledDatePicker = <T extends FieldValues>({
  control,
  name,
  ...rest
}: ControlledDatePickerProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, ref, ...restField },
        fieldState
      }) => (
        <CustomDatePicker
          onChange={onChange}
          value={value}
          ref={ref}
          errorText={fieldState.error}
          {...restField}
          {...rest}
        />
      )}
    />
  );
};
