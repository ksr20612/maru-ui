import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  RefObject,
  TouchEvent,
} from 'react';
import type { PickerViewOptionProps } from 'src/components/PickerViewOption';

export interface PickerViewItem {
  value: number;
}

export interface VelocitySample {
  time: number;
  y: number;
}

export const MOMENTUM_CONFIG = {
  FRICTION: 0.95,
  SNAP_FORCE: 0.2,
  SNAP_VELOCITY_THRESHOLD: 0.04,
  MIN_VELOCITY: 0.01,
  MAX_VELOCITY: 1.62,
  NEAR_ZERO_VELOCITY: 0.2,
  BOUNDARY_PX: 4,
} as const;

export interface PickerViewOptionContextValue {
  index: number;
  isSelected: boolean;
  optionProps: HTMLAttributes<HTMLDivElement>;
  content: ReactNode;
}

export interface UsePickerViewOptions {
  /** 아이템 배열 (label, value) */
  options: PickerViewOptionProps[];
  /** 현재 선택값 (controlled) */
  value?: number;
  /** 선택 변경 시 호출 */
  onChange: (selectedValue: number, option: PickerViewOptionProps) => void;
  /** 아이템 높이(px). 기본 54 */
  itemHeight: number;
}

export interface UsePickerViewReturn {
  /** 현재 선택 인덱스 */
  selectedIndex: number;
  /** 현재 선택값 */
  selectedValue: number;
  /** 스크롤 위치(px) */
  scrollPosition: number;
  /** 드래그 중 여부 */
  isDragging: boolean;
  /** 애니메이션(관성/스냅) 중 여부 */
  isAnimating: boolean;
  /** 휠 루트에 붙일 ref */
  wrapperRef: RefObject<HTMLDivElement | null>;
  /** 래퍼에 넘길 props */
  getWrapperProps: () => HTMLAttributes<HTMLDivElement>;
  /** 휠 컨테이너에 넘길 props */
  getListProps: () => HTMLAttributes<HTMLDivElement>;
  /** 상단 여백에 넘길 props (휠 위 여백용) */
  getTopSpacerProps: () => HTMLAttributes<HTMLDivElement>;
  /** 하단 여백에 넘길 props (휠 아래 여백용) */
  getBottomSpacerProps: () => HTMLAttributes<HTMLDivElement>;
  /** 옵션에 넘길 props (role, aria-*, data-*, onKeyDown 등) */
  getOptionProps: (index: number) => HTMLAttributes<HTMLDivElement>;
  /** 터치/마우스 시작 */
  handleStart: (clientY: number) => void;
  /** 터치/마우스 이동 */
  handleMove: (clientY: number) => void;
  /** 터치/마우스 종료 */
  handleEnd: (e: MouseEvent | TouchEvent) => void;
  /** 키보드 (ArrowUp/Down, Home/End 등) */
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  /** 마우스 다운 (휠 루트) */
  handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  /** 마우스 이동 */
  handleMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  /** 터치 시작 */
  handleTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
}

export interface PickerViewContextValue extends UsePickerViewReturn {
  column: PickerViewItem[];
  itemHeight: number;
}
