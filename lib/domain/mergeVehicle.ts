import { Vehicle, VehicleFormData } from '@/types/inventory';

export function mergeVehicle(
  current: Vehicle,
  updates: Partial<VehicleFormData>
): Vehicle {
  return {
    ...current,
    vin: updates.vin ?? current.vin,
    year: updates.year ?? current.year,
    make: updates.make ?? current.make,
    model: updates.model ?? current.model,
    trim: updates.trim ?? current.trim,
    odometer: updates.odometer ?? current.odometer,
    stock_number: updates.stock_number ?? current.stock_number,
    condition: updates.condition ?? current.condition,
    status: updates.status ?? current.status,
    purchase_price: updates.purchase_price ?? current.purchase_price,
    retail_price: updates.retail_price ?? current.retail_price,
    extra_costs: updates.extra_costs ?? current.extra_costs,
    taxes: updates.taxes ?? current.taxes,
    image_gallery: updates.image_gallery ?? current.image_gallery,
    updated_at: new Date().toISOString(),
  };
}
