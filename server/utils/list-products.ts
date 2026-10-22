export const listProducts = (all: Product[], query: ProductQuery): ProductListResponse => {
  const inCategory = query.category ? all.filter(p => p.category === query.category) : all
  const matching = filterProducts(inCategory, query).sort(compareBy(query.sort))
  const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE))
  const page = Math.min(query.page, pageCount)

  return {
    products: paginate(matching, page),
    total: matching.length,
    page,
    pageCount,
    minPrice: matching.length > 0 ? Math.min(...matching.map(p => p.price)) : null,
    facets: buildFacets(inCategory, query.category)
  }
}

const filterProducts = (products: Product[], query: ProductQuery): Product[] => {
  const searchTerms = query.search.toLowerCase().split(/\s+/).filter(Boolean)
  const hasSpecRange = query.spec.min !== undefined || query.spec.max !== undefined

  return products
    .filter(p => query.manufacturers.length === 0 || query.manufacturers.includes(p.manufacturer))
    .filter(p => inRange(p.price, query.price))
    .filter(p => !hasSpecRange || (p.spec !== null && inRange(p.spec.value, query.spec)))
    .filter(p => searchTerms.every(term => searchableText(p).includes(term)))
}

const inRange = (value: number, { min, max }: NumberRange): boolean => {
  return (min === undefined || value >= min) && (max === undefined || value <= max)
}

const searchableTexts = new WeakMap<Product, string>()

const searchableText = (product: Product): string => {
  let text = searchableTexts.get(product)
  if (text === undefined) {
    text = `${product.name} ${product.manufacturer} ${product.description}`.toLowerCase()
    searchableTexts.set(product, text)
  }
  return text
}

const byNameNatural = (a: Product, b: Product): number => {
  return a.name.localeCompare(b.name, 'en', { numeric: true })
}

const missingValueLast = (aValue: number | null, bValue: number | null): number => {
  if (aValue === bValue) return 0
  return aValue === null ? 1 : -1
}

const sortValue = (product: Product, sort: Sort): number | null => {
  return sort.startsWith('price-') ? product.price : product.spec?.value ?? null
}

const compareBy = (sort: Sort): (a: Product, b: Product) => number => {
  if (sort === 'name') return byNameNatural
  const direction = sort.endsWith('-desc') ? -1 : 1

  return (a, b) => {
    const aValue = sortValue(a, sort)
    const bValue = sortValue(b, sort)
    if (aValue === null || bValue === null) return missingValueLast(aValue, bValue) || byNameNatural(a, b)
    return direction * (aValue - bValue) || byNameNatural(a, b)
  }
}

const paginate = (products: Product[], page: number): Product[] => {
  return products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
}

const minMax = (values: number[]): { min: number, max: number } => {
  return { min: Math.min(...values), max: Math.max(...values) }
}

const buildFacets = (products: Product[], category?: Category): Facets => {
  const specs = products.flatMap(p => (p.spec ? [p.spec] : []))
  const specUnit = specs[0]?.unit

  return {
    manufacturers: [...new Set(products.map(p => p.manufacturer))].sort((a, b) => a.localeCompare(b, 'en')),
    price: minMax(products.map(p => p.price)),
    spec: category && specUnit ? { ...minMax(specs.map(s => s.value)), unit: specUnit } : null
  }
}
