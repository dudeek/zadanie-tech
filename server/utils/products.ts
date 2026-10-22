import type { Product } from '#shared/types/product'
import { parseProducts } from '#server/utils/parse-products'

let catalog: Promise<Product[]> | undefined

// Parsed once per server instance (ADR 0007). The promise is cached so concurrent
// first requests share one parse; a failure is not cached.
export function getProducts(): Promise<Product[]> {
  catalog ??= loadProducts().catch((error: unknown) => {
    catalog = undefined
    throw error
  })
  return catalog
}

async function loadProducts(): Promise<Product[]> {
  const csv = await useStorage('assets:server').getItem<string>('products.csv')
  if (typeof csv !== 'string') {
    throw new TypeError('products.csv not found in server assets')
  }

  const { products, warnings } = parseProducts(csv)
  for (const warning of warnings) {
    console.warn(`[products] ${warning}`)
  }
  return products
}
