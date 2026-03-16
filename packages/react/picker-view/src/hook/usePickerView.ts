import type { CSSProperties, HTMLAttributes, KeyboardEvent, MouseEvent, TouchEvent } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getClampedPosition, getNextIndexByKey, getSnapIndex, MomentumEngine } from '@maru-ui/core';
import type { UsePickerViewOptions, UsePickerViewReturn } from './types';
import { MOMENTUM_CONFIG } from './types';

export default function usePickerView({
  options: pickerViewOptions,
  onChange,
  value,
  itemHeight,
}: UsePickerViewOptions): UsePickerViewReturn {
  const initialIndex =
    pickerViewOptions.findIndex((item) => item.value === (value ?? pickerViewOptions[0]?.value)) ??
    0;

  const currentIndex = useRef(initialIndex);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number | null>(null);
  const isReady = useRef(false);
  const momentumEngineRef = useRef(
    new MomentumEngine({
      min: 0,
      max: itemHeight * (pickerViewOptions.length - 1),
      friction: MOMENTUM_CONFIG.FRICTION,
      itemHeight,
      length: pickerViewOptions.length,
      nearZeroVelocity: MOMENTUM_CONFIG.NEAR_ZERO_VELOCITY,
      snapVelocityThreshold: MOMENTUM_CONFIG.SNAP_VELOCITY_THRESHOLD,
      boundaryPx: MOMENTUM_CONFIG.BOUNDARY_PX,
      maxVelocity: MOMENTUM_CONFIG.MAX_VELOCITY,
    }),
  );

  const [scrollPosition, setScrollPosition] = useState(initialIndex * itemHeight);
  const [startDragScrollPosition, setStartDragScrollPosition] = useState(0);
  const [startDragY, setStartDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const selectedIndex = getSnapIndex({
    position: scrollPosition,
    itemHeight,
    length: pickerViewOptions.length,
  });
  const selectedValue = pickerViewOptions[selectedIndex]?.value ?? 0;

  const scrollContainer = () => wrapperRef.current?.children[0] as HTMLElement | undefined;
  const maxScrollPosition = itemHeight * (pickerViewOptions.length - 1);

  const snapToClosestItem = useCallback(
    (finalPosition: number) => {
      if (rafId.current) cancelAnimationFrame(rafId.current);

      const index = getSnapIndex({
        position: finalPosition,
        itemHeight,
        length: pickerViewOptions.length,
      });
      const targetPosition = index * itemHeight;
      currentIndex.current = index;

      const animate = (currentValue: number) => {
        if (Math.abs(currentValue - targetPosition) < 1) {
          setScrollPosition(targetPosition);
          const container = scrollContainer();

          if (!container) return;

          container.scrollTop = targetPosition;
          if (pickerViewOptions[index])
            onChange(pickerViewOptions[index].value, pickerViewOptions[index]);
        } else {
          const newValue =
            currentValue + (targetPosition - currentValue) * MOMENTUM_CONFIG.SNAP_FORCE;

          setScrollPosition(newValue);
          const container = scrollContainer();
          if (container) container.scrollTop = newValue;

          rafId.current = requestAnimationFrame(() => animate(newValue));
        }
      };

      rafId.current = requestAnimationFrame(() => animate(finalPosition));
    },
    [pickerViewOptions, itemHeight, onChange],
  );

  const applyMomentumScroll = useCallback(
    (initialVelocity: number) => {
      if (rafId.current) cancelAnimationFrame(rafId.current);

      setIsAnimating(true);
      momentumEngineRef.current.start({
        position: scrollPosition,
        velocity: initialVelocity * -1,
      });
      let lastTime = performance.now();

      const animate = (currentTime: number) => {
        const time = currentTime - lastTime;
        lastTime = currentTime;
        const stepResult = momentumEngineRef.current.step(time);

        setScrollPosition(stepResult.position);

        const container = scrollContainer();
        if (container) container.scrollTop = stepResult.position;

        if (stepResult.shouldSnap) {
          setIsAnimating(false);
          snapToClosestItem(stepResult.position);
        } else {
          rafId.current = requestAnimationFrame(animate);
        }
      };

      rafId.current = requestAnimationFrame(animate);
    },
    [scrollPosition, snapToClosestItem],
  );

  const handleStart = useCallback(
    (clientY: number) => {
      setIsDragging(true);
      setIsAnimating(false);
      setStartDragY(clientY);
      setStartDragScrollPosition(scrollPosition);
      momentumEngineRef.current.stop();
      momentumEngineRef.current.clearSamples();
      momentumEngineRef.current.pushSample({ time: performance.now(), value: clientY });
    },
    [scrollPosition],
  );

  const handleMove = useCallback(
    (clientY: number) => {
      if (!isDragging || isAnimating) return;

      const newScrollPosition = getClampedPosition({
        position: startDragScrollPosition + (startDragY - clientY),
        min: 0,
        max: maxScrollPosition,
      });
      setScrollPosition(newScrollPosition);

      const container = scrollContainer();
      if (container) container.scrollTop = newScrollPosition;

      const now = performance.now();
      momentumEngineRef.current.pushSample({ time: now, value: clientY });
    },
    [isDragging, isAnimating, startDragY, startDragScrollPosition, maxScrollPosition],
  );

  const handleEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      setIsDragging(false);

      const velocity = momentumEngineRef.current.getVelocityFromSamples();

      // 속도가 느리면(클릭 등) 즉시 선택 처리
      if (Math.abs(velocity) < MOMENTUM_CONFIG.MIN_VELOCITY) {
        const target = e.target as HTMLElement;
        const item = target.closest('[data-index]') as HTMLElement | null;

        if (!item) return;

        const index = Number(item.dataset.index);
        if (Number.isNaN(index) || !pickerViewOptions[index]) return;

        const container = scrollContainer();
        if (!container) return;

        container.scrollTo({ top: index * itemHeight, behavior: 'smooth' });

        const handleScrollEnd = () => {
          if (Math.abs(container.scrollTop - index * itemHeight) < 1) {
            onChange(pickerViewOptions[index].value, pickerViewOptions[index]);
            container.removeEventListener('scroll', handleScrollEnd);
          }
        };
        container.addEventListener('scroll', handleScrollEnd);

        return;
      }

      applyMomentumScroll(velocity);
    },
    [isDragging, pickerViewOptions, itemHeight, onChange, applyMomentumScroll],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      handleStart(e.clientY);
    },
    [handleStart],
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLDivElement>) => handleStart(e.touches[0].clientY),
    [handleStart],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => handleMove(e.clientY),
    [handleMove],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      event.stopPropagation();

      const newIndex = getNextIndexByKey({
        key: event.key,
        currentIndex: currentIndex.current,
        length: pickerViewOptions.length,
      });

      if (newIndex === currentIndex.current) return;

      event.preventDefault();

      if (pickerViewOptions[newIndex]) {
        onChange(pickerViewOptions[newIndex].value, pickerViewOptions[newIndex]);
        currentIndex.current = newIndex;

        const element = wrapperRef.current?.querySelector<HTMLDivElement>(
          `.maru-picker-view__option[data-index="${newIndex}"]`,
        );
        element?.focus();
      }
    },
    [pickerViewOptions, onChange],
  );

  const getOptionProps = useCallback(
    (index: number): HTMLAttributes<HTMLDivElement> => {
      const item = pickerViewOptions[index];
      const isSelected = index === selectedIndex;
      const distance = index - selectedIndex;

      return {
        className: `maru-picker-view__option${isSelected ? ' maru-picker-view__option--selected' : ''}`,
        'data-index': index,
        'data-selected': isSelected,
        'data-distance': distance,
        role: 'spinbutton',
        tabIndex: isSelected ? 0 : -1,
        'aria-hidden': !isSelected,
        'aria-valuenow': item?.value,
        'aria-valuetext': item?.['aria-valuetext'] ?? item?.value.toString(),
        'aria-valuemin': pickerViewOptions[0]?.value,
        'aria-valuemax': pickerViewOptions[pickerViewOptions.length - 1]?.value,
        onKeyDown: handleKeyDown,
      } as HTMLAttributes<HTMLDivElement>;
    },
    [pickerViewOptions, selectedIndex, handleKeyDown],
  );

  const getWrapperProps = useCallback((): HTMLAttributes<HTMLDivElement> => {
    return {
      className: 'maru-picker-view__wrapper',
      style: {
        ['--maru-picker-view-option-height' as string]: `${itemHeight}px`,
      } as CSSProperties,
    } as HTMLAttributes<HTMLDivElement>;
  }, [itemHeight]);

  const getListProps = useCallback((): HTMLAttributes<HTMLDivElement> => {
    return {
      className: 'maru-picker-view',
      role: 'group',
      onMouseDown: handleMouseDown,
      onMouseMove: (e: MouseEvent) => handleMove(e.clientY),
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleEnd,
      onTouchCancel: handleEnd,
    };
  }, [handleMouseDown, handleMove, handleEnd, handleTouchStart]);

  const getTopSpacerProps = useCallback((): HTMLAttributes<HTMLDivElement> => {
    return {
      className: 'maru-picker-view__option maru-picker-view__option--spacer',
      'data-index': -1,
      'aria-hidden': true,
    } as HTMLAttributes<HTMLDivElement>;
  }, []);

  const getBottomSpacerProps = useCallback((): HTMLAttributes<HTMLDivElement> => {
    return {
      className: 'maru-picker-view__option maru-picker-view__option--spacer',
      'data-index': pickerViewOptions.length,
      'aria-hidden': true,
    } as HTMLAttributes<HTMLDivElement>;
  }, [pickerViewOptions.length]);

  useLayoutEffect(() => {
    const index = pickerViewOptions.findIndex((item) => item.value === value) ?? 0;

    if (index < 0) return;

    const newScrollPosition = index * itemHeight;
    setScrollPosition(newScrollPosition);
    currentIndex.current = index;

    const container = scrollContainer();
    if (!container) return;

    container.scrollTo({
      top: newScrollPosition,
      behavior: isReady.current ? 'smooth' : 'instant',
    });
  }, [value, pickerViewOptions, itemHeight]);

  useEffect(() => {
    momentumEngineRef.current.configure({
      min: 0,
      max: maxScrollPosition,
      friction: MOMENTUM_CONFIG.FRICTION,
      itemHeight,
      length: pickerViewOptions.length,
      nearZeroVelocity: MOMENTUM_CONFIG.NEAR_ZERO_VELOCITY,
      snapVelocityThreshold: MOMENTUM_CONFIG.SNAP_VELOCITY_THRESHOLD,
      boundaryPx: MOMENTUM_CONFIG.BOUNDARY_PX,
      maxVelocity: MOMENTUM_CONFIG.MAX_VELOCITY,
    });
  }, [itemHeight, maxScrollPosition, pickerViewOptions.length]);

  useEffect(() => {
    isReady.current = true;

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // onTouchMove passive: false 처리
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleTouchMove = (e: Event) => {
      const event = e as unknown as TouchEvent;
      event.preventDefault();
      event.stopPropagation();
      handleMove(event.touches[0].clientY);
    };

    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => wrapper.removeEventListener('touchmove', handleTouchMove);
  }, [handleMove]);

  return {
    selectedIndex,
    selectedValue,
    scrollPosition,
    isDragging,
    isAnimating,
    wrapperRef,
    getWrapperProps,
    getListProps,
    getTopSpacerProps,
    getBottomSpacerProps,
    getOptionProps,
    handleStart,
    handleMove,
    handleEnd,
    handleKeyDown,
    handleMouseDown,
    handleMouseMove,
    handleTouchStart,
  };
}
