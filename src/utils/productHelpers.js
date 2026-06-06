export const HERO_MAX = 5

export const str = (value) => (value == null ? '' : String(value))

export const isConsultPrice = (price) => str(price).toLowerCase() === 'consultar'

export const parseHeroFeaturedIds = (value) => {
  if (!value) return []
  const list = Array.isArray(value)
    ? value.map((id) => str(id))
    : str(value).split(',').map((s) => s.trim()).filter(Boolean)
  return list.slice(0, HERO_MAX)
}

export const getFeaturedProducts = (products, heroFeaturedIds = []) => {
  const ids = parseHeroFeaturedIds(heroFeaturedIds)
  if (ids.length > 0) {
    return ids
      .map((id) => products.find((p) => str(p.id) === str(id)))
      .filter((p) => p && str(p.name))
      .slice(0, HERO_MAX)
  }
  return products.filter((p) => str(p.img)).slice(0, HERO_MAX)
}

export const productMatchesPlatform = (productPlatform, filter) => {
  if (filter === 'all') return true
  return str(productPlatform).toLowerCase() === str(filter).toLowerCase()
}

export const deriveCategoriesFromProducts = (products) =>
  [...new Set(products.map((p) => str(p.category)).filter(Boolean))]

/** Une categorías de productos, hoja categories y personalizadas sin duplicados */
export const mergeCategoryLists = (...lists) =>
  [...new Set(lists.flat().map((c) => str(c)).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'es')
  )
