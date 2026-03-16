export interface GetSnapIndexOptions {
  position: number;
  itemHeight: number;
  length: number;
}

export default function getSnapIndex({ position, itemHeight, length }: GetSnapIndexOptions) {
  if (length <= 0 || itemHeight <= 0) return 0;

  const rawIndex = Math.abs(Math.round(position / itemHeight));

  if (rawIndex > length - 1) return length - 1;

  return rawIndex;
}

