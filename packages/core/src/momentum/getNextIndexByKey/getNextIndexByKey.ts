export interface GetNextIndexByKeyOptions {
  key: string;
  currentIndex: number;
  length: number;
  pageSize?: number;
}

export default function getNextIndexByKey({
  key,
  currentIndex,
  length,
  pageSize = 5,
}: GetNextIndexByKeyOptions): number {
  if (length <= 0) return 0;

  let nextIndex = currentIndex;

  switch (key) {
    case 'ArrowUp':
      nextIndex = nextIndex + 1;
      if (nextIndex > length - 1) nextIndex = 0;
      break;
    case 'ArrowDown':
      nextIndex = nextIndex - 1;
      if (nextIndex < 0) nextIndex = length - 1;
      break;
    case 'PageUp':
      nextIndex = nextIndex + pageSize;
      if (nextIndex > length - 1) nextIndex = length - 1;
      break;
    case 'PageDown':
      nextIndex = nextIndex - pageSize;
      if (nextIndex < 0) nextIndex = 0;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = length - 1;
      break;
    default:
      return currentIndex;
  }

  return nextIndex;
}

