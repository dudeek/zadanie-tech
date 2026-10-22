import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseProducts } from '#server/utils/parse-products'

const HEADER = 'name,manufacturer,price,description,category'

const csvRow = (name: string, description: string, category: string, price = '100'): string => {
  return `${HEADER}\n"${name}",Acme,"${price}","${description}",${category}`
}

const parseOne = (name: string, description: string, category: string, price?: string) => {
  return parseProducts(csvRow(name, description, category, price))
}

describe('parseProducts: kWh/W edge cases (docs/data-analysis.md)', () => {
  it.each([
    ['Acme Home 10', 'a 10kWh LiFePO4 battery', 'battery', { value: 10, unit: 'kWh' }],
    ['Acme Compact 2.5', 'compact 2.5kWh LFP', 'battery', { value: 2.5, unit: 'kWh' }],
    ['Acme Stack 7.5', '7.5kWh module, up to 4 for a total of 30kWh', 'battery', { value: 7.5, unit: 'kWh' }],
    ['Acme Stack 10.5', '10.5kWh system of three 3.5kWh modules', 'battery', { value: 10.5, unit: 'kWh' }],
    ['Acme Reserve 15', 'Acme Reserve 15, a scalable 15kWh unit', 'battery', { value: 15, unit: 'kWh' }],
    ['Acme Rack 5', '5kWh 48V rack', 'battery', { value: 5, unit: 'kWh' }],
    ['Acme Mono 450', '450W output', 'solar panel', { value: 450, unit: 'W' }],
    ['Acme Mono 405', 'rated to 5400 Pa, 405W', 'solar panel', { value: 405, unit: 'W' }]
  ])('%s -> %o', (name, description, category, spec) => {
    const { products, warnings } = parseOne(name, description, category)
    expect(products[0]?.spec).toEqual(spec)
    expect(warnings).toEqual([])
  })

  it('connectors have no spec, even with numbers and units', () => {
    const { products, warnings } = parseOne('Acme T-Branch 2-1', '15A fuse, 1500V', 'connector')
    expect(products[0]?.spec).toBeNull()
    expect(products[0]?.category).toBe('connector')
    expect(warnings).toEqual([])
  })

  it('a thousands separator without a unit is not a spec value', () => {
    const { products, warnings } = parseOne('Acme Cycle 10', '6,000 cycle life', 'battery')
    expect(products[0]?.spec).toBeNull()
    expect(warnings).toHaveLength(1)
  })

  it('description and name disagree -> no spec and a warning', () => {
    const { products, warnings } = parseOne('Acme Reserve 15', 'a 12kWh battery', 'battery')
    expect(products[0]?.spec).toBeNull()
    expect(warnings).toHaveLength(1)
  })
})

describe('parseProducts: rows and prices', () => {
  it.each(['', '1,999.00', '1 999,00', '12abc', '€1999'])('skips invalid price "%s"', (price) => {
    const { products, warnings } = parseOne('Acme X 1', 'x', 'connector', price)
    expect(products).toEqual([])
    expect(warnings).toHaveLength(1)
  })

  it('keeps one-decimal prices as numbers', () => {
    expect(parseOne('Acme X 1', 'x', 'connector', '18.5').products[0]?.price).toBe(18.5)
  })

  it('maps "solar panel" to the URL-safe category', () => {
    expect(parseOne('Acme Mono 450', '450W', 'solar panel').products[0]?.category).toBe('solar-panel')
  })

  it('skips unknown categories and duplicate names', () => {
    expect(parseOne('Acme X 1', 'x', 'inverter').products).toEqual([])
    const duplicated = `${csvRow('Acme X 1', 'x', 'connector')}\n"Acme X 1",Acme,5,"y",connector`
    expect(parseProducts(duplicated).products).toHaveLength(1)
  })
})

// Build gate (ADR 0007): the real file must parse cleanly before deploy.
describe('server/assets/products.csv', () => {
  const csv = readFileSync(new URL('../../server/assets/products.csv', import.meta.url), 'utf8')
  const { products, warnings } = parseProducts(csv)

  it('parses every row without warnings', () => {
    expect(warnings).toEqual([])
    expect(products).toHaveLength(150)
  })

  it('has kWh/W for every battery and panel, none for connectors', () => {
    expect(products.filter(p => p.spec !== null)).toHaveLength(100)
    expect(products.filter(p => p.category === 'connector' && p.spec !== null)).toEqual([])
  })
})
