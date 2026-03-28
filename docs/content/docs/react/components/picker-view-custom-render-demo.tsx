'use client';

import type { PickerViewOptionProps } from '@maru-ui/picker-view';
import { PickerView, PickerViewOption } from '@maru-ui/picker-view';
import '@maru-ui/picker-view/styles';
import { useState } from 'react';

/** Storybook `CustomRender` 스토리와 동일 (`renderOption`, `itemHeight: 100`, 24개 옵션). */
export function PickerViewCustomRenderDemo() {
  const [value, setValue] = useState(8);

  return (
    <div className="not-prose flex w-full flex-col items-center bg-white py-4">
      <PickerView
        value={value}
        onChange={setValue}
        itemHeight={100}
        renderOption={(props: PickerViewOptionProps, isSelected: boolean) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: isSelected ? 'red' : 'unset',
            }}
          >
            <span>{isSelected ? '🔥' : ''}</span>
            {props.value.toString().padStart(2, '0')}:00
          </div>
        )}
      >
        {Array.from({ length: 24 }, (_, i) => (
          <PickerViewOption key={i} value={i} id={`option-${i}`} />
        ))}
      </PickerView>
    </div>
  );
}
