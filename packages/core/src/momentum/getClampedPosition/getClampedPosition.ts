export interface GetClampedPositionOptions {
  position: number;
  min: number;
  max: number;
}

export default function getClampedPosition({
  position,
  min,
  max,
}: GetClampedPositionOptions): number {
  if (min > max) {
    [min, max] = [max, min];
  }

  if (position < min) return min;
  if (position > max) return max;

  return position;
}
