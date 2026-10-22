export const CATEGORIES = ['battery', 'solar-panel', 'connector'] as const
export type Category = typeof CATEGORIES[number]

const BASE_SORTS = ['name', 'price-asc', 'price-desc'] as const

export const SORTS_BY_CATEGORY = {
  'battery': [...BASE_SORTS, 'capacity-asc', 'capacity-desc'],
  'solar-panel': [...BASE_SORTS, 'power-asc', 'power-desc'],
  'connector': BASE_SORTS
} as const satisfies Record<Category, readonly string[]>

export type Sort = typeof SORTS_BY_CATEGORY[Category][number]

export const sortsFor = (category?: Category): readonly Sort[] => {
  return category ? SORTS_BY_CATEGORY[category] : BASE_SORTS
}

export const allowedSort = (sort: string | undefined, category?: Category): Sort | undefined => {
  return sortsFor(category).find(item => item === sort)
}

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

export interface NumberRange {
  min?: number
  max?: number
}

export type RangeParam = 'price' | 'capacity' | 'power'

export interface ProductQuery {
  search: string
  category?: Category
  manufacturers: string[]
  price: NumberRange
  spec: NumberRange
  sort: Sort
  page: number
}

export interface Facets {
  manufacturers: string[]
  price: { min: number, max: number }
  spec: { min: number, max: number, unit: SpecUnit } | null
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  pageCount: number
  facets: Facets
}
