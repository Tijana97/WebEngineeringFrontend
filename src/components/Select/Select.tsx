import React from 'react';
import {
  Controller,
  FieldError,
  FieldValues,
  UseControllerProps
} from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

type ControlledSelectProps<T extends FieldValues> = UseControllerProps<T> &
  SelectProps;

type SelectProps = {
  label?: string;
  options: { label: string; value: string | number }[];
  errorText?: FieldError;
};

const CustomSelect: React.FC<SelectProps> = ({
  label,
  options,
  errorText,
  ...rest
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="label">{label}</InputLabel>
      <Select
        label={label}
        {...rest}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: errorText?.message && 'red'
          }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <span
        style={{
          color: 'red',
          fontSize: '12px',
          lineHeight: '12px',
          height: '12px'
        }}
      >
        {errorText?.message ?? ''}
      </span>
    </FormControl>
  );
};

export const ControlledSelect = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  ...rest
}: ControlledSelectProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ...rest }, fieldState }) => (
        <CustomSelect
          label={label}
          options={options}
          errorText={fieldState.error}
          {...rest}
        />
      )}
    />
  );
};
