let productsPromise: Promise<Product[]> | undefined

export const getProducts = (): Promise<Product[]> => {
  productsPromise ??= loadProducts().catch((error: unknown) => {
    productsPromise = undefined
    throw error
  })
  return productsPromise
}

const loadProducts = async (): Promise<Product[]> => {
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
