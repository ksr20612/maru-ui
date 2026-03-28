'use client';

import { PickerView, PickerViewOption } from '@maru-ui/picker-view';
import '@maru-ui/picker-view/styles';
import { useState } from 'react';

export function PickerViewBasicDemo() {
  const [value, setValue] = useState(1);

  return (
    <div className="not-prose flex justify-center py-4 w-full bg-white">
      <PickerView value={value} onChange={setValue}>
        <PickerViewOption value={1}>1</PickerViewOption>
        <PickerViewOption value={2}>2</PickerViewOption>
        <PickerViewOption value={3}>3</PickerViewOption>
        <PickerViewOption value={4}>4</PickerViewOption>
        <PickerViewOption value={5}>5</PickerViewOption>
        <PickerViewOption value={6}>6</PickerViewOption>
        <PickerViewOption value={7}>7</PickerViewOption>
        <PickerViewOption value={8}>8</PickerViewOption>
        <PickerViewOption value={9}>9</PickerViewOption>
        <PickerViewOption value={10}>10</PickerViewOption>
      </PickerView>
    </div>
  );
}
