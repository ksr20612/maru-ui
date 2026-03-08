import type { ReactElement, ReactNode } from 'react';
import { isValidElement } from 'react';
import type { PickerViewOptionProps } from './PickerViewOption';
import PickerViewOption from './PickerViewOption';

export function isPickerViewOption(child: ReactNode): child is ReactElement<PickerViewOptionProps> {
  return isValidElement(child) && child.type === PickerViewOption;
}
