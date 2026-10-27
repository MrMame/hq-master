import { TEST_CATALOG } from '../testing/builder.fixtures';
import { findDoor, findFloor, findPiece, pieceShapeOf, UNKNOWN_SHAPE } from './catalog-lookup.util';

describe('catalog-lookup.util', () => {
  it('finds pieces, doors and floors by id', () => {
    expect(findPiece(TEST_CATALOG, 'rubble')?.name).toBe('Schutt');
    expect(findDoor(TEST_CATALOG, 'door')?.name).toBe('Tür');
    expect(findFloor(TEST_CATALOG, 'corridor')?.name).toBe('Gang');
    expect(findFloor(null, 'room')).toBeUndefined();
  });

  it('gives the shape of a piece and one cell for unknown pieces', () => {
    expect(pieceShapeOf(TEST_CATALOG, 'table').width).toBe(3);
    expect(pieceShapeOf(TEST_CATALOG, 'gibt-es-nicht')).toBe(UNKNOWN_SHAPE);
    expect(pieceShapeOf(null, 'table')).toBe(UNKNOWN_SHAPE);
  });
});
