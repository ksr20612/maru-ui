import type { Meta, StoryObj } from '@storybook/react';
import type { ReactElement, ReactNode } from 'react';
import { Children, isValidElement, useEffect, useState } from 'react';
import PickerView from './PickerView';
import type { PickerViewOptionProps } from './PickerViewOption';
import PickerViewOption from './PickerViewOption';

const meta: Meta<typeof PickerView> = {
  title: 'Components/PickerView',
  component: PickerView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: '현재 선택값 (controlled)',
    },
    itemHeight: {
      control: { type: 'number', min: 32, max: 80 },
      description: '아이템 높이(px)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function PickerViewForStorybook(props: {
  children: ReactNode;
  value?: number;
  onChange: (v: number) => void;
  itemHeight?: number;
  renderOption?: (
    item: { label?: string; value: number; ariaValueText?: string },
    isSelected: boolean,
  ) => ReactNode;
}) {
  const firstOption = Children.toArray(props.children).find(
    (c): c is ReactElement<{ value: number }> =>
      isValidElement(c) && typeof (c.props as { value?: number }).value === 'number',
  );
  const [value, setValue] = useState(props.value ?? firstOption?.props.value ?? 0);

  const handleChange = (v: number) => {
    setValue(v);
    props.onChange(v);
  };

  useEffect(() => {
    if (props.value !== undefined) setValue(props.value);
  }, [props.value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#555',
          backgroundColor: '#eee',
          padding: 8,
          borderRadius: 4,
        }}
      >
        Current: {value}
      </div>
      <PickerView {...props} value={value} onChange={handleChange} />
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <PickerViewForStorybook {...args} onChange={args.onChange ?? (() => {})}>
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
    </PickerViewForStorybook>
  ),
  args: {
    value: 1,
  },
};

export const CustomRender: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    const handleClick = () => {
      setValue(Math.floor(Math.random() * 24));
    };

    return (
      <>
        <PickerViewForStorybook {...args} value={value} onChange={args.onChange ?? (() => {})}>
          {Array.from({ length: 24 }, (_, i) => (
            <PickerViewOption key={i} value={i} id={`option-${i}`} />
          ))}
        </PickerViewForStorybook>
        <button onClick={handleClick} style={{ marginTop: 16 }}>
          Scroll to Random Value <br /> (by calling setValue)
        </button>
      </>
    );
  },
  args: {
    value: 8,
    itemHeight: 100,
    renderOption: (props: PickerViewOptionProps, isSelected: boolean) => {
      return (
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
      );
    },
  },
};
