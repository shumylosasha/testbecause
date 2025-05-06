import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Star, StarHalf, MessageSquare, Building2, History, Package, Truck, ShieldCheck, Clock, Box, Users, CheckCircle2, ExternalLink, Plus, CheckCircle, ChevronDown, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
// Restore necessary imports
// import type { InventoryItem } from "@/data/inventory-data" // Keep commented if unused
import { ordersData, type Order } from "@/data/orders-data"
import { type OrderItem, type Vendor } from "@/types/orders" // Import shared types

// Restore local Feedback interface
interface Feedback {
  hospitalName: string;
  rating: number;
  comment: string;
  date: string;
}

// Define SelectedVendorAction locally to match CreateOrderPage
interface SelectedVendorAction {
  itemId: string;
  vendor: Vendor; // Use the imported Vendor type
  action: 'add' | 'remove';
}

interface OrderDetailsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  item: OrderItem | null;
  alternativeVendors: Vendor[];
  setSelectedItems?: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  handleFindAlternatives?: (item: OrderItem) => void;
  loadingAlternatives?: { [key: string]: boolean };
  renderStars: (rating: number) => React.ReactNode;
  selectedVendors?: { [key: string]: string[] };
  setSelectedVendors?: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  setSelectedVendorActions?: React.Dispatch<React.SetStateAction<SelectedVendorAction[]>>; // Use the local SelectedVendorAction type
  onAddAlternativeVendor: (itemId: string, vendor: Vendor) => void;
}

const OrderDetailsOverlay: React.FC<OrderDetailsOverlayProps> = ({ 
  isOpen, 
  onClose, 
  item, 
  alternativeVendors,
  setSelectedItems,
  handleFindAlternatives,
  loadingAlternatives,
  renderStars,
  selectedVendors,
  setSelectedVendors,
  setSelectedVendorActions,
  onAddAlternativeVendor
}) => {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [localItem, setLocalItem] = useState<OrderItem | null>(null);
  // Restore productFeedback state
  const [productFeedback] = useState<{ [key: string]: Feedback[] }>({
    'default-feedback': [
      { hospitalName: "Dr. Smith", rating: 4.5, comment: "Excellent quality, would recommend", date: "2024-03-15" },
      { hospitalName: "Dr. Johnson", rating: 5, comment: "Best in class, very reliable", date: "2024-03-14" },
      { hospitalName: "Dr. Williams", rating: 4, comment: "Good product, slight delay in delivery", date: "2024-03-13" }
    ]
  });

  // Update localItem when item prop changes
  useEffect(() => {
    setLocalItem(item);
  }, [item]);

  const handleVendorSelect = (itemId: string, vendorName: string, vendor: Vendor) => {
    if (!localItem) return;

    // Update local state first
    const updatedVendors = localItem.vendors.map(v => ({
      ...v,
      status: {
        ...v.status,
        isSelected: v.id === vendor.id ? !v.status.isSelected : v.status.isSelected
      }
    }));

    const isNowSelected = updatedVendors.find(v => v.id === vendor.id)?.status.isSelected;

    setLocalItem({
      ...localItem,
      vendors: updatedVendors
    });

    // Update global state
    if (setSelectedItems) {
      setSelectedItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            vendors: updatedVendors,
            ...(isNowSelected ? {
              selectedVendorIds: [...new Set([...(item.selectedVendorIds || []), vendor.id])],
              selectedVendors: [...new Set([...(item.selectedVendors || []), vendor])]
            } : {
              selectedVendorIds: (item.selectedVendorIds || []).filter(id => id !== vendor.id),
              selectedVendors: (item.selectedVendors || []).filter(v => v.id !== vendor.id)
            })
          };
        }
        return item;
      }));
    }

    // Update the selectedVendors state
    if (setSelectedVendors) {
      setSelectedVendors(prev => {
        const currentIds = prev[itemId] || [];
        const isSelected = !currentIds.includes(vendor.id);
        
        return {
          ...prev,
          [itemId]: isSelected 
            ? [...currentIds, vendor.id]
            : currentIds.filter(id => id !== vendor.id)
        };
      });
    }

    // Update the selectedVendorActions state
    if (setSelectedVendorActions) {
      setSelectedVendorActions(prev => [
        ...prev,
        {
          itemId,
          vendor,
          action: isNowSelected ? 'add' : 'remove'
        }
      ]);
    }
  };

  // Handle click outside and ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      // Trigger chart animation when overlay opens
      const timer = setTimeout(() => setChartVisible(true), 300);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscKey);
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [isOpen, onClose]);

  // Reset chart visibility when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setChartVisible(false);
    }
  }, [isOpen]);

  if (!isOpen || !localItem) return null;

  return (
    <AnimatePresence>
      {isOpen && localItem && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Side Panel */}
          <motion.div
            ref={overlayRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 w-[calc(100%-32px)] max-w-[900px] bg-white shadow-lg z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Product Information</div>
                    <div className="text-lg font-semibold">{localItem.name}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tabs */}
                <div className="mt-4">
                  <nav className="flex space-x-8" aria-label="Order sections">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "details"
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Product Details
                    </button>
                    <button
                      onClick={() => setActiveTab("quotes")}
                      className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "quotes"
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Alternatives
                    </button>
                  </nav>
                </div>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {activeTab === "details" ? (
                    <>
                      {/* Item Overview Card */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="w-24 h-24 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <img
                                src={localItem.image || `/placeholder.svg`}
                                alt={localItem.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-lg">{localItem.name}</div>
                              <div className="text-sm text-muted-foreground">SKU: {localItem.sku}</div>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-sm">4.5 (24 reviews)</span>
                                </div>
                                {localItem.status === "Urgent" && (
                                  <Badge variant="destructive" className="h-5 px-1.5 py-0 text-xs font-normal">Urgent</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground">{localItem.description}</div>
                        </CardContent>
                      </Card>

                      {/* Product Specifications Card */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Product Specifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div>
                              <div className="text-muted-foreground mb-1">Manufacturer</div>
                              <div className="font-medium">{localItem.manufacturer || '--'}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-1">Category</div>
                              <div className="font-medium">{localItem.category || '--'}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-1">Status</div>
                              <div className="font-medium">{localItem.status || '--'}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-1">Packaging</div>
                              <div className="font-medium">{localItem.packaging || '--'}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-1">Current Stock</div>
                              <div className="font-medium">{localItem.currentStock ?? 0} / {localItem.totalStock ?? 0}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-1">Expires In</div>
                              <div className="font-medium">{localItem.expiresIn || '--'}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-1">Last Purchase Price</div>
                              <div className="font-medium">${localItem.lastPurchasePrice?.toFixed(2) || '--'}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-1">Current Unit Price</div>
                              <div className="font-medium">${localItem.unitPrice?.toFixed(2) || '--'}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-1">Required Units</div>
                              <div className="font-medium">{localItem.requiredUnits || '--'}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Transaction History Card */}
                      <Card>
                        <CardHeader 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setExpandedItems(prev => ({ ...prev, [localItem.id]: !prev[localItem.id] }))}
                        >
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Transaction History</CardTitle>
                            <Button variant="ghost" size="icon">
                              {expandedItems[localItem.id] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                        {expandedItems[localItem.id] && (
                          <CardContent>
                            <div className="space-y-4">
                              {ordersData
                                .filter((order: Order) => 
                                  order.items?.some((orderItem: { name: string }) => 
                                    orderItem.name === localItem.name
                                  )
                                )
                                .map((order: Order) => {
                                  const orderItem = order.items?.find((i: { name: string }) => i.name === localItem.name);
                                  return (
                                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                      <div className="space-y-1">
                                        <div className="font-medium">{order.id}</div>
                                        <div className="text-sm text-muted-foreground">{order.date}</div>
                                        <div className="text-sm">Department: {order.department}</div>
                                      </div>
                                      <div className="text-right space-y-1">
                                        <div className="font-medium">{orderItem?.quantity} units</div>
                                        <div className="text-sm text-muted-foreground">${orderItem?.price.toFixed(2)} per unit</div>
                                        <Badge 
                                          variant={
                                            order.status === "Completed" ? "default" :
                                            order.status === "Processing" ? "secondary" :
                                            order.status === "Cancelled" ? "destructive" :
                                            "outline"
                                          }
                                        >
                                          {order.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </CardContent>
                        )}
                      </Card>

                      {/* Feedback Card */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Feedback</CardTitle>
                          <CardDescription>Last 3 reviews from healthcare professionals</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {productFeedback['default-feedback'].map((feedback: Feedback, index: number) => (
                              <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">{feedback.hospitalName}</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs">{feedback.rating}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                                <span className="text-xs text-muted-foreground">{feedback.date}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : activeTab === "quotes" ? (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4">
                        {localItem.vendors.map((vendor) => {
                          const isCurrentVendor = vendor.status.isCurrentVendor;
                          const isSelected = vendor.status.isSelected;
                          
                          return (
                            <div
                              key={vendor.id}
                              className={cn(
                                "relative rounded-lg border p-4",
                                isCurrentVendor
                                  ? "border-blue-200 bg-blue-50"
                                  : isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary"
                              )}
                            >
                              <div className="flex items-start gap-4">
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                                  {vendor.image_url ? (
                                    <Image
                                      src={vendor.image_url}
                                      alt={vendor.name}
                                      className="object-contain"
                                      fill
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted">
                                      <Building2 className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{vendor.name}</h4>
                                        {vendor.compliance === "Hospital Approved" && (
                                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            Hospital Approved
                                          </Badge>
                                        )}
                                        {vendor.status.isCurrentVendor && (
                                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                            Current Vendor
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground">Product: {localItem.name}</p>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium text-lg">${vendor.pricePerUnit?.toFixed(2)}</div>
                                      {vendor.savings !== null && vendor.savings !== undefined && vendor.savings > 0 && (
                                        <div className="text-sm text-green-600">Save ${vendor.savings.toFixed(2)}</div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1">
                                        <Package className="h-4 w-4" />
                                        <span>Manufacturer: {vendor.manufacturer}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Truck className="h-4 w-4" />
                                        <span>Delivery: {vendor.delivery}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>Compliance: {vendor.compliance}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Shipping: {vendor.shipping}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Box className="h-4 w-4" />
                                        <span className="font-medium">Packaging: {vendor.packaging}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Hospital Usage Section */}
                                  {(vendor.notes?.hospitalUsage || vendor.notes?.recentPurchases) && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg space-y-2">
                                      <h5 className="font-medium text-blue-900 flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Hospital Usage
                                      </h5>
                                      {vendor.notes.hospitalUsage && (
                                        <p className="text-sm text-blue-700">
                                          <Users className="h-4 w-4 inline mr-2" />
                                          {vendor.notes.hospitalUsage}
                                        </p>
                                      )}
                                      {vendor.notes.recentPurchases && (
                                        <p className="text-sm text-blue-700">
                                          <History className="h-4 w-4 inline mr-2" />
                                          {vendor.notes.recentPurchases}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {/* Feedback Section */}
                                  {vendor.feedback && vendor.feedback.length > 0 && (
                                    <div className="mt-3 border-t pt-3">
                                      <h5 className="font-medium mb-2 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Recent Feedback
                                      </h5>
                                      <div className="space-y-2">
                                        {vendor.feedback.map((feedback, index) => (
                                          <div key={index} className="bg-muted/50 rounded-lg p-2 text-sm">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="font-medium">{feedback.hospitalName}</span>
                                              <div className="flex items-center gap-1">
                                                {renderStars(feedback.rating)}
                                                <span className="text-xs ml-1">{feedback.rating}</span>
                                              </div>
                                            </div>
                                            <p className="text-muted-foreground">{feedback.comment}</p>
                                            <span className="text-xs text-muted-foreground">{feedback.date}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 pt-2">
                                    <Button
                                      variant={vendor.status.isSelected ? "default" : "outline"}
                                      size="sm"
                                      className="gap-2"
                                      onClick={() => handleVendorSelect(localItem.id, vendor.name, vendor)}
                                    >
                                      {vendor.status.isSelected ? (
                                        <>
                                          <CheckCircle className="h-4 w-4" />
                                          Selected
                                        </>
                                      ) : (
                                        <>
                                          <Plus className="h-4 w-4" />
                                          Select
                                        </>
                                      )}
                                    </Button>
                                    {vendor.url && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => window.open(vendor.url, '_blank')}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        Website
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Fallback or other tabs if needed */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsOverlay; 