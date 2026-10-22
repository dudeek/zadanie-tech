import { CATEGORIES, SPEC_PARAM_BY_CATEGORY, sortsFor } from '#shared/types/product'
import type { Product, ProductListResponse, ProductQuery, Range, Sort, SpecUnit } from '#shared/types/product'
import { DEFAULT_SORT, PAGE_SIZE } from '#shared/utils/constants'

type RawQuery = Record<string, unknown>

function firstString(value: unknown): string | undefined {
  const first: unknown = Array.isArray(value) ? value[0] : value
  return typeof first === 'string' ? first : undefined
}

function nonNegativeNumber(value: unknown): number | undefined {
  const text = firstString(value)?.trim()
  if (!text) return undefined
  const number = Number(text)
  return Number.isFinite(number) && number >= 0 ? number : undefined
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  const text = firstString(value)
  return allowed.find(item => item === text)
}

export function parseProductQuery(raw: RawQuery): ProductQuery {
  const category = oneOf(raw.category, CATEGORIES)
  const specParam = category ? SPEC_PARAM_BY_CATEGORY[category] : null
  const manufacturers = [raw.manufacturer].flat().filter((m): m is string => typeof m === 'string' && m !== '')
  const page = nonNegativeNumber(raw.page)

  return {
    search: firstString(raw.search)?.trim() ?? '',
    category,
    manufacturers,
    price: { min: nonNegativeNumber(raw.priceMin), max: nonNegativeNumber(raw.priceMax) },
    spec: specParam
      ? { min: nonNegativeNumber(raw[`${specParam}Min`]), max: nonNegativeNumber(raw[`${specParam}Max`]) }
      : {},
    sort: oneOf(raw.sort, sortsFor(category)) ?? DEFAULT_SORT,
    page: page && Number.isInteger(page) && page >= 1 ? page : 1
  }
}

function inRange(value: number, { min, max }: Range): boolean {
  return (min === undefined || value >= min) && (max === undefined || value <= max)
}

// Prepared once per product (ADR 0010); WeakMap keeps it out of the API response.
const searchTexts = new WeakMap<Product, string>()

function searchText(product: Product): string {
  let text = searchTexts.get(product)
  if (text === undefined) {
    text = `${product.name} ${product.manufacturer} ${product.description}`.toLowerCase()
    searchTexts.set(product, text)
  }
  return text
}

function compareProducts(sort: Sort): (a: Product, b: Product) => number {
  // numeric: "Stack 3.5" before "Stack 10.5"
  const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, 'en', { numeric: true })
  const direction = sort.endsWith('-desc') ? -1 : 1

  if (sort.startsWith('price-')) {
    return (a, b) => direction * (a.price - b.price) || byName(a, b)
  }
  if (sort.startsWith('capacity-') || sort.startsWith('power-')) {
    // Products without a value go last in both directions.
    return (a, b) => {
      if (a.spec === null || b.spec === null) return Number(a.spec === null) - Number(b.spec === null) || byName(a, b)
      return direction * (a.spec.value - b.spec.value) || byName(a, b)
    }
  }
  return byName
}

function bounds(values: number[]): { min: number, max: number } {
  return { min: Math.min(...values), max: Math.max(...values) }
}

export function queryProducts(all: Product[], query: ProductQuery): ProductListResponse {
  const inCategory = query.category ? all.filter(p => p.category === query.category) : all
  const terms = query.search.toLowerCase().split(/\s+/).filter(Boolean)
  const hasSpecRange = query.spec.min !== undefined || query.spec.max !== undefined

  const matching = inCategory
    .filter(p => query.manufacturers.length === 0 || query.manufacturers.includes(p.manufacturer))
    .filter(p => inRange(p.price, query.price))
    .filter(p => !hasSpecRange || (p.spec !== null && inRange(p.spec.value, query.spec)))
    .filter(p => terms.every(term => searchText(p).includes(term)))
    .sort(compareProducts(query.sort))

  const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE))
  const page = Math.min(query.page, pageCount)
  const specs = inCategory.flatMap(p => (p.spec ? [p.spec] : []))
  const specUnit: SpecUnit | undefined = specs[0]?.unit

  return {
    products: matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: matching.length,
    page,
    pageCount,
    facets: {
      manufacturers: [...new Set(inCategory.map(p => p.manufacturer))].sort((a, b) => a.localeCompare(b, 'en')),
      price: bounds(inCategory.map(p => p.price)),
      spec: query.category && specUnit ? { ...bounds(specs.map(s => s.value)), unit: specUnit } : null
    }
  }
}
