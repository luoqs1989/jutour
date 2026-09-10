import type { Product, ProductCostLine, ProductPricingInput } from '@/types/domain'

function quantityFor(feeUnit: ProductCostLine['feeUnit'], pricing: ProductPricingInput): number {
  switch (feeUnit) {
    case 'per_person':
      return pricing.paxCount
    case 'per_vehicle':
      return pricing.vehicleCount
    case 'per_service':
      return 1
  }
}

/**
 * Cost lines are per-unit — per-person, per-vehicle, and per-service fees are
 * never summed into a single blended rate. Each line shows its own quantity
 * and subtotal so the breakdown stays legible.
 */
export function computeCostBreakdown(product: Product): ProductCostLine[] {
  const lines: ProductCostLine[] = []
  for (const day of product.itinerary) {
    for (const item of day.items) {
      const material = item.materialSnapshot
      const quantity = quantityFor(material.feeUnit, product.pricingInput)
      lines.push({
        materialItemId: item.id,
        label: material.name,
        feeUnit: material.feeUnit,
        unitFee: material.baseFee,
        quantity,
        subtotal: material.baseFee * quantity,
      })
      for (const extra of material.extraFees) {
        lines.push({
          materialItemId: item.id,
          label: extra.name,
          feeUnit: 'per_service',
          unitFee: extra.fee,
          quantity: 1,
          subtotal: extra.fee,
        })
      }
    }
  }
  return lines
}

export function sumCostBreakdown(lines: ProductCostLine[]): number {
  return lines.reduce((sum, line) => sum + line.subtotal, 0)
}

export function formatCurrency(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat('en-US').format(Math.round(amount))
  const symbol = currency === 'KRW' ? '₩' : currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : ''
  return `${symbol}${formatted}`
}

export const feeUnitLabelKey: Record<ProductCostLine['feeUnit'], string> = {
  per_person: 'common.perPerson',
  per_vehicle: 'common.perVehicle',
  per_service: 'common.perService',
}
