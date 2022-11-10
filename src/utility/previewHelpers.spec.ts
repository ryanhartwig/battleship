import { Coord } from '../components/attack/Preview';
import { fillRange } from './previewHelpers';

describe('fillRange', () => {
  it('should properly fill 1x1 area', () => {
    const range: [Coord, Coord] = [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
    ];
    const expected: Coord[] = [{ x: 1, y: 1 }];

    const actual = fillRange(range);

    expect(actual).toEqual(expected);
  });

  it('should properly fill 3x3 area', () => {
    const range: [Coord, Coord] = [
      { x: 2, y: 2 },
      { x: 4, y: 4 },
    ];
    const expected: Coord[] = [
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
    ];

    const actual = fillRange(range);

    expect(actual).toEqual(expected);
  });

  it('should handle directional (1x9) bomb on both axes', () => {
    const horizontalRange: [Coord, Coord] = [
      { x: 1, y: 1 },
      { x: 9, y: 1 },
    ];
    const verticalRange: [Coord, Coord] = [
      { x: 1, y: 1 },
      { x: 1, y: 9 },
    ];

    const horizontal = fillRange(horizontalRange);
    const vertical = fillRange(verticalRange);

    expect(horizontal).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 9, y: 1 },
    ]);
    expect(vertical).toEqual([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 1, y: 4 },
      { x: 1, y: 5 },
      { x: 1, y: 6 },
      { x: 1, y: 7 },
      { x: 1, y: 8 },
      { x: 1, y: 9 },
    ]);
  });
});
