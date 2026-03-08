# @maru-ui/picker-view

A wheel-style Picker UI component and a headless hook. Supports momentum scrolling and snap behavior, and can be controlled via touch, mouse, and keyboard.

## Installation

```bash
pnpm add @maru-ui/picker-view react react-dom
```

- **Peer dependencies**: React 17, 18 or 19

## Loading styles

You must import the package styles once to use the component.

```ts
import '@maru-ui/picker-view/styles';
```

Or, depending on your bundler:

```ts
import '@maru-ui/picker-view/styles.css';
```

If you only use the headless hook (`usePickerView`) and build your own markup and styles, you can omit this import.

---

## Usage

### PickerView component

Render a wheel picker with `PickerView` and `PickerViewOption` children.

```tsx
import '@maru-ui/picker-view/styles';
import { PickerView, PickerViewOption } from '@maru-ui/picker-view';

function MyPicker() {
  const [value, setValue] = useState(1);

  return (
    <PickerView value={value} onChange={setValue}>
      <PickerViewOption value={1}>1</PickerViewOption>
      <PickerViewOption value={2}>2</PickerViewOption>
      <PickerViewOption value={3}>3</PickerViewOption>
      {/* ... */}
    </PickerView>
  );
}
```

**PickerView props**

| Prop           | Type                                                             | Default | Description                                                           |
| -------------- | ---------------------------------------------------------------- | ------- | --------------------------------------------------------------------- |
| `value`        | `number`                                                         | —       | Current selected value                                                |
| `onChange`     | `(selectedValue: number, option: PickerViewOptionProps) => void` | —       | Called when selection changes; receives value and the selected option |
| `itemHeight`   | `number`                                                         | `50`    | Height of one option row (px)                                         |
| `renderOption` | `(props, isSelected) => ReactNode`                               | —       | Custom option label renderer                                          |
| (rest)         | `HTMLAttributes<HTMLDivElement>`                                 | —       | Passed through to the wrapper div                                     |

**PickerViewOption props**

| Prop    | Type                             | Description        |
| ------- | -------------------------------- | ------------------ |
| `value` | `number`                         | Option value       |
| (rest)  | `HTMLAttributes<HTMLDivElement>` | Passed to root div |

---

### Headless: usePickerView

To control markup and styles yourself, use `usePickerView` from `@maru-ui/picker-view/hook`.

```tsx
import { usePickerView } from '@maru-ui/picker-view/hook';

const options = [{ value: 1 }, { value: 2 }, { value: 3 }];

function CustomPicker() {
  const {
    wrapperRef,
    getWrapperProps,
    getListProps,
    getTopSpacerProps,
    getBottomSpacerProps,
    getOptionProps,
    selectedIndex,
    selectedValue,
  } = usePickerView({
    options,
    value: 1,
    onChange: (v) => console.log(v),
    itemHeight: 50,
  });

  return (
    <div ref={wrapperRef} {...getWrapperProps()}>
      <div {...getListProps()}>
        <div {...getTopSpacerProps()} />
        {options.map((opt, i) => (
          <div key={opt.value} {...getOptionProps(i)}>
            {opt.value}
          </div>
        ))}
        <div {...getBottomSpacerProps()} />
      </div>
    </div>
  );
}
```

**usePickerView options**

- `options`: `{ value: number }[]` — Option list
- `value?`: `number` — Current selected value (controlled)
- `onChange`: `(selectedValue: number, option: PickerViewOptionProps) => void`
- `itemHeight`: `number` — Option height (px). The hook injects this as `--maru-picker-view-option-height` on the wrapper.

**Return value**: `wrapperRef`, `getWrapperProps`, `getListProps`, `getTopSpacerProps`, `getBottomSpacerProps`, `getOptionProps`, `selectedIndex`, `selectedValue`, `scrollPosition`, `isDragging`, `isAnimating`, `handleStart`, `handleMove`, `handleEnd`, `handleKeyDown`, `handleMouseDown`, `handleMouseMove`, `handleTouchStart`, and more.

---

## CSS variables (theming)

When using the default styles, you can override appearance via these variables on the wrapper or a parent.

| Variable                                         | Description                 | Default                                 |
| ------------------------------------------------ | --------------------------- | --------------------------------------- |
| `--maru-picker-view-option-height`               | Option height               | `50px` (injected by hook when using it) |
| `--maru-picker-view-option-color`                | Option text color           | `#666`                                  |
| `--maru-picker-view-option-font-size`            | Option font size            | `1rem`                                  |
| `--maru-picker-view-option-line-height`          | Option line height          | `1.5`                                   |
| `--maru-picker-view-option-selected-color`       | Selected option text color  | `#111`                                  |
| `--maru-picker-view-option-selected-font-weight` | Selected option font weight | `600`                                   |
| `--maru-picker-view-option-selected-font-size`   | Selected option font size   | `1.125rem`                              |

---

## Package entry points

| Path                          | Contents                                         |
| ----------------------------- | ------------------------------------------------ |
| `@maru-ui/picker-view`        | `PickerView`, `PickerViewOption`                 |
| `@maru-ui/picker-view/hook`   | `usePickerView`, `PickerViewOptionContext`, etc. |
| `@maru-ui/picker-view/styles` | Default styles CSS                               |
