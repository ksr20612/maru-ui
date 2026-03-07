import { createContext, useContext } from 'react';
import type { PickerViewOptionContextValue } from './types';

export const PickerViewOptionContext = createContext<PickerViewOptionContextValue | null>(null);

export function usePickerViewOptionContext(strict = true): PickerViewOptionContextValue | null {
  const value = useContext(PickerViewOptionContext);

  if (strict && value == null) {
    throw new Error(
      'usePickerViewOptionContext must be used within PickerView (as a PickerViewOption child)',
    );
  }

  return value;
}
