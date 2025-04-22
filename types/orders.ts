import { type InventoryItem } from './inventory';

export interface Vendor {
  id: string;
  name: string;
  image_url?: string | null;
  pricePerUnit: number;
  price?: number;
  savings?: number | null;
  manufacturer?: string;
  compliance?: string;
  shipping?: string;
  packaging?: string;
  notes?: {
    hospitalUsage?: string;
    stockWarning?: string | null;
    recentPurchases?: string;
    priceTrend?: string;
  };
  url?: string;
  status: {
    isCurrentVendor: boolean;
    isSelected: boolean;
  };
  productName?: string;
  productSKU?: string;
  productImage?: string | null;
  delivery?: string;
  qualityRating?: number;
  contactEmail?: string;
  contactPhone?: string;
  isDefault?: boolean;
  feedback?: Array<{
    hospitalName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export interface OrderItem extends InventoryItem {
  selectedVendor?: Vendor;
  selectedVendorIds?: string[];
  selectedVendors?: Vendor[];
  vendors: Vendor[];
  vendor?: string;
} 