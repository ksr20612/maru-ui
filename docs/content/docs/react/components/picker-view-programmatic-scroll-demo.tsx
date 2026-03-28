'use client';

import { PickerView, PickerViewOption } from '@maru-ui/picker-view';
import '@maru-ui/picker-view/styles';
import { useState } from 'react';

/**
 * Storybook CustomRender의 버튼 패턴과 동일:
 * `setValue`로 `value`만 바꿔도 피커가 해당 옵션으로 스크롤합니다.
 */
export function PickerViewProgrammaticScrollDemo() {
  const [value, setValue] = useState(8);

  return (
    <div className="not-prose flex w-full flex-col items-center bg-white py-4">
      <PickerView value={value} onChange={setValue}>
        {Array.from({ length: 24 }, (_, i) => (
          <PickerViewOption key={i} value={i} id={`option-${i}`}>
            {i}
          </PickerViewOption>
        ))}
      </PickerView>
      <button
        type="button"
        onClick={() => setValue(Math.floor(Math.random() * 24))}
        style={{
          marginTop: 16,
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          padding: '10px',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Scroll to Random Value
      </button>
    </div>
  );
}
