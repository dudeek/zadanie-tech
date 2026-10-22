import type { Ref } from 'vue'

export const useListingSeo = (filters: Ref<ProductQuery>, data: Ref<ProductListResponse | undefined>) => {
  const { t, n } = useI18n()

  const productsLabel = computed(() => {
    const { category } = filters.value
    return category ? t(`seo.products.${category}`) : t('seo.products.all')
  })

  const listTitle = computed(() => {
    const { search, manufacturers } = filters.value
    if (search) return t('seo.searchTitle', { search })
    const manufacturer = manufacturers[0]
    return manufacturer ? t('seo.byManufacturer', { products: productsLabel.value, manufacturer }) : productsLabel.value
  })

  const title = computed(() => {
    const { page } = filters.value
    return page > 1 ? t('seo.pageTitle', { title: listTitle.value, page }) : listTitle.value
  })

  const description = computed(() => {
    if (!data.value) return undefined
    const { total, minPrice } = data.value
    return t('seo.description', {
      products: listTitle.value,
      count: total,
      price: minPrice === null ? '' : n(minPrice, 'price')
    }, total)
  })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    robots: () => (isIndexable(filters.value) ? 'index, follow' : 'noindex, follow')
  })
}
