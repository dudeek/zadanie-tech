import { useDebounceFn } from '@vueuse/core'
import type { InjectionKey } from 'vue'
import type { LocationQueryRaw } from 'vue-router'

type ListingQuery = ReturnType<typeof createListingQuery>

const LISTING_QUERY: InjectionKey<ListingQuery> = Symbol('listing-query')

const isDefault = (param: string, value: unknown): boolean => {
  return value === undefined || value === null || value === '' || (param === 'sort' && value === DEFAULT_SORT)
}

const withoutDefaults = (query: LocationQueryRaw): LocationQueryRaw => {
  return Object.fromEntries(Object.entries(query).filter(([param, value]) => !isDefault(param, value)))
}

const createListingQuery = () => {
  const route = useRoute()
  const router = useRouter()

  const filters = computed(() => parseProductQuery(route.query))

  const delay = ref(FILTER_DELAY)
  let pendingChanges: LocationQueryRaw = {}
  const hasPendingChanges = () => Object.keys(pendingChanges).length > 0

  const pushPendingChanges = useDebounceFn(() => {
    if (!hasPendingChanges()) return
    const query = withoutDefaults({ ...route.query, ...pendingChanges, page: undefined })
    pendingChanges = {}
    return router.push({ query })
  }, delay)

  const applyFilter = (changes: LocationQueryRaw, wait = FILTER_DELAY) => {
    pendingChanges = { ...pendingChanges, ...changes }
    delay.value = wait
    pushPendingChanges()
  }

  const startNewSearch = (query: LocationQueryRaw) => {
    pendingChanges = {}
    return router.push({ query: withoutDefaults(query) })
  }

  return { filters, applyFilter, startNewSearch }
}

export const provideListingQuery = (): ListingQuery => {
  const listingQuery = createListingQuery()
  provide(LISTING_QUERY, listingQuery)
  return listingQuery
}

export const useListingQuery = (): ListingQuery => {
  const listingQuery = inject(LISTING_QUERY)
  if (!listingQuery) throw new Error('useListingQuery() needs provideListingQuery() in the page')
  return listingQuery
}
