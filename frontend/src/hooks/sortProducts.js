export const SORT_OPTIONS = {
  PRICE_LOW_HIGH: 'PRICE_LOW_HIGH',
  PRICE_HIGH_LOW: 'PRICE_HIGH_LOW',
  SOURCE_A_Z: 'SOURCE_A_Z',
  SOURCE_Z_A: 'SOURCE_Z_A',
};

export function sortProducts(products = [], sortBy) {
  const items = products; //[...products];

  switch (sortBy) {
    case SORT_OPTIONS.PRICE_LOW_HIGH:
      return items.sort((a, b) => Number(a.price) - Number(b.price));

    case SORT_OPTIONS.PRICE_HIGH_LOW:
      return items.sort((a, b) => Number(b.price) - Number(a.price));

    case SORT_OPTIONS.SOURCE_A_Z:
      return items.sort((a, b) =>
        (a.source || '').localeCompare(b.source || '', undefined, { sensitivity: 'base' })
      );

    case SORT_OPTIONS.SOURCE_Z_A:
      return items.sort((a, b) =>
        (b.source || '').localeCompare(a.source || '', undefined, { sensitivity: 'base' })
      );

    default:
      return items;
  }
}