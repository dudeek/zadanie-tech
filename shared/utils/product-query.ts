import { CATEGORIES, SPEC_PARAM_BY_CATEGORY, allowedSort } from '#shared/types/product'
import type { NumberRange, ProductQuery, RangeParam } from '#shared/types/product'
import { DEFAULT_SORT } from '#shared/utils/constants'
import { queryList, queryNumber, queryOneOf, queryPage, queryString } from '#shared/utils/query'

const readRange = (raw: Record<string, unknown>, param: RangeParam): NumberRange => ({
  min: queryNumber(raw[`${param}Min`]),
  max: queryNumber(raw[`${param}Max`])
})

export const rangeToQuery = (param: RangeParam, range: NumberRange) => ({
  [`${param}Min`]: range.min,
  [`${param}Max`]: range.max
})

export const INDEXABLE_PARAMS = ['category', 'manufacturer', 'page']

const hasRange = (range: NumberRange) => range.min !== undefined || range.max !== undefined

export const isIndexable = (query: ProductQuery): boolean => {
  return query.search === '' && !hasRange(query.price) && !hasRange(query.spec)
}

export const hasActiveFilters = (query: ProductQuery): boolean => {
  return Boolean(query.category) || query.manufacturers.length > 0 || hasRange(query.price) || hasRange(query.spec)
}

export const parseProductQuery = (raw: Record<string, unknown>): ProductQuery => {
  const category = queryOneOf(raw.category, CATEGORIES)
  const specParam = category ? SPEC_PARAM_BY_CATEGORY[category] : null

  return {
    search: queryString(raw.search)?.trim() ?? '',
    category,
    manufacturers: queryList(raw.manufacturer),
    price: readRange(raw, 'price'),
    spec: specParam ? readRange(raw, specParam) : {},
    sort: allowedSort(queryString(raw.sort), category) ?? DEFAULT_SORT,
    page: queryPage(raw.page)
  }
}
