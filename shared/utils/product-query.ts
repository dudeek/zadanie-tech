const readRange = (raw: Record<string, unknown>, param: RangeParam): NumberRange => ({
  min: queryNumber(raw[`${param}Min`]),
  max: queryNumber(raw[`${param}Max`])
})

export const rangeToQuery = (param: RangeParam, range: NumberRange) => ({
  [`${param}Min`]: range.min,
  [`${param}Max`]: range.max
})

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
