// Value lists define the types, so runtime validation and types cannot drift apart.

export const CATEGORIES = ['battery', 'solar-panel', 'connector'] as const
export type Category = typeof CATEGORIES[number]

const BASE_SORTS = ['name', 'price-asc', 'price-desc'] as const

// kWh/W sorts only inside their own category (ADR 0009).
export const SORTS_BY_CATEGORY = {
  'battery': [...BASE_SORTS, 'capacity-asc', 'capacity-desc'],
  'solar-panel': [...BASE_SORTS, 'power-asc', 'power-desc'],
  'connector': BASE_SORTS
} as const satisfies Record<Category, readonly string[]>

export type Sort = typeof SORTS_BY_CATEGORY[Category][number]

// Without a category only the base sorts are available.
export function sortsFor(category?: Category): readonly Sort[] {
  return category ? SORTS_BY_CATEGORY[category] : BASE_SORTS
}

// Prefix of the kWh/W range params (`capacityMin`) and sorts (`capacity-asc`), only valid in its category (ADR 0009).
export const SPEC_PARAM_BY_CATEGORY: Record<Category, 'capacity' | 'power' | null> = {
  'battery': 'capacity',
  'solar-panel': 'power',
  'connector': null
}

export type SpecUnit = 'kWh' | 'W'

export interface Spec {
  value: number
  unit: SpecUnit
}

export interface Product {
  name: string
  manufacturer: string
  category: Category
  price: number
  description: string
  spec: Spec | null
}

export interface Range {
  min?: number
  max?: number
}

// URL query after validation; invalid values are dropped, not rejected.
export interface ProductQuery {
  search: string
  category?: Category
  manufacturers: string[]
  price: Range
  // capacity (kWh) or power (W), depending on the category; empty without a category.
  spec: Range
  sort: Sort
  page: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  pageCount: number
  facets: {
    manufacturers: string[]
    price: { min: number, max: number }
    spec: { min: number, max: number, unit: SpecUnit } | null
  }
}
