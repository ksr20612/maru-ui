import type { HTMLAttributes, ReactNode } from 'react';
import { Children, useMemo } from 'react';
import { usePickerView } from '../hook/index';
import { PickerViewOptionContext } from '../hook/PickerViewOptionContext';
import { isPickerViewOption } from './PickerView.utils';
import type { PickerViewOptionProps } from './PickerViewOption';
import './styles.css';

export interface PickerViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 현재 선택값 */
  value: number;
  /** 선택 변경 시 호출되는 콜백 함수 */
  onChange: (selectedValue: number) => void;
  /** 아이템 높이(px). 기본 50 */
  itemHeight?: number;
  /** 커스텀 라벨 렌더링 */
  renderOption?: (props: PickerViewOptionProps, isSelected: boolean) => ReactNode;
}

export default function PickerView({
  children,
  value,
  onChange,
  itemHeight = 50,
  renderOption,
  ...props
}: PickerViewProps) {
  const optionChildren = useMemo(
    () => Children.toArray(children).filter(isPickerViewOption),
    [children],
  );
  const options = useMemo(() => optionChildren.map((child) => child.props), [optionChildren]);

  const {
    wrapperRef,
    getWrapperProps,
    getListProps,
    getTopSpacerProps,
    getBottomSpacerProps,
    selectedIndex,
    getOptionProps,
  } = usePickerView({
    options,
    value,
    onChange,
    itemHeight,
  });

  const wrapperProps = { ...props, ...getWrapperProps() };
  const listProps = getListProps();
  const topSpacerProps = getTopSpacerProps();
  const bottomSpacerProps = getBottomSpacerProps();

  return (
    <div ref={wrapperRef} {...wrapperProps}>
      <div {...listProps}>
        <div {...topSpacerProps} />
        {optionChildren.map((optionChild, index) => {
          const isSelected = index === selectedIndex;

          const content = renderOption
            ? renderOption(optionChild.props, isSelected)
            : optionChild.props.children;
          const optionContextValue = {
            index,
            isSelected,
            optionProps: getOptionProps(index),
            content,
          };

          return (
            <PickerViewOptionContext.Provider
              key={`option-${optionChild.props.value}-${index}`}
              value={optionContextValue}
            >
              {optionChild}
            </PickerViewOptionContext.Provider>
          );
        })}
        {options.length > 0 && <div {...bottomSpacerProps} />}
      </div>
    </div>
  );
}
