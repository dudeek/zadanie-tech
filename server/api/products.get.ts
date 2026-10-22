export default defineEventHandler(async (event) => {
  const query = parseProductQuery(getQuery(event))
  return listProducts(await getProducts(), query)
})
