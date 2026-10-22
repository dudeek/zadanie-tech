import { describe, expect, it } from 'vitest'
import { hasActiveFilters, parseProductQuery } from '#shared/utils/product-query'

describe('hasActiveFilters: what "Clear filters" can clear', () => {
  it.each([
    ['category', { category: 'battery' }],
    ['manufacturer', { manufacturer: 'Acme' }],
    ['price min', { priceMin: '100' }],
    ['spec max of the selected category', { category: 'battery', capacityMax: '10' }]
  ])('%s -> true', (_, raw) => {
    expect(hasActiveFilters(parseProductQuery(raw))).toBe(true)
  })

  it.each([
    ['empty URL', {}],
    ['search only', { search: 'lfp' }],
    ['sort and page only', { sort: 'price-asc', page: '2' }],
    ['spec without its category', { capacityMax: '10' }],
    ['unknown category', { category: 'inverter' }]
  ])('%s -> false', (_, raw) => {
    expect(hasActiveFilters(parseProductQuery(raw))).toBe(false)
  })
})
