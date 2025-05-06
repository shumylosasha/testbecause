"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, FileUp, Loader2, Plus, Search, Trash2, TrendingDown, BookOpen, RefreshCw, ExternalLink, Sparkles, Star, StarHalf, MessageSquare, Mail, ChevronDown, MessageSquareText, Scale, Building2, History, AlertTriangle, FileText, ShoppingCart, BookmarkPlus, Package, DollarSign, X, ChevronRight, CheckCircle2, Clock, CheckCircle, PhoneCall, Filter, XCircle, ShieldCheck, ArrowUpDown, Minus, Truck, Box, Users, ClipboardList, AlertCircle, Calendar } from "lucide-react"
import { inventoryData } from "@/data/inventory-data"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import React from "react"
import { QuickActionsToolbar, useQuickActions } from "@/components/ui/quick-actions"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Send } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { InventoryItem } from "@/data/inventory-data"
import { ordersData, type Order } from "@/data/orders-data"
import Image from "next/image"
import { RFQDialog } from "./components/RFQDialog"
import OrderDetailsOverlay from "./components/OrderDetailsOverlay"
import { OrderSidebar } from "./components/OrderSidebar"
import { type Vendor, type OrderItem } from '@/types/orders';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"

interface Feedback {
  item: OrderItem;
  rating: number;
  comment: string;
  date: string;
}

interface SelectedVendorAction {
  itemId: string;
  vendor: Vendor;
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
  setSelectedVendorActions?: React.Dispatch<React.SetStateAction<SelectedVendorAction[]>>;
  onAddAlternativeVendor: (itemId: string, vendor: Vendor) => void;
}

interface RfqItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
}

interface VendorInfo {
  id: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface CommunicationPrefs {
  email: boolean;
  aiCall: boolean;
}

interface Swap {
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  compliance: string;
  vendor: {
    id: string;
    name: string;
  };
  pricePerUnit: number;
  packaging: string;
  delivery?: string;
  vendor_image_url?: string;
  isDefault?: boolean;
}

interface BaseItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  price?: number;
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

const VENDOR_LOGOS = {
  "MedSupply Inc.": "https://medsupplyinc.com/images/medsupply-logo-min.png",
  "Hospital Direct": "https://www.hospitaldirect.co.uk/wp-content/uploads/2022/11/hlogo-300x225.png",
  "McKesson": "https://www.mckesson.com/assets/img/mckesson-logo.svg",
  "Medline": "https://upload.wikimedia.org/wikipedia/en/thumb/8/89/Medline-logo.svg/800px-Medline-logo.svg.png",
  "Medline Industries": "https://upload.wikimedia.org/wikipedia/en/thumb/8/89/Medline-logo.svg/800px-Medline-logo.svg.png",
  "Cardinal Health": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS23ZIzL4CaSyyP-GT5XpkCDnF5hgfzJP9I6Q&s",
  "Henry Schein": "https://www.henryschein.com/images/hs-logo.svg",
  "Owens & Minor": "https://www.owens-minor.com/wp-content/themes/owens-minor/assets/images/om-logo.svg",
  "Becton Dickinson": "https://www.bd.com/assets/images/bd-logo.svg",
  "PPE Direct": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTpI8MV2cGuu0DNQGnsswtmsjP7Cxi19uN-Q&s",
  "3M Healthcare": "https://upload.wikimedia.org/wikipedia/commons/f/f3/3M_wordmark.svg",
  "3M Medical": "https://cdn-icons-png.flaticon.com/512/5968/5968227.png",
  "Abbott Nutrition": "https://www.abbott.com/content/dam/abbott/common/abbott-logo.svg",
  "Bard Medical": "https://www.bd.com/assets/images/bard-medical-logo.png",
  "Baxter Healthcare": "https://upload.wikimedia.org/wikipedia/commons/1/13/Baxter_logo.svg",
  "BD Medical": "https://www.bd.com/assets/images/bd-medical-logo.png",
  "Cardinal Health Inc": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS23ZIzL4CaSyyP-GT5XpkCDnF5hgfzJP9I6Q&s",
  "Corning Inc": "https://www.corning.com/content/dam/corning/logo.png",
  "Dasco Label": "https://www.dascolabel.com/images/dasco-label-logo.png",
  "International Paper": "https://www.internationalpaper.com/content/dam/internationalpaper/logo.png",
  "Maquet Inc": "https://www.getinge.com/dam/corporate/logo.png",
  "Philips Healthcare": "https://www.philips.com/c-dam/corporate/philips-logo.svg",
  "Sage Products": "https://sageproducts.com/wp-content/themes/sage-products/images/sage-logo.png",
  "Westmed": "https://www.westmedinc.com/images/westmed-logo.png",
  "Medtronic": "https://www.medtronic.com/content/dam/medtronic-com/global/logos/medtronic-logo.svg",
  "B. Braun Medical": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAfu91Q-iow7TzzN3kWIGi-iL5-PhpR5_IVw&s",
  "B. Braun": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAfu91Q-iow7TzzN3kWIGi-iL5-PhpR5_IVw&s",
  "3D Medical": "https://www.mpo-mag.com/wp-content/uploads/sites/7/2023/07/047_main.jpg",
  "default": "https://res.cloudinary.com/dk2/image/upload/v1/medical-supplies/vendors/default.png"
};

const getVendorLogo = (vendorName: string): string => {
  // First try to get the exact match
  const exactMatch = VENDOR_LOGOS[vendorName as keyof typeof VENDOR_LOGOS];
  if (exactMatch) return exactMatch;

  // If no exact match, try to find a partial match by normalizing strings
  const normalizedVendorName = vendorName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const partialMatch = Object.entries(VENDOR_LOGOS).find(([key]) => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Check both directions and handle common abbreviations
    return normalizedVendorName.includes(normalizedKey) || 
           normalizedKey.includes(normalizedVendorName) ||
           // Handle special cases like "3M" vs "3M Healthcare"
           (normalizedKey.startsWith('3m') && normalizedVendorName.startsWith('3m')) ||
           // Handle cases where Inc/Corp/Ltd might be omitted
           normalizedKey.split('inc')[0] === normalizedVendorName.split('inc')[0];
  });
  
  return partialMatch ? partialMatch[1] : VENDOR_LOGOS.default;
};

const MOCK_ALTERNATIVES = {
  "default": [
    {
      name: "Medline",
      productName: "Similar Product",
      price: 85.99,
      savings: 14.00,
      delivery: "2-3 days",
      packaging: "Standard",
      isSelected: false,
      url: "#",
      image_url: null,
      id: "medline-1",
      contactEmail: "sales@medline.com",
      contactPhone: "1-800-MEDLINE",
      certifications: ["ISO 13485", "FDA Registered", "CE Marked"],
      reviews: {
        rating: 4.7,
        count: 128,
        recentReviews: [
          {
            rating: 5,
            comment: "Excellent quality and reliable delivery",
            date: "2024-03-15",
            reviewer: "Dr. Smith"
          },
          {
            rating: 4,
            comment: "Good product, slightly delayed shipping",
            date: "2024-03-10",
            reviewer: "Dr. Johnson"
          }
        ]
      },
      notes: [
        "Bulk discounts available for orders over 100 units",
        "Free shipping on orders over $500",
        "24/7 customer support available"
      ],
      complianceStatus: "Fully Compliant",
      warranty: "1 year manufacturer warranty",
      returnPolicy: "30-day return policy",
      minimumOrderQuantity: 10,
      bulkDiscounts: [
        { quantity: 50, discount: 5 },
        { quantity: 100, discount: 10 },
        { quantity: 200, discount: 15 }
      ],
      onTimeDeliveryRate: 98.5,
      fillRate: 99.2,
      qualityRating: 4.7,
    },
    {
      name: "McKesson",
      productName: "Premium Alternative",
      price: 92.99,
      savings: 7.00,
      delivery: "1-2 days",
      packaging: "Premium",
      isSelected: false,
      url: "#",
      image_url: null,
      id: "mckesson-1",
      contactEmail: "sales@mckesson.com",
      contactPhone: "1-800-MCKESSON",
      certifications: ["ISO 9001", "FDA Registered", "GxP Compliant"],
      reviews: {
        rating: 4.9,
        count: 256,
        recentReviews: [
          {
            rating: 5,
            comment: "Premium quality and exceptional service",
            date: "2024-03-14",
            reviewer: "Dr. Williams"
          },
          {
            rating: 5,
            comment: "Fast delivery and great customer support",
            date: "2024-03-12",
            reviewer: "Dr. Brown"
          }
        ]
      },
      notes: [
        "Next-day delivery available",
        "Custom packaging options",
        "Dedicated account manager"
      ],
      complianceStatus: "Fully Compliant",
      warranty: "2 year manufacturer warranty",
      returnPolicy: "45-day return policy",
      minimumOrderQuantity: 5,
      bulkDiscounts: [
        { quantity: 25, discount: 5 },
        { quantity: 50, discount: 10 },
        { quantity: 100, discount: 15 }
      ],
      onTimeDeliveryRate: 99.0,
      fillRate: 99.5,
      qualityRating: 4.9,
    },
    {
      name: "Cardinal Health",
      productName: "Value Option",
      price: 79.99,
      savings: 20.00,
      delivery: "3-4 days",
      packaging: "Bulk",
      isSelected: false,
      url: "#",
      image_url: null,
      id: "cardinal-1",
      contactEmail: "sales@cardinalhealth.com",
      contactPhone: "1-800-CARDINAL",
      certifications: ["ISO 13485", "FDA Registered", "cGMP Compliant"],
      reviews: {
        rating: 4.5,
        count: 89,
        recentReviews: [
          {
            rating: 4,
            comment: "Good value for money",
            date: "2024-03-13",
            reviewer: "Dr. Davis"
          },
          {
            rating: 5,
            comment: "Reliable supplier with competitive pricing",
            date: "2024-03-11",
            reviewer: "Dr. Miller"
          }
        ]
      },
      notes: [
        "Best value for bulk orders",
        "Extended payment terms available",
        "Regular stock availability"
      ],
      complianceStatus: "Fully Compliant",
      warranty: "1 year manufacturer warranty",
      returnPolicy: "30-day return policy",
      minimumOrderQuantity: 20,
      bulkDiscounts: [
        { quantity: 100, discount: 5 },
        { quantity: 200, discount: 10 },
        { quantity: 500, discount: 20 }
      ]
    }
  ]
};

// Add a mapping of random default specifications for some items
const defaultSpecifications: { [key: string]: string } = {
  'item-1': 'Must be compliant with ASTM D3578 and EN 455 standards',
  'item-2': 'Safety-engineered feature to prevent needlestick injuries, sterile, individually packaged',
  'item-3': 'ASTM F2100 Level 3, with ear loops, >98% bacterial filtration efficiency',
  'item-4': 'Latex-free, powder-free, textured fingertips for enhanced grip',
  'item-5': 'Disposable, non-sterile, ambidextrous, beaded cuff',
};

export default function CreateOrderPage() {
  const router = useRouter()
  const { setRightActions } = useQuickActions()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)
  const [isDetailsOverlayOpen, setIsDetailsOverlayOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [loadingAlternatives, setLoadingAlternatives] = useState<{ [key: string]: boolean }>({})
  const [alternativeVendors, setAlternativeVendors] = useState<{ [key: string]: any[] }>({})
  const [plannedWebsites, setPlannedWebsites] = useState<string[]>([])
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([])
  const [showWebsiteSelector, setShowWebsiteSelector] = useState<{ [key: string]: boolean }>({})
  const [selectedVendors, setSelectedVendors] = useState<{ [key: string]: string[] }>({})
  const [aiRecommendations, setAiRecommendations] = useState<{ [key: string]: string }>({})
  const [showFeedback, setShowFeedback] = useState<{ [key: string]: boolean }>({})
  const [activeTab, setActiveTab] = useState("order")
  const [showAISuggestions, setShowAISuggestions] = useState(true)
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState<string>("Net 30")
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string>("3-5 days")
  const [showFilters, setShowFilters] = useState(false)
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState<string>("")
  const [orderDescription, setOrderDescription] = useState<string>("")
  const filtersRef = useRef<HTMLDivElement>(null)
  const [selectedVendorActions, setSelectedVendorActions] = useState<SelectedVendorAction[]>([])
  const [rfqItems, setRfqItems] = useState<RfqItem[]>([])
  const [rfqNotes, setRfqNotes] = useState<string>("")
  const [communicationPrefs, setCommunicationPrefs] = useState<{ [vendorId: string]: CommunicationPrefs }>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sendStatus, setSendStatus] = useState<string | null>(null)
  const [csvItems, setCsvItems] = useState<any[]>([]);
  const [groupBy, setGroupBy] = useState<string>("none"); // State for grouping
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({}); // State for expanded items
  const [isAISuggestionsOverlayOpen, setIsAISuggestionsOverlayOpen] = useState(false)
  const [aiSuggestedItems, setAiSuggestedItems] = useState<any[]>([])
  const [loadingAISuggestions, setLoadingAISuggestions] = useState(false)
  const [showRfqDialog, setShowRfqDialog] = useState(false)
  const [isGeneratingRfq, setIsGeneratingRfq] = useState(false)
  // Add these state variables near the top with other state declarations
  const [selectedUnits, setSelectedUnits] = useState<{ [key: string]: string }>({})
  const [specifications, setSpecifications] = useState<{ [key: string]: string }>({})
  const [expandedAIInsights, setExpandedAIInsights] = useState(false); // Initialize as collapsed
  const [selectedDepartment, setSelectedDepartment] = useState("surgery")
  const [expandedBudget, setExpandedBudget] = useState(false); // Add this state for budget expansion
  // Add a new state for tracking item departments
  const [itemDepartments, setItemDepartments] = useState<{ [key: string]: string }>({})

  // Add department options
  const departmentOptions = [
    "Cardiology",
    "Emergency",
    "Laboratory",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Radiology",
    "Surgery",
    "General"
  ]

  // Add these constants for the unit options
  const unitOptions = ["pieces", "pairs", "boxes", "sets", "kits", "units", "meters", "liters", "kilograms"]

  // Payment terms options
  const paymentTermsOptions = ["Net 30", "Net 45", "Net 60", "Net 90", "Due on Receipt"]
  
  // Delivery time options
  const deliveryTimeOptions = ["1-2 days", "2-3 days", "3-5 days", "5-7 days", "7-10 days", "10-14 days"]

  const filteredItems = inventoryData.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSearch = () => {
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
    }, 800)
  }

  // Update the getItemFromInventory function
  const getItemFromInventory = (itemId: string): any => {
    return inventoryData.find(item => item.id === itemId);
  };

  // Update the addItemToOrder function
  const addItemToOrder = (item: InventoryItem) => {
    if (!selectedItems.some((i) => i.id === item.id)) {
      // Create vendor objects for all vendors in the array
      const defaultVendor = item.vendors[0]; // Use first vendor as default
      
      // Ensure the item conforms to OrderItem structure
      const newItem: OrderItem = {
        ...item, // Spread InventoryItem props
        quantity: 1, // Add quantity explicitly
        unit: 'units', // Set default unit
        price: item.unitPrice || 0, // Use unitPrice from InventoryItem for price
        vendors: item.vendors.map(v => ({ // Map vendors with status
          ...v,
          status: {
            isCurrentVendor: v.id === defaultVendor.id, // Compare IDs for reliability
            isSelected: v.id === defaultVendor.id
          }
        })),
        selectedVendor: { // Set selectedVendor object
          ...defaultVendor,
          status: {
            isCurrentVendor: true,
            isSelected: true
          }
        },
        selectedVendorIds: [defaultVendor.id], // Set selectedVendorIds array
        selectedVendors: [{ // Set selectedVendors array
          ...defaultVendor,
          status: {
            isCurrentVendor: true,
            isSelected: true
          }
        }]
        // Ensure required BaseItem fields like unit/price are included if needed
        // unit: item.unit, // Example if unit is required on OrderItem
        // price: item.price, // Example if price is required on OrderItem
      };
      setSelectedItems((prevItems) => [...prevItems, newItem]);
      setSearchQuery("");
      // Prefill specifications if available
      setSpecifications(prev => ({
        ...prev,
        [item.id]: defaultSpecifications[item.id] || ""
      }));
    }
  };

  const removeItemFromOrder = (itemId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId))
  }

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setSelectedItems(selectedItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.selectedVendor?.price || 0) * item.quantity, 0)
  }

  const handleFindAlternatives = async (item: OrderItem) => {
    try {
      // Simulate API call with mock data
      const alternatives = MOCK_ALTERNATIVES.default.map(vendor => ({
          ...vendor,
        status: {
          isCurrentVendor: vendor.id === item.currentVendor,
          isSelected: vendor.id === item.selectedVendor?.id
        }
      }));
      
      setAlternativeVendors(prev => ({
        ...prev,
        [item.id]: alternatives
      }));
    } catch (error) {
      console.error('Error finding alternatives:', error);
    }
  };

  // Helper function to generate realistic-looking AI recommendations
  const generateAlternativesRecommendation = (currentPrice: number, alternatives: Vendor[]) => {
    const bestPrice = Math.min(...alternatives.map(v => v.price || Infinity));
    const bestSavings = currentPrice - bestPrice;
    const bestVendor = alternatives.find(v => v.price === bestPrice);
    
    if (bestSavings > 0) {
      const savingsPercent = Math.round((bestSavings / currentPrice) * 100);
      return `I've found ${alternatives.length} alternative suppliers for this item. ${bestVendor?.name} offers the best price at $${bestPrice.toFixed(2)}, saving you $${bestSavings.toFixed(2)} per unit (${savingsPercent}% discount). ${bestVendor?.delivery} delivery is available, and they maintain a ${bestVendor?.qualityRating}/5 quality rating.`;
    } else {
      return `I've analyzed ${alternatives.length} alternative suppliers for this item. Your current price of $${currentPrice.toFixed(2)} appears to be competitive. I recommend checking for bulk discounts to further reduce your costs.`;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return stars;
  };

  const handleGenerateRFQ = () => {
    setShowRfqDialog(true);
  };

  const handleSendRFQ = async (data: {
    items: { id: string; quantity: number }[];
    vendors: { id: string; sendEmail: boolean; initiateAiCall: boolean }[];
    notes: string;
  }) => {
    setIsGeneratingRfq(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store for navigation to the RFQ page
      sessionStorage.setItem('rfqDataForPreparation', JSON.stringify({
        id: `RFQ-${Date.now()}`,
        created: new Date().toISOString(),
        status: "Draft",
        items: data.items,
        vendors: data.vendors,
        notes: data.notes
      }));
      
      router.push('/orders/quotes/create');
    } catch (error) {
      console.error('Error generating RFQ:', error);
    } finally {
      setIsGeneratingRfq(false);
    }
  };

  // Set up the right actions for the quick actions toolbar conditionally
  useEffect(() => {
    let rightActionContent: React.ReactNode = (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full bg-white text-black hover:bg-white/90 hover:text-black active:bg-white/80 flex items-center gap-2"
          onClick={handleImportCSV}
        >
          <FileUp className="h-4 w-4" />
          <span>Upload File</span>
        </Button>
        {selectedItems.length > 0 && (
          <Button
            size="sm"
            className="gap-2"
            onClick={handleGenerateRFQ}
          >
            <ShoppingCart className="h-4 w-4" />
            Generate RFQ
          </Button>
        )}
      </div>
    );

    setRightActions(rightActionContent);

    // Clean up the actions when the component unmounts or dependencies change
    return () => {
      setRightActions(null);
    };
  }, [setRightActions, selectedItems]);

  const renderVendorOptions = (item: InventoryItem) => {
    const filteredVendors = item.vendors.filter(vendor => 
      vendor.status.isSelected || vendor.status.isCurrentVendor
    );
    
    return (
      <div className="space-y-2">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className={`p-2 rounded-lg border ${
              vendor.status.isCurrentVendor
                ? 'bg-blue-50 border-blue-200'
                : vendor.status.isSelected
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {vendor.image_url && (
                  <img
                    src={vendor.image_url}
                  alt={vendor.name}
                    className="w-8 h-8 rounded-full object-cover"
                />
                )}
                <span className="font-medium">{vendor.name}</span>
              </div>
              <div className="text-sm text-gray-600">
                {vendor.pricePerUnit && ( // Use pricePerUnit
                  <span className="font-medium">${vendor.pricePerUnit.toFixed(2)}</span> // Use pricePerUnit
                )}
                {vendor.savings && vendor.savings > 0 && (
                  <span className="ml-2 text-green-600">
                    (Save ${vendor.savings.toFixed(2)})
                  </span>
                    )}
                  </div>
                </div>
            </div>
          ))}
      </div>
    );
  };

  const handleCommunicationChange = (vendorId: string, method: keyof CommunicationPrefs, checked: boolean) => {
    setCommunicationPrefs(prev => ({
      ...prev,
      [vendorId]: {
        ...prev[vendorId],
        [method]: checked,
      },
    }));
  };

  const handleInitiateSendProcess = async () => {
    setError(null);
    setSendStatus('sending');
    setIsProcessing(true);

    const payload = {
      items: rfqItems.map(item => ({ id: item.id, quantity: item.quantity })),
      vendors: Object.values(selectedVendors).flatMap(vendors => vendors.map(vendor => ({
        id: vendor,
        sendEmail: communicationPrefs[vendor]?.email ?? false,
        initiateAiCall: communicationPrefs[vendor]?.aiCall ?? false,
      }))).filter(v => v.sendEmail || v.initiateAiCall),
      notes: rfqNotes,
    };

    if (payload.vendors.length === 0) {
        setError("Please select at least one communication method for a vendor.");
        setSendStatus('error');
        setIsProcessing(false);
        return;
    }

    console.log("Sending RFQ Payload:", JSON.stringify(payload, null, 2));

    // --- TODO: Replace with actual API Call ---
    try {
      // const response = await fetch('/api/rfq/send', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      // MOCK API Call
       await new Promise(resolve => setTimeout(resolve, 2000));
       const success = Math.random() > 0.1; // Simulate 90% success rate
       if (!success) throw new Error('Simulated API Error: Failed to dispatch RFQ.');

      // if (!response.ok) {
      //    const errorData = await response.json();
      //    throw new Error(errorData.message || 'Failed to send RFQ and initiate actions.');
      // }
      
      setSendStatus('sent');
      // Optional: Redirect after a short delay
      setTimeout(() => {
         router.push('/orders'); // Or a dedicated RFQ tracking page
      }, 2500);

    } catch (err: any) {
      console.error("RFQ Send Error:", err);
      setError(err.message || "An unexpected error occurred.");
      setSendStatus('error');
    } finally {
      setIsProcessing(false); 
      // Keep processing true if redirecting immediately? Depends on desired UX.
      // If showing 'sent' status for a bit, set processing to false here.
    }
    // --- End of API Call Section ---
  };
  const getActiveActionsCount = (vendorId: string): number => {
      return selectedVendors[vendorId]?.length || 0;
  };

  // *** NEW FUNCTION for navigating to Order Confirmation ***
  const handleProceedToOrderConfirmation = () => {
    // Ensure items have been added
    if (selectedItems.length === 0) {
      console.warn("No items in order to proceed.");
      // Optionally show a user message/toast
      return;
    }

    // Ensure each item has a selected vendor (or handle cases where it might not)
    const itemsWithVendors = selectedItems.filter(item => 
        item.selectedVendor && 
        item.selectedVendor.pricePerUnit !== undefined && 
        item.selectedVendor.pricePerUnit !== null
    );
    if (itemsWithVendors.length !== selectedItems.length) {
        console.warn("Some items are missing a selected vendor or vendor price. Cannot proceed.");
        // Show user message explaining which items need attention
        alert("Please ensure every item has a selected vendor with a price before creating the order."); 
        return;
    }

    // Prepare the final order data
    const finalOrderData = {
      items: itemsWithVendors.map(item => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.selectedVendor?.pricePerUnit, // Use pricePerUnit
        vendorId: item.selectedVendor?.id || item.selectedVendor?.name, 
        vendorName: item.selectedVendor?.name,
      })),
      totalAmount: calculateTotal(), 
    };

    try {
      // Store the final order data for the confirmation page
      sessionStorage.setItem('finalOrderDataForConfirmation', JSON.stringify(finalOrderData));
      
      // Navigate to the order confirmation page
      router.push('/orders/create/confirm'); 
    } catch (error) {
        console.error("Error storing final order data or navigating:", error);
        alert("Failed to proceed to order confirmation. Please try again.");
    }
  };

  // *** NEW Handler for the "Continue" button in the Summary Card ***
  const handleProceedToContactMethod = () => {
    // --- Validation ---
    if (selectedItems.length === 0) {
      console.warn("No items in order to proceed.");
      alert("Please add items to your order first."); // User feedback
      return;
    }
    // Ensure every item has a finalized selected vendor before proceeding
    const itemsWithVendors = selectedItems.filter(item => 
        item.selectedVendor && 
        item.selectedVendor.pricePerUnit !== undefined && 
        item.selectedVendor.pricePerUnit !== null
    );
    if (itemsWithVendors.length !== selectedItems.length) {
        console.warn("Some items are missing a selected vendor or vendor price.");
        alert("Please ensure every item has a finalized selected vendor with a price before continuing."); 
        return;
    }

    // --- Prepare Data for Next Step ---
    const contactMethodData = {
      items: itemsWithVendors.map(item => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.selectedVendor?.pricePerUnit, // Use pricePerUnit
        image: item.image, 
        vendor: { 
          id: item.selectedVendor?.id || item.selectedVendor?.name, 
          name: item.selectedVendor?.name, 
          contactEmail: item.selectedVendor?.contactEmail, 
        }
      })),
      totalAmount: calculateTotal(), 
    };

    // --- Store Data and Navigate ---
    try {
      // Use sessionStorage to pass data to the next client page
      sessionStorage.setItem('orderDataForContactMethod', JSON.stringify(contactMethodData));
      // Navigate to the new contact method selection page
      router.push('/orders/create/contact-method'); 
    } catch (error) {
      console.error("Error storing contact method data or navigating:", error);
      alert("Failed to proceed. Please check console or try again."); // User feedback
    }
  };

  // Handle click outside for filters dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showFilters])

  const handleImportCSV = () => {
    // Transform inventory data to match the expected format for selected items
    const importedItems: OrderItem[] = inventoryData.map(item => { // Explicitly type mapped array
      const defaultVendor = item.vendors[0];
      return {
        ...item, // Spread InventoryItem
        quantity: 1,
        unit: 'units', // Set default unit
        price: item.unitPrice || 0, // Use unitPrice from InventoryItem for price
        vendors: item.vendors.map(v => ({ // Map vendors with status
          ...v,
          status: {
            isCurrentVendor: v.id === defaultVendor.id,
            isSelected: v.id === defaultVendor.id
          }
        })),
        selectedVendor: { // Set selectedVendor object
          ...defaultVendor,
          status: {
            isCurrentVendor: true,
            isSelected: true
          }
        },
        selectedVendorIds: [defaultVendor.id],
        selectedVendors: [{ // Set selectedVendors array
          ...defaultVendor,
          status: {
            isCurrentVendor: true,
            isSelected: true
          }
        }]
        // Ensure all required OrderItem fields are present if OrderItem adds more than InventoryItem
      };
    });
    
    setCsvItems(importedItems);
    setSelectedItems(importedItems); // Should now accept OrderItem[]
  };

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleVendorSelect = (itemId: string, vendorName: string, vendor: Vendor) => {
    if (!selectedItem) return;

    // Update local state first
    const updatedVendors = selectedItem.vendors.map(v => ({
      ...v,
      status: {
        ...v.status,
        isSelected: v.id === vendor.id ? !v.status.isSelected : v.status.isSelected
      }
    }));

    setSelectedItem({
      ...selectedItem,
      vendors: updatedVendors
    });

    // Update global state
    setSelectedItems?.(prev => prev.map(item => { // Use optional chaining for setSelectedItems
      if (item.id === itemId) {
        return {
          ...item,
          vendors: updatedVendors,
          ...(updatedVendors.find(v => v.id === vendor.id)?.status.isSelected ? {
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
          action: 'add'
        }
      ]);
    }
  };

  // New function to add alternative vendors to the main item list
  const handleAddAlternativeVendor = (itemId: string, vendorToAdd: Vendor) => {
    setSelectedItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          // Check if vendor already exists
          const currentSelectedVendors = item.selectedVendors || []; // Default to empty array
          const vendorExists = currentSelectedVendors.some(v => v.id === vendorToAdd.id || v.name === vendorToAdd.name);
          if (!vendorExists) {
            // Add the new vendor, ensuring isDefault is false
            return {
              ...item,
              selectedVendors: [...currentSelectedVendors, { ...vendorToAdd, isDefault: false, status: { isCurrentVendor: false, isSelected: false} }] 
            };
          }
        }
        return item;
      })
    );
    // Optionally close the overlay or give feedback
    // setIsDetailsOverlayOpen(false);
  };

  // Add this function after the other handlers
  const handleOpenAISuggestions = async () => {
    try {
      setLoadingAISuggestions(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate mock AI suggested items based on recent activity
      const suggestedItems = inventoryData
        .filter(item => Math.random() > 0.7) // Randomly select some items
        .map(item => ({
          ...item,
          reason: [
            "Based on your recent orders",
            "Similar to items you frequently purchase",
            "Low stock alert",
            "Price drop detected",
            "New product available"
          ][Math.floor(Math.random() * 5)]
        }))
      
      setAiSuggestedItems(suggestedItems)
      setIsAISuggestionsOverlayOpen(true)
    } catch (error) {
      console.error('Error loading AI suggestions:', error)
    } finally {
      setLoadingAISuggestions(false)
    }
  }

  const handleAddSuggestedItem = (item: any) => {
    addItemToOrder(item)
    setAiSuggestedItems(prev => prev.filter(i => i.id !== item.id))
  }

  return (
    <>
      <div className="flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6 min-w-0"> {/* Added min-w-0 to prevent flex child from growing beyond parent */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-medium">Order #ORD-2023-001</h1>
              <Badge variant="outline" className="text-xs">Draft</Badge>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b mb-6">
          <nav className="flex space-x-8" aria-label="Order sections">
            <button
              onClick={() => setActiveTab("order")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "order"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Order
            </button>
            <button
              onClick={() => setActiveTab("quotes")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "quotes"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Quotes
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "order" && (
            <>
              {/* Search Card */}
              <Card>
                <CardContent className="space-y-6">
                  <div className="flex gap-2 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, SKU, or category..."
                        className="pl-12 h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                    {/* Search Results */}
                  {searchQuery && (
                    <div className="border rounded-md">
                      {isSearching ? (
                        <div className="flex justify-center items-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : filteredItems.length > 0 ? (
                        <div className="divide-y">
                          {filteredItems.map((item) => (
                            <div 
                              key={item.id} 
                              className="p-3 grid grid-cols-[auto,1fr,auto,auto,auto] gap-4 items-center hover:bg-muted/50 cursor-pointer"
                              onClick={() => addItemToOrder(item)}
                            >
                              {/* Product Image */}
                              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                                <img
                                  src={item.image || `/placeholder.svg?height=48&width=48`}
                                  alt={item.name}
                                  className="max-w-full max-h-full object-contain p-1"
                                />
                              </div>
                              
                              {/* Product Name */}
                              <div className="min-w-[200px]">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{item.name}</span>
                                  {item.status === "Urgent" && (
                                    <Badge variant="destructive" className="h-5 px-1.5 py-0 text-xs font-normal">Urgent</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{item.sku}</div>
                              </div>

                              {/* Stock */}
                              <div className="text-sm text-center">
                                <div className="font-medium">{item.currentStock ?? 0}/{item.totalStock ?? 0}</div> {/* Use ?? */}
                                <div className="text-muted-foreground">in stock</div>
                              </div>

                              {/* Supplier & Price */}
                              <div className="text-right min-w-[150px]">
                                <div className="font-medium">{item.vendors[0]?.name || 'N/A'}</div> {/* Use first vendor name */}
                                <div className="text-sm text-muted-foreground">${item.unitPrice?.toFixed(2) ?? 'N/A'} per unit</div> {/* Use optional chaining */}
                              </div>

                              {/* Add Button */}
                              <Button
                                size="sm"
                                disabled={selectedItems.some((i) => i.id === item.id)}
                                className="w-[80px]"
                              >
                                {selectedItems.some((i) => i.id === item.id) ? "Added" : "Add"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          No items found. Try a different search term.
                        </div>
                      )}
                    </div>
                  )}
                  </CardContent>
                </Card>

                  {/* Selected Items Table */}
                  {selectedItems.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                <ArrowUpDown className="h-4 w-4" />
                                Group by
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuRadioGroup value={groupBy} onValueChange={setGroupBy}>
                                <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="vendor">Vendor</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="category">Category</DropdownMenuRadioItem>
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative w-full overflow-auto">
                        <div className="w-[2000px] min-w-full">
                          {/* <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-20"></div> */}
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[400px]">Product Details</TableHead>
                              <TableHead className="w-[140px]">SKU</TableHead>
                              <TableHead className="w-[200px]">Vendor</TableHead>
                              <TableHead className="w-[120px] text-center">Hospital Feedback</TableHead>
                              <TableHead className="w-[100px] text-center">Quantity</TableHead>
                              <TableHead className="w-[100px]">Unit</TableHead>
                              <TableHead className="w-[150px]">Department</TableHead>
                              <TableHead className="w-[200px]">Specifications</TableHead>
                              <TableHead className="w-[150px]">Payment Terms</TableHead>
                              <TableHead className="w-[150px]">Delivery</TableHead>
                              <TableHead className="w-[40px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(() => {
                              if (groupBy === "vendor") {
                                // Group items by vendor
                                const groupedItems = selectedItems.reduce<{ [key: string]: typeof selectedItems }>((acc, item) => {
                                  // Get the vendor name from either the selected vendor or the first vendor in the vendors array
                                  const vendorName = item.selectedVendor?.name || 
                                                    (item.vendors && item.vendors[0]?.name) || 
                                                    "Unassigned";
                                  
                                  if (!acc[vendorName]) {
                                    acc[vendorName] = [];
                                  }
                                  acc[vendorName].push(item);
                                  return acc;
                                }, {});

                                return Object.entries(groupedItems).map(([vendorName, items]) => (
                                  <React.Fragment key={vendorName}>
                                    {/* Vendor Group Header */}
                                    <TableRow className="bg-muted/50">
                                      <TableCell colSpan={10} className="py-2">
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-full bg-white border flex items-center justify-center">
                                            <img
                                              src={getVendorLogo(vendorName)}
                                              alt={vendorName}
                                              className="w-full h-full object-contain p-1"
                                            />
                                          </div>
                                          <span className="font-medium">{vendorName}</span>
                                          <Badge variant="outline" className="ml-2">
                                            {items.length} items
                                          </Badge>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                    {/* Vendor Items */}
                                    {items.map((item) => (
                                      <React.Fragment key={item.id}>
                                        <TableRow
                                          className="cursor-pointer hover:bg-muted/50"
                                          onClick={() => {
                                            setSelectedItem(item);
                                            setIsDetailsOverlayOpen(true);
                                          }}
                                        >
                                          <TableCell>
                                            <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <img
                                                  src={item.image || `/placeholder.svg?height=32&width=32`}
                                                  alt={item.name}
                                                  className="max-w-full max-h-full object-contain"
                                                />
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                  <span className="font-medium text-sm">{item.name}</span>
                                                  {item.status === "Urgent" && (
                                                    <Badge variant="destructive" className="h-5 px-1.5 py-0 text-xs font-normal">Urgent</Badge>
                                                  )}
                                                </div>
                                                <div className="text-sm text-muted-foreground line-clamp-2">
                                                  {item.description}
                                                </div>
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell>{item.sku}</TableCell>
                                          <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                              {item.vendors
                                                .filter(vendor => vendor.status.isSelected || vendor.status.isCurrentVendor)
                                                .map((vendor, index) => (
                                                <div 
                                                    key={`${item.id}-${vendor.name}`}
                                                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${
                                                      vendor.status.isCurrentVendor 
                                                        ? "bg-blue-50 border-blue-200" 
                                                        : vendor.status.isSelected
                                                        ? "bg-primary/5 border-primary"
                                                        : "bg-gray-50 border-gray-200"
                                                  }`}
                                                >
                                                  <div className="relative h-4 w-4 rounded-full overflow-hidden border bg-white">
                                                    <img
                                                        src={vendor.image_url || getVendorLogo(vendor.name)}
                                                      alt={vendor.name}
                                                      className="w-full h-full object-contain p-0.5"
                                                    />
                                                  </div>
                                                  <span className={`text-xs font-medium ${
                                                      vendor.status.isCurrentVendor 
                                                        ? "text-blue-700" 
                                                        : vendor.status.isSelected
                                                        ? "text-primary"
                                                        : "text-gray-700"
                                                  }`}>
                                                    {vendor.name}
                                                  </span>
                                                </div>
                                              ))}
                                              {/* Add badge showing number of unselected vendors */}
                                              {(() => {
                                                const unselectedCount = item.vendors.filter(
                                                  v => !v.status.isSelected && !v.status.isCurrentVendor
                                                ).length;
                                                if (unselectedCount > 0) {
                                                  return (
                                                    <div 
                                                      className="flex items-center gap-1 px-2 py-1 rounded-full border border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedItem(item);
                                                        setIsDetailsOverlayOpen(true);
                                                      }}
                                                    >
                                                      <Plus className="h-3 w-3 text-gray-500" />
                                                      <span className="text-xs text-gray-500 font-medium">
                                                        {unselectedCount}
                                                      </span>
                                                    </div>
                                                  );
                                                }
                                                return null;
                                              })()}
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                              <span className="text-sm text-muted-foreground">4.5 (24)</span>
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            <Input
                                              type="number"
                                              min="1"
                                              value={item.quantity || 1}
                                              onChange={(e) => {
                                                e.stopPropagation();
                                                updateItemQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1));
                                              }}
                                              onClick={(e) => e.stopPropagation()}
                                              className="h-7 w-24 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                                  {selectedUnits[item.id] || "Select unit"}
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                <DropdownMenuRadioGroup 
                                                  value={selectedUnits[item.id] || ""} 
                                                  onValueChange={(value) => setSelectedUnits(prev => ({ ...prev, [item.id]: value }))}
                                                >
                                                  {unitOptions.map((option) => (
                                                    <DropdownMenuRadioItem key={option} value={option}>
                                                      {option}
                                                    </DropdownMenuRadioItem>
                                                  ))}
                                                </DropdownMenuRadioGroup>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </TableCell>
                                          <TableCell>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                                  {itemDepartments[item.id] || "Select department"}
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                <DropdownMenuRadioGroup 
                                                  value={itemDepartments[item.id] || ""} 
                                                  onValueChange={(value) => setItemDepartments(prev => ({ ...prev, [item.id]: value }))}
                                                >
                                                  {departmentOptions.map((option) => (
                                                    <DropdownMenuRadioItem key={option} value={option}>
                                                      {option}
                                                    </DropdownMenuRadioItem>
                                                  ))}
                                                </DropdownMenuRadioGroup>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </TableCell>
                                          <TableCell>
                                            <Input
                                              type="text"
                                              placeholder="Enter specifications..."
                                              value={specifications[item.id] || ""}
                                              onChange={(e) => setSpecifications(prev => ({ ...prev, [item.id]: e.target.value }))}
                                              className="h-8 text-sm"
                                              onClick={(e) => e.stopPropagation()}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                                  {selectedPaymentTerms}
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                <DropdownMenuRadioGroup value={selectedPaymentTerms} onValueChange={setSelectedPaymentTerms}>
                                                  {paymentTermsOptions.map((option) => (
                                                    <DropdownMenuRadioItem key={option} value={option}>
                                                      {option}
                                                    </DropdownMenuRadioItem>
                                                  ))}
                                                </DropdownMenuRadioGroup>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </TableCell>
                                          <TableCell>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                                  {selectedDeliveryTime}
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                <DropdownMenuRadioGroup value={selectedDeliveryTime} onValueChange={setSelectedDeliveryTime}>
                                                  {deliveryTimeOptions.map((option) => (
                                                    <DropdownMenuRadioItem key={option} value={option}>
                                                      {option}
                                                    </DropdownMenuRadioItem>
                                                  ))}
                                                </DropdownMenuRadioGroup>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </TableCell>
                                          <TableCell>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                removeItemFromOrder(item.id);
                                              }}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                        {expandedItems[item.id] && (
                                          <TableRow>
                                            <TableCell colSpan={11} className="p-0 border-t-0">
                                              <div className="p-4 bg-gray-50">
                                                {/* Existing expanded content */}
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </React.Fragment>
                                ));
                              }
                              
                              // Regular non-grouped view
                              return selectedItems.map((item) => (
                                <React.Fragment key={item.id}>
                                  <TableRow
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setIsDetailsOverlayOpen(true);
                                    }}
                                  >
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                          <img
                                            src={item.image || `/placeholder.svg?height=32&width=32`}
                                            alt={item.name}
                                            className="max-w-full max-h-full object-contain"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{item.name}</span>
                                            {item.status === "Urgent" && (
                                              <Badge variant="destructive" className="h-5 px-1.5 py-0 text-xs font-normal">Urgent</Badge>
                                            )}
                                          </div>
                                          <div className="text-sm text-muted-foreground line-clamp-2">
                                            {item.description}
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-2">
                                        {item.vendors
                                          .filter(vendor => vendor.status.isSelected || vendor.status.isCurrentVendor)
                                          .map((vendor, index) => (
                                          <div 
                                              key={`${item.id}-${vendor.name}`}
                                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${
                                                vendor.status.isCurrentVendor 
                                                  ? "bg-blue-50 border-blue-200" 
                                                  : vendor.status.isSelected
                                                  ? "bg-primary/5 border-primary"
                                                  : "bg-gray-50 border-gray-200"
                                            }`}
                                          >
                                            <div className="relative h-4 w-4 rounded-full overflow-hidden border bg-white">
                                              <img
                                                  src={vendor.image_url || getVendorLogo(vendor.name)}
                                                alt={vendor.name}
                                                className="w-full h-full object-contain p-0.5"
                                              />
                                            </div>
                                            <span className={`text-xs font-medium ${
                                                vendor.status.isCurrentVendor 
                                                  ? "text-blue-700" 
                                                  : vendor.status.isSelected
                                                  ? "text-primary"
                                                  : "text-gray-700"
                                            }`}>
                                              {vendor.name}
                                            </span>
                                          </div>
                                        ))}
                                        {/* Add badge showing number of unselected vendors */}
                                        {(() => {
                                          const unselectedCount = item.vendors.filter(
                                            v => !v.status.isSelected && !v.status.isCurrentVendor
                                          ).length;
                                          if (unselectedCount > 0) {
                                            return (
                                              <div 
                                                className="flex items-center gap-1 px-2 py-1 rounded-full border border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedItem(item);
                                                  setIsDetailsOverlayOpen(true);
                                                }}
                                              >
                                                <Plus className="h-3 w-3 text-gray-500" />
                                                <span className="text-xs text-gray-500 font-medium">
                                                  {unselectedCount}
                                                </span>
                                              </div>
                                            );
                                          }
                                          return null;
                                        })()}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm text-muted-foreground">4.5 (24)</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity || 1}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          updateItemQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1));
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-7 w-24 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="w-full justify-start">
                                            {selectedUnits[item.id] || "Select unit"}
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuRadioGroup 
                                            value={selectedUnits[item.id] || ""} 
                                            onValueChange={(value) => setSelectedUnits(prev => ({ ...prev, [item.id]: value }))}
                                          >
                                            {unitOptions.map((option) => (
                                              <DropdownMenuRadioItem key={option} value={option}>
                                                {option}
                                              </DropdownMenuRadioItem>
                                            ))}
                                          </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                    <TableCell>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="w-full justify-start">
                                            {itemDepartments[item.id] || "Select department"}
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuRadioGroup 
                                            value={itemDepartments[item.id] || ""} 
                                            onValueChange={(value) => setItemDepartments(prev => ({ ...prev, [item.id]: value }))}
                                          >
                                            {departmentOptions.map((option) => (
                                              <DropdownMenuRadioItem key={option} value={option}>
                                                {option}
                                              </DropdownMenuRadioItem>
                                            ))}
                                          </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="text"
                                        placeholder="Enter specifications..."
                                        value={specifications[item.id] || ""}
                                        onChange={(e) => setSpecifications(prev => ({ ...prev, [item.id]: e.target.value }))}
                                        className="h-8 text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="w-full justify-start">
                                            {selectedPaymentTerms}
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuRadioGroup value={selectedPaymentTerms} onValueChange={setSelectedPaymentTerms}>
                                            {paymentTermsOptions.map((option) => (
                                              <DropdownMenuRadioItem key={option} value={option}>
                                                {option}
                                              </DropdownMenuRadioItem>
                                            ))}
                                          </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                    <TableCell>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="w-full justify-start">
                                            {selectedDeliveryTime}
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuRadioGroup value={selectedDeliveryTime} onValueChange={setSelectedDeliveryTime}>
                                            {deliveryTimeOptions.map((option) => (
                                              <DropdownMenuRadioItem key={option} value={option}>
                                                {option}
                                              </DropdownMenuRadioItem>
                                            ))}
                                          </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeItemFromOrder(item.id);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                  {expandedItems[item.id] && (
                                    <TableRow>
                                      <TableCell colSpan={11} className="p-0 border-t-0">
                                        <div className="p-4 bg-gray-50">
                                          {/* Existing expanded content */}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </React.Fragment>
                              ));
                            })()}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    </CardContent>
                  </Card>
                )}

                {/* Order Summary, Budget, Combine Order, and AI Insights Sections */}
                {selectedItems.length > 0 && (
                  <div className="space-y-4">
                    {/* Unified Insights Card */}
                    <Card className="overflow-hidden">
                      <CardHeader 
                        className="border-b py-3 px-4 cursor-pointer" 
                        onClick={() => setExpandedAIInsights(!expandedAIInsights)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-base font-medium">Order Insights</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">3 sections</Badge>
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform duration-200 ${
                                expandedAIInsights ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      {expandedAIInsights && (
                        <CardContent className="p-0">
                          <div className="grid grid-cols-3 divide-x">
                            {/* Budget Section */}
                            <div className="p-6">
                              <div className="flex items-center gap-2 mb-4">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-medium">Budget</h3>
                              </div>
                              
                              <div className="space-y-4">
                                {/* Department Selection */}
                                <div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-full justify-start">
                                        {selectedDepartment === "surgery" && "Surgery"}
                                        {selectedDepartment === "emergency" && "Emergency"}
                                        {selectedDepartment === "cardiology" && "Cardiology"}
                                        {selectedDepartment === "radiology" && "Radiology"}
                                        {selectedDepartment === "neurology" && "Neurology"}
                                        {selectedDepartment === "pediatrics" && "Pediatrics"}
                                        {selectedDepartment === "laboratory" && "Laboratory"}
                                        {selectedDepartment === "it" && "IT Department"}
                                        {selectedDepartment === "general" && "General Supplies"}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuRadioGroup value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                        <DropdownMenuRadioItem value="surgery">Surgery</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="emergency">Emergency</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="cardiology">Cardiology</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="radiology">Radiology</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="neurology">Neurology</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="pediatrics">Pediatrics</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="laboratory">Laboratory</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="it">IT Department</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="general">General Supplies</DropdownMenuRadioItem>
                                      </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {/* Budget Summary */}
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Available Budget</span>
                                    <span className="text-sm font-medium">
                                      ${selectedDepartment === "surgery" ? "40,000" : 
                                         selectedDepartment === "emergency" ? "43,000" : "22,500"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">This Order</span>
                                    <span className="text-sm font-medium">~$10,000</span>
                                  </div>
                                  <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        selectedDepartment === "surgery" && calculateTotal() > 10000 ? "bg-red-500" :
                                        selectedDepartment === "emergency" && calculateTotal() > 15000 ? "bg-red-500" :
                                        "bg-blue-500"
                                      }`}
                                      style={{ width: `${Math.min(100, (calculateTotal() / (selectedDepartment === "surgery" ? 75000 : selectedDepartment === "emergency" ? 85000 : 40000)) * 100)}%` }}
                                    >
                                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-white font-medium">
                                        {((calculateTotal() / (selectedDepartment === "surgery" ? 75000 : selectedDepartment === "emergency" ? 85000 : 40000)) * 100).toFixed(1)}% of Budget
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Budget Status */}
                                {(selectedDepartment === "surgery" && calculateTotal() > 10000) || 
                                 (selectedDepartment === "emergency" && calculateTotal() > 15000) ? (
                                  <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                                    <div className="flex items-start gap-2">
                                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                                      <div>
                                        <p className="text-sm font-medium text-amber-800">Approval Required</p>
                                        <p className="text-xs text-amber-700 mt-1">
                                          This order exceeds the departmental single-order limit.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            {/* Combine Order Section */}
                            <div className="p-6">
                              <div className="flex items-center gap-2 mb-4">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-medium">Combine Order</h3>
                              </div>
                              
                              <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                  Current order fills 40% of a standard truck - find a partner to optimize costs and get bulk discounts.
                                </p>
                                
                                <div className="flex items-center justify-center">
                                  <div className="w-16 h-24 bg-blue-50 rounded-md overflow-hidden relative border-2 border-blue-300">
                                    <div 
                                      className="absolute bottom-0 w-full bg-blue-500" 
                                      style={{ height: '40%' }}
                                    ></div>
                                  </div>
                                  <span className="text-lg font-medium ml-4">40%</span>
                                </div>

                                <Button 
                                  variant="outline" 
                                  size="default"
                                  className="w-full border border-gray-200 gap-2"
                                >
                                  <Users className="h-4 w-4" />
                                  Find Partner
                                </Button>
                              </div>
                            </div>

                            {/* AI Insights Section */}
                            <div className="p-6">
                              <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-medium">AI Insights</h3>
                              </div>
                              
                              <div className="space-y-4">
                                {/* Budget Alert */}
                                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                                  <div className="flex items-start gap-2">
                                    <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-blue-800">Budget Optimization</p>
                                        <Button variant="ghost" size="sm" className="h-7 px-2">
                                          <ArrowUpDown className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <p className="text-xs text-blue-700 mt-1">
                                        Consider combining orders with Emergency Department to reach bulk discount thresholds.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Vendor Optimization */}
                                <div className="bg-green-50 p-3 rounded-md border border-green-100">
                                  <div className="flex items-start gap-2">
                                    <Sparkles className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-green-800">Vendor Optimization</p>
                                        <Button variant="ghost" size="sm" className="h-7 px-2">
                                          <RefreshCw className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <p className="text-xs text-green-700 mt-1">
                                        2 items can be sourced from the same vendor to reduce shipping costs.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Price Alert */}
                                <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                                  <div className="flex items-start gap-2">
                                    <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-amber-800">Price Alert</p>
                                        <Button variant="ghost" size="sm" className="h-7 px-2">
                                          <Clock className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <p className="text-xs text-amber-700 mt-1">
                                        Current prices are 15% higher than last quarter. Consider waiting for Q2 pricing.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                {/* <div className="flex gap-2 pt-2">
                                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Generate Insights
                                  </Button>
                                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                                    <History className="h-4 w-4" />
                                    View History
                                  </Button>
                                </div> */}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>

                    {/* Order Summary Cards */}
                    <div className="space-y-4">
                      {/* Immediate Purchase Card */}
                      <Card>
                        <CardHeader className="border-b bg-muted/30 py-4 px-6">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <CardTitle className="text-lg">Ready to Purchase</CardTitle>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {selectedItems.filter(item => item.selectedVendor?.pricePerUnit !== undefined && item.selectedVendor?.pricePerUnit !== null).length} items
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Column - Order Details (larger, spans 2 columns) */}
                            <div className="md:col-span-2">
                              {/* Items List */}
                              <div className="border rounded-lg overflow-hidden">
                                <div className="divide-y">
                                  {selectedItems
                                    .filter(item => item.selectedVendor?.pricePerUnit !== undefined && item.selectedVendor?.pricePerUnit !== null)
                                    .slice(0, 2) // Only show first 2 items
                                    .map(item => (
                                      <div key={item.id} className="p-3 flex items-center justify-between hover:bg-green-50/50">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded bg-white border flex items-center justify-center">
                                            <img
                                              src={item.image || `/placeholder.svg`}
                                              alt={item.name}
                                              className="w-full h-full object-contain p-1"
                                            />
                                          </div>
                                          <div>
                                            <span className="font-medium block">{item.name}</span>
                                            <span className="text-sm text-muted-foreground">{item.selectedVendor?.name}</span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="font-medium block">${item.selectedVendor?.pricePerUnit?.toFixed(2)}</span>
                                          <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                                        </div>
                                      </div>
                                    ))}
                                  {selectedItems.filter(item => item.selectedVendor?.pricePerUnit !== undefined && item.selectedVendor?.pricePerUnit !== null).length === 0 && (
                                    <div className="p-4 text-center text-muted-foreground">
                                      No items ready for immediate purchase
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Right Column - Quick Actions */}
                            <div className="border-l pl-6">
                              <div className="space-y-6">
                                {/* Dates Section
                                <div>
                                  <h3 className="text-base font-semibold mb-4">Dates</h3>
                                  <div className="space-y-4">
                                    <div>
                                      <span className="text-muted-foreground mb-1 block">Issue Date</span>
                                      <Input
                                        type="date"
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                        className="h-10 text-base px-3"
                                      />
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground mb-1 block">Due Date</span>
                                      <Input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="h-10 text-base px-3"
                                      />
                                    </div>
                                  </div>
                                </div> */}

                                {/* Department Selection
                                <div>
                                  <h3 className="text-base font-semibold mb-4">Department</h3>
                                  <div className="flex flex-col gap-1.5">
                                    <span className="text-muted-foreground text-sm">Select department this order belongs to</span>
                                    <Select 
                                      defaultValue="surgery" 
                                      value={selectedDepartment}
                                      onValueChange={(value) => setSelectedDepartment(value)}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select department" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="surgery">Surgery Department</SelectItem>
                                        <SelectItem value="emergency">Emergency Department</SelectItem>
                                        <SelectItem value="cardiology">Cardiology Department</SelectItem>
                                        <SelectItem value="radiology">Radiology Department</SelectItem>
                                        <SelectItem value="neurology">Neurology Department</SelectItem>
                                        <SelectItem value="pediatrics">Pediatrics Department</SelectItem>
                                        <SelectItem value="laboratory">Laboratory</SelectItem>
                                        <SelectItem value="it">IT Department</SelectItem>
                                        <SelectItem value="general">General Supplies</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div> */}

                                {/* Quick Actions */}
                                <div>
                                  {/* <h3 className="text-base font-semibold mb-4">Quick Actions</h3> */}
                                  <div className="space-y-3">
                                    <Button
                                      className="w-full justify-start items-center gap-2 h-11 text-base"
                                      onClick={handleProceedToOrderConfirmation}
                                    >
                                      <ShoppingCart className="h-5 w-5" />
                                      <span>Proceed to Checkout</span>
                                    </Button>
                                    <Button
                                      className="w-full justify-start items-center gap-2 h-11 text-base"
                                      variant="outline"
                                      onClick={handleProceedToContactMethod}
                                    >
                                      <PhoneCall className="h-5 w-5" />
                                      <span>Call with AMS</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* RFQ Card */}
                      <Card>
                        <CardHeader className="border-b bg-muted/30 py-4 px-6">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-lg">RFQ</CardTitle>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              3 items
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Column - RFQ Details (larger, spans 2 columns) */}
                            <div className="md:col-span-2">
                              {/* Items List */}
                              <div className="border rounded-lg overflow-hidden">
                                <div className="divide-y">
                                  {selectedItems
                                    // .filter(item => item.selectedVendor?.pricePerUnit === undefined || item.selectedVendor?.pricePerUnit === null)
                                    .slice(0, 3) // Show first 3 items
                                    .map(item => (
                                      <div key={item.id} className="p-3 flex items-center justify-between hover:bg-blue-50/50">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded bg-white border flex items-center justify-center">
                                            <img
                                              src={item.image || `/placeholder.svg`}
                                              alt={item.name}
                                              className="w-full h-full object-contain p-1"
                                            />
                                          </div>
                                          <div>
                                            <span className="font-medium block">{item.name}</span>
                                            <span className="text-sm text-muted-foreground">
                                              {item.selectedVendor?.name || 'No vendor selected'}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="text-blue-600 border-blue-200">RFQ Needed</Badge>
                                          <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                                        </div>
                                      </div>
                                    ))}
                                  {/* {selectedItems.filter(item => item.selectedVendor?.pricePerUnit === undefined || item.selectedVendor?.pricePerUnit === null).length === 0 && (
                                    <div className="p-4 text-center text-muted-foreground">
                                      No items require RFQ
                                    </div>
                                  )} */}
                                </div>
                              </div>

                              {/* RFQ Notes */}
                              <div className="mt-6">
                                <h3 className="text-base font-semibold mb-4">RFQ Notes</h3>
                                <div className="relative">
                                  <Textarea
                                    placeholder="Add notes for vendors regarding the RFQ..."
                                    value={rfqNotes}
                                    onChange={(e) => setRfqNotes(e.target.value)}
                                    className="min-h-[120px] text-base pr-40"
                                  />
                                  <div className="absolute bottom-3 right-3">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 gap-2 text-sm px-3"
                                      onClick={() => {
                                        setRfqNotes("Request for Quote for medical supplies. Please provide competitive pricing with consideration for bulk discounts. Include delivery timelines and any available certifications. We require compliance with all relevant medical standards and regulations.")
                                      }}
                                    >
                                      <Sparkles className="h-4 w-4" />
                                      Write with AMS AI
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Right Column - Quick Actions */}
                            <div className="border-l pl-6">
                              <div className="space-y-6">
                                {/* RFQ Preview */}
                                <div>
                                  {/* <h3 className="text-base font-semibold mb-4">RFQ Preview</h3> */}
                                  <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="space-y-3">
                                      {/* <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Items</span>
                                        <span className="text-sm text-muted-foreground">
                                          {selectedItems.filter(item => item.selectedVendor?.pricePerUnit === undefined || item.selectedVendor?.pricePerUnit === null).length} items
                                        </span>
                                      </div> */}
                                      {/* <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Total Units</span>
                                        <span className="text-sm text-muted-foreground">
                                          {selectedItems
                                            .filter(item => item.selectedVendor?.pricePerUnit === undefined || item.selectedVendor?.pricePerUnit === null)
                                            .reduce((sum, item) => sum + (item.quantity || 0), 0)} units
                                        </span>
                                      </div> */}
                                      {/* <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Department</span>
                                        <Badge variant="outline" className="text-xs">
                                          {selectedDepartment === "surgery" && "Surgery"}
                                          {selectedDepartment === "emergency" && "Emergency"}
                                          {selectedDepartment === "cardiology" && "Cardiology"}
                                          {selectedDepartment === "radiology" && "Radiology"}
                                          {selectedDepartment === "neurology" && "Neurology"}
                                          {selectedDepartment === "pediatrics" && "Pediatrics"}
                                          {selectedDepartment === "laboratory" && "Laboratory"}
                                          {selectedDepartment === "it" && "IT"}
                                          {selectedDepartment === "general" && "General"}
                                        </Badge>
                                      </div> */}
                                      <div className="pt-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full gap-2"
                                          onClick={() => setShowRfqDialog(true)}
                                        >
                                          <FileText className="h-4 w-4" />
                                          Preview Full RFQ
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Quick Actions */}
                                <div>
                                  <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
                                  <div className="space-y-3">
                                    <Button
                                      className="w-full justify-start items-center gap-2 h-11 text-base"
                                      onClick={handleGenerateRFQ}
                                    >
                                      <FileText className="h-5 w-5" />
                                      <span>Generate RFQ</span>
                                    </Button>
                                    <Button
                                      className="w-full justify-start items-center gap-2 h-11 text-base"
                                      variant="outline"
                                      onClick={handleProceedToContactMethod}
                                    >
                                      <PhoneCall className="h-5 w-5" />
                                      <span>Call with AMS</span>
                                    </Button>
                                    <Button
                                      className="w-full justify-start items-center gap-2 h-11 text-base"
                                      variant="outline"
                                      onClick={() => setShowRfqDialog(true)}
                                    >
                                      <Send className="h-5 w-5" />
                                      <span>Send RFQ</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "quotes" && (
            <Card>
              <CardHeader>
                  <CardTitle>Quotes</CardTitle>
                  <CardDescription>View and compare quotes from different vendors</CardDescription>
              </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    No quotes available yet. Add items to your order to get quotes.
                              </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Toolbar */}
      <QuickActionsToolbar />
      
      {/* Add extra padding at the bottom to prevent overlap with quick actions toolbar */}
      <div className="pb-16"></div>
      
      {/* Overlays */}
      <OrderDetailsOverlay
        isOpen={isDetailsOverlayOpen}
        onClose={() => setIsDetailsOverlayOpen(false)}
        item={selectedItem}
        alternativeVendors={selectedItem ? alternativeVendors[selectedItem.id] || [] : []}
        setSelectedItems={setSelectedItems}
        handleFindAlternatives={() => selectedItem && handleFindAlternatives(selectedItem)}
        loadingAlternatives={loadingAlternatives}
        renderStars={renderStars}
        selectedVendors={selectedVendors}
        setSelectedVendors={setSelectedVendors}
        setSelectedVendorActions={setSelectedVendorActions}
        onAddAlternativeVendor={handleAddAlternativeVendor}
      />

      {/* AI Suggestions Overlay */}
      {isAISuggestionsOverlayOpen && (
        <AnimatePresence>
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsAISuggestionsOverlayOpen(false)}
            />
            
            {/* Side Panel */}
            <motion.div
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
                      <div className="text-sm text-muted-foreground">AI Suggestions</div>
                      <div className="text-lg font-semibold">Recommended Items</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsAISuggestionsOverlayOpen(false)} className="rounded-full">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {loadingAISuggestions ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : aiSuggestedItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No suggestions available at this time.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {aiSuggestedItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-4 p-4 border rounded-lg bg-white"
                          >
                            {/* Product Image */}
                            <div className="w-24 h-24 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <img
                                src={item.image || `/placeholder.svg`}
                                alt={item.name}
                                className="max-w-full max-h-full object-contain p-2"
                              />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground">{item.sku}</p>
                                  <div className="mt-1 flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <Package className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">{item.packaging}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Building2 className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">{item.vendor}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">${item.unitPrice?.toFixed(2)}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {item.currentStock}/{item.totalStock} in stock
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-blue-600">
                                  {item.reason}
                                </div>
                                <Button
                                  onClick={() => handleAddSuggestedItem(item)}
                                  className="bg-black text-white hover:bg-black/90"
                                >
                                  Add to Order
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        </AnimatePresence>
      )}

      {/* Add RFQDialog */}
      <RFQDialog
        open={showRfqDialog}
        onOpenChange={setShowRfqDialog}
        items={selectedItems}
        selectedVendors={selectedVendors}
        onSend={handleSendRFQ}
      />
    </>
  )
}


