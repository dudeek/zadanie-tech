export default defineEventHandler(async (event) => {
  const query = parseProductQuery(getQuery(event))
  return queryProducts(await getProducts(), query)
})
