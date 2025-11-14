'use client';

import * as React from 'react';

import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Option from '@mui/joy/Option';
import type { SelectProps } from '@mui/joy/Select';
import Select from '@mui/joy/Select';

export interface SelectOption {
  value: string | number;
  label: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SelectComponentProps<T extends {} = string | number>
  extends Omit<SelectProps<T, false>, 'onChange'> {
  label?: string;
  options?: SelectOption[];
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  storageKey?: string;
  onChange?: (event: React.SyntheticEvent | null, value: T | null) => void;
}

export function SelectComponent({
  label,
  options = [],
  helperText,
  error = false,
  fullWidth = false,
  variant = 'outlined',
  storageKey,
  color = 'primary',
  size = 'md',
  startDecorator,
  endDecorator,
  onChange,
  ...props
}: SelectComponentProps): React.ReactElement {
  const getInitialValue = React.useCallback(() => {
    if (storageKey && globalThis.window !== undefined) {
      const saved = localStorage.getItem(storageKey);
      if (saved) return saved;
    }
    return props.value || null;
  }, [storageKey, props.value]);

  const [value, setValue] = React.useState(getInitialValue);

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | number | null
  ) => {
    setValue(newValue);

    if (storageKey && globalThis.window !== undefined && newValue) {
      localStorage.setItem(storageKey, String(newValue));
    }

    if (onChange) {
      onChange(event, newValue);
    }
  };

  return (
    <FormControl error={error} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && <FormLabel>{label}</FormLabel>}
      <Select
        variant={variant}
        color={color}
        size={size}
        startDecorator={startDecorator}
        endDecorator={endDecorator}
        {...props}
        value={storageKey ? value : props.value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
