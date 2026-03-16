import getNextIndexByKey from './getNextIndexByKey';

describe('getNextIndexByKey', () => {
  const length = 10;

  it('wraps around on ArrowUp and ArrowDown', () => {
    expect(getNextIndexByKey({ key: 'ArrowUp', currentIndex: length - 1, length })).toBe(0);
    expect(getNextIndexByKey({ key: 'ArrowDown', currentIndex: 0, length })).toBe(length - 1);
  });

  it('moves within bounds for PageUp and PageDown', () => {
    expect(
      getNextIndexByKey({
        key: 'PageUp',
        currentIndex: 3,
        length,
        pageSize: 5,
      }),
    ).toBe(8);

    expect(
      getNextIndexByKey({
        key: 'PageDown',
        currentIndex: 6,
        length,
        pageSize: 5,
      }),
    ).toBe(1);
  });

  it('jumps to start/end on Home/End', () => {
    expect(getNextIndexByKey({ key: 'Home', currentIndex: 5, length })).toBe(0);
    expect(getNextIndexByKey({ key: 'End', currentIndex: 2, length })).toBe(length - 1);
  });

  it('returns currentIndex on unsupported key', () => {
    expect(getNextIndexByKey({ key: 'Enter', currentIndex: 3, length })).toBe(3);
  });
});
