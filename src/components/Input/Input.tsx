import { TextField } from '@mui/material';
import React, { HTMLInputTypeAttribute } from 'react';
import {
  Controller,
  FieldError,
  FieldValues,
  UseControllerProps
} from 'react-hook-form';

type ControlledInputProps<T extends FieldValues> = UseControllerProps<T> &
  InputProps;

type InputProps = {
  errorText?: FieldError;
  label?: string;
  textType?: HTMLInputTypeAttribute;
};

export const Input: React.FC<InputProps> = ({
  errorText,
  label,
  textType = 'text',
  ...rest
}) => {
  return (
    <div style={{ width: '100%' }}>
      <TextField
        {...rest}
        error={errorText ? true : false}
        label={label}
        helperText={errorText && errorText.message}
        type={textType}
        fullWidth
      />
    </div>
  );
};

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  ...rest
}: ControlledInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input {...field} {...rest} errorText={fieldState.error} />
      )}
    />
  );
};
