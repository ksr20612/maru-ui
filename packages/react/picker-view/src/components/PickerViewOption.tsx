import type { HTMLAttributes } from 'react';
import { usePickerViewOptionContext } from '../hook/PickerViewOptionContext';

export interface PickerViewOptionProps extends HTMLAttributes<HTMLDivElement> {
  /** 옵션 값 */
  value: number;
}

export default function PickerViewOption({ children, ...props }: PickerViewOptionProps) {
  const optionContext = usePickerViewOptionContext(false);
  const { optionProps = {}, content } = optionContext ?? {};

  return (
    <div {...props} {...optionProps}>
      {content ?? children}
    </div>
  );
}
