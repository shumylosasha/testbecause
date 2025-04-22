export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  currentVendor?: string;
  unitPrice?: number;
  image?: string;
  sku?: string;
  status?: string;
  description?: string;
  manufacturer?: string;
  category?: string;
  packaging?: string;
  currentStock?: number;
  totalStock?: number;
  expiresIn?: string;
  lastPurchasePrice?: number;
  requiredUnits?: number;
} 