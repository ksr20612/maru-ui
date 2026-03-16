import type { CSSProperties, HTMLAttributes, KeyboardEvent, MouseEvent, TouchEvent } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { UsePickerViewOptions, UsePickerViewReturn, VelocitySample } from './types';
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

  const [scrollPosition, setScrollPosition] = useState(initialIndex * itemHeight);
  const [startDragScrollPosition, setStartDragScrollPosition] = useState(0);
  const [startDragY, setStartDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [velocitySamples, setVelocitySamples] = useState<VelocitySample[]>([]);

  const selectedIndex = Math.max(
    0,
    Math.min(Math.round(scrollPosition / itemHeight), pickerViewOptions.length - 1),
  );
  const selectedValue = pickerViewOptions[selectedIndex]?.value ?? 0;

  const scrollContainer = () => wrapperRef.current?.children[0] as HTMLElement | undefined;
  const maxScrollPosition = itemHeight * (pickerViewOptions.length - 1);

  const snapToClosestItem = useCallback(
    (finalPosition: number) => {
      if (rafId.current) cancelAnimationFrame(rafId.current);

      const index = Math.max(
        0,
        Math.min(Math.round(finalPosition / itemHeight), pickerViewOptions.length - 1),
      );
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
      let velocity = initialVelocity * -1;
      let currentPosition = scrollPosition;
      let lastTime = performance.now();

      const animate = (currentTime: number) => {
        const time = currentTime - lastTime;
        lastTime = currentTime;
        currentPosition += velocity * time;

        if (currentPosition < 0) {
          currentPosition = 0;
          velocity = 0;
        } else if (currentPosition > maxScrollPosition) {
          currentPosition = maxScrollPosition;
          velocity = 0;
        }

        setScrollPosition(currentPosition);
        velocity *= MOMENTUM_CONFIG.FRICTION;

        const container = scrollContainer();
        if (container) container.scrollTop = currentPosition;

        const nearestIndex = Math.round(currentPosition / itemHeight);
        const targetScrollPosition = nearestIndex * itemHeight;
        const distance = Math.abs(currentPosition - targetScrollPosition);
        const isNearZeroVelocity = Math.abs(velocity) <= MOMENTUM_CONFIG.NEAR_ZERO_VELOCITY;
        const isSlowEnough = Math.abs(velocity) <= MOMENTUM_CONFIG.SNAP_VELOCITY_THRESHOLD;
        const isNearBoundary = distance <= MOMENTUM_CONFIG.BOUNDARY_PX;

        // 속도가 0에 충분히 가깝고 옵션의 끝단에 충분히 가깝거나, 속도가 충분히 느리면 스냅
        if ((isNearZeroVelocity && isNearBoundary) || isSlowEnough) {
          setIsAnimating(false);
          snapToClosestItem(currentPosition);
        } else {
          rafId.current = requestAnimationFrame(animate);
        }
      };

      rafId.current = requestAnimationFrame(animate);
    },
    [scrollPosition, maxScrollPosition, itemHeight, snapToClosestItem],
  );

  const handleStart = useCallback(
    (clientY: number) => {
      setIsDragging(true);
      setIsAnimating(false);
      setStartDragY(clientY);
      setStartDragScrollPosition(scrollPosition);
      setVelocitySamples([{ time: performance.now(), y: clientY }]);
    },
    [scrollPosition],
  );

  const handleMove = useCallback(
    (clientY: number) => {
      if (!isDragging || isAnimating) return;

      const newScrollPosition = Math.max(
        0,
        Math.min(maxScrollPosition, startDragScrollPosition + (startDragY - clientY)),
      );
      setScrollPosition(newScrollPosition);

      const container = scrollContainer();
      if (container) container.scrollTop = newScrollPosition;

      const now = performance.now();
      setVelocitySamples((prev) => [
        ...prev.filter((sample) => now - sample.time <= 100),
        { time: now, y: clientY },
      ]);
    },
    [isDragging, isAnimating, startDragY, startDragScrollPosition, maxScrollPosition],
  );

  const handleEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      setIsDragging(false);

      const velocity = calculateVelocity(velocitySamples);

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
    [isDragging, velocitySamples, pickerViewOptions, itemHeight, onChange, applyMomentumScroll],
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

      let newIndex = currentIndex.current;
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        newIndex = newIndex >= pickerViewOptions.length - 1 ? 0 : newIndex + 1;
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        newIndex = newIndex <= 0 ? pickerViewOptions.length - 1 : newIndex - 1;
      } else if (event.key === 'PageUp') {
        event.preventDefault();
        newIndex = Math.min(pickerViewOptions.length - 1, newIndex + 5);
      } else if (event.key === 'PageDown') {
        event.preventDefault();
        newIndex = Math.max(0, newIndex - 5);
      } else if (event.key === 'Home') {
        event.preventDefault();
        newIndex = 0;
      } else if (event.key === 'End') {
        event.preventDefault();
        newIndex = pickerViewOptions.length - 1;
      } else return;

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

function calculateVelocity(samples: VelocitySample[]) {
  if (samples.length < 2) return 0;

  // 100ms 범위 내 수집된 샘플 값으로 속도 계산
  const first = samples[0];
  const last = samples[samples.length - 1];
  const time = last.time - first.time;
  const distance = last.y - first.y;

  if (time <= 0) return 0;

  return Math.max(
    -MOMENTUM_CONFIG.MAX_VELOCITY,
    Math.min(MOMENTUM_CONFIG.MAX_VELOCITY, distance / time),
  );
}
