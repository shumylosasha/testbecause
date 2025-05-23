"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpDown,
  ChevronLeft,
  Edit,
  Mail,
  Phone,
  ShoppingCart,
  TrendingDown,
  AlertTriangle,
  FileText,
  ExternalLink,
  Search,
  LineChart,
  Loader2,
  Star,
  Bot,
  RefreshCw,
} from "lucide-react"
import { getInventoryItem, type InventoryItem, Vendor } from "@/data/inventory-data"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { InventoryItemQuickActions } from "../../components/inventory-item-quick-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { notFound } from "next/navigation"

// Add MarketTrend type
type MarketTrend = {
  title: string
  description: string
  confidence: number
}

type MarketIntelligence = {
  product_category: string
  trends: MarketTrend[]
  supply_chain_status: string
  price_forecast: string
  key_manufacturers: string[]
  last_updated: string
}

// Add type definition at the top of the file
type Alternative = {
  name: string
  productName: string
  sku: string
  pricePerUnit: number
  price: number
  savings: number
  shipping: string
  manufacturer: string
  compliance: string
  isSelected: boolean
  url: string
  image: string | null
}

async function getItem(id: string): Promise<InventoryItem> {
  try {
    const item = await getInventoryItem(id)
    if (!item) {
      notFound()
    }
    return item
  } catch (error) {
    console.error("Error fetching item:", error)
    notFound()
  }
}

export default function InventoryItemPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [isSearching, setIsSearching] = useState(false)
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isResearchingMarket, setIsResearchingMarket] = useState(false)
  const [marketIntelligence, setMarketIntelligence] = useState<MarketIntelligence | null>(null)
  const [activeTab, setActiveTab] = useState("vendors")

  // Add feedback data
  const feedbackData = [
    {
      name: "Dr. Sarah Johnson",
      department: "Surgery",
      date: "2023-12-15",
      rating: 4,
      comment:
        "Good quality product, but the packaging could be improved for easier access during procedures.",
    },
    {
      name: "Dr. Michael Chen",
      department: "Emergency Medicine",
      date: "2023-11-30",
      rating: 5,
      comment: "Excellent product. Very reliable and consistent quality.",
    },
  ]

  // Calculate average rating
  const averageRating = feedbackData.reduce((acc, curr) => acc + curr.rating, 0) / feedbackData.length

  useEffect(() => {
    async function loadItem() {
      setIsLoading(true)
      try {
        const data = await getItem(id)
        setItem(data)
      } catch (error) {
        console.error("Failed to load item:", error)
      } finally {
        setIsLoading(false)
      }
    }
    if (id) {
      loadItem()
    }
  }, [id])

  const handleFindAlternatives = async () => {
    if (!item) return

    setIsSearching(true)
    console.log("Simulating finding alternatives for:", item.id)
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 1500))
    // In a real app, this might trigger a backend analysis or simply rely
    // on the data already present in alternativeVendors derived from item.vendors
    console.log("Alternative analysis simulation complete.")
    setIsSearching(false)
    toast.info("Alternative vendor analysis complete.") // Provide feedback
  }

  const handleMarketResearch = async () => {
    setIsResearchingMarket(true)
    try {
      // Instead of making an API call, create mock market intelligence data
      const mockMarketIntelligence: MarketIntelligence = {
        product_category: item?.category || '',
        trends: [
          {
            title: "Increasing Demand",
            description: "Healthcare facilities are increasing orders due to higher patient volumes.",
            confidence: 85
          },
          {
            title: "Price Stabilization",
            description: "After recent fluctuations, prices are expected to stabilize in the next quarter.",
            confidence: 75
          },
          {
            title: "New Alternatives",
            description: "Several new manufacturers are entering the market with competitive options.",
            confidence: 65
          }
        ],
        supply_chain_status: "Stable with occasional delays reported",
        price_forecast: "Expected to decrease by 3-5% in the next 6 months",
        key_manufacturers: ["MediGlove", "ValueMed", "SafetyFirst", "GlobalHealth Supplies"],
        last_updated: new Date().toISOString().split('T')[0]
      }
      setMarketIntelligence(mockMarketIntelligence)
    } catch (error) {
      console.error('Error researching market:', error)
      toast.error('Failed to get market intelligence')
    } finally {
      setIsResearchingMarket(false)
    }
  }

  const handleAddItem = () => {
    // In a real app, this would open a form or navigate to an add item page
    alert("Add item functionality would open here")
  }

  const handleUploadInventory = async (file: File) => {
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 3000))
      alert("File uploaded successfully!")
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Failed to upload file")
    }
  }

  const handleChatWithAI = () => {
    // The chat functionality is handled directly in the InventoryQuickActions component
  }

  const handleCreateOrder = () => {
    // Navigate to create order page with the current item
    window.location.href = "/orders/create"
  }

  const handleNewItemsAdded = (newItems: any[]) => {
    // This is not needed for single item view
  }

  const handleContactVendor = () => {
    // In a real app, this would open a phone call or contact form
    alert("Contacting vendor...")
  }

  const handleEmailVendor = () => {
    // In a real app, this would open an email client or form
    alert("Opening email client...")
  }

  const handleViewDocuments = () => {
    // In a real app, this would show the documents section
    setActiveTab("documents")
  }

  const handleReorder = () => {
    // In a real app, this would open the reorder form
    alert("Opening reorder form...")
  }

  const handleEdit = () => {
    // In a real app, this would open the edit form
    alert("Opening edit form...")
  }

  const handleDelete = () => {
    // In a real app, this would show a confirmation dialog
    if (confirm("Are you sure you want to delete this item?")) {
      alert("Item deleted")
      router.push("/inventory")
    }
  }

  // Filter vendors to show as alternatives (e.g., not the current one)
  const alternativeVendors = useMemo(() => {
    if (!item?.vendors) return []
    return item.vendors.filter((v) => !v.status.isCurrentVendor)
  }, [item])

  // Calculate total potential savings from alternatives
  const totalPotentialSavings = useMemo(() => {
    return alternativeVendors.reduce((sum, vendor) => sum + (vendor.savings || 0), 0)
  }, [alternativeVendors])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!item) {
    return <div>Item not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{item.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        {/* Product description moved to the left */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4">
                  <img
                    src="https://trimbio.co.uk/media/catalog/product/cache/bc308f1575223bb891fda519f72e61ef/p/p/pp170.jpg"
                    alt={item.name}
                    className="max-w-full max-h-[200px] object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p>{item.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Purchase Price</p>
                      <p>${item.lastPurchasePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unit Price</p>
                      <p>${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Swaps</p>
                      <p className="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md">2</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm">
                      This product is essential for surgical procedures. We typically maintain a minimum stock level of
                      25 units. The current supplier has been reliable with consistent quality.
                    </p>
                  </div>

                  {/* AI Tariff Alert */}
                  <div className="mt-4 p-4 rounded-lg border border-red-200 bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-red-600" />
                      <h4 className="font-medium text-red-900">AI Tariff Alert</h4>
                    </div>
                    <p className="text-sm text-red-800">
                      15% tariff increase on {item.manufacturer} imports. Impact: +${(item.unitPrice * 0.15).toFixed(2)}/unit.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Navigation moved back below product card */}
          <div className="border-b">
            <nav className="flex space-x-8" aria-label="Item sections">
              <button
                onClick={() => setActiveTab("vendors")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "vendors"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Vendors
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "documents"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "orders"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Transaction History
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "feedback"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm">{averageRating.toFixed(1)}</span>
                </div>
                Hospital Feedback
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  2
                </span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === "vendors" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Current Supplier</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Supplier</p>
                        <p className="font-medium">{item?.vendors?.find(v => v.status.isCurrentVendor)?.name || 'No current vendor'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Supplier Rating</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">4.2/5.0</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Manufacturer</p>
                        <p className="font-medium">{item.manufacturer ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reorder Point</p>
                        <p className="font-medium">25 units</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reorder Quantity</p>
                        <p className="font-medium">{item.requiredUnits} units</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Replenishment</p>
                        <p className="font-medium">12,000 units in stock | Refill expected in 5 days</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lead Times</p>
                        <p className="font-medium">Max output: 20,000 units/week | Next batch: 4 days delay</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">Risk Alerts</p>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <p className="font-medium text-amber-700">Delay risk (China lockdown)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Alternative Vendors</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleFindAlternatives}
                        disabled={isSearching}
                        className="h-8 w-8 p-0"
                      >
                        {isSearching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <div className="px-6 pb-4">
                    <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                      <div className="mt-1">
                        <Bot className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-900">
                          I've analyzed the market for {item?.name} and found {item?.vendors?.length || 0} alternative vendors. The best option offers ${item?.potentialSavings?.toFixed(2) || '0.00'} in potential savings per unit. Consider reviewing the alternatives below to optimize your procurement costs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Promotional Vendor Card */}
                      <div className="border-2 border-blue-500 rounded-lg p-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                            <img
                              src="/placeholder.svg?height=64&width=64"
                              alt="Surgical Gloves"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Sterile Surgical Gloves</h4>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 rounded-full">
                                  Limited Time Offer
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium">4.8</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">by MedTech Solutions Inc.</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Price:</span>{" "}
                                <span className="line-through text-red-500">$12.99</span>{" "}
                                <span className="text-green-600">$0.00</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Quantity:</span> 50 pieces
                              </div>
                              <div>
                                <span className="text-muted-foreground">Shipping:</span> 2-3 days
                              </div>
                              <div>
                                <span className="text-muted-foreground">Usage:</span> 2-3 days
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-muted-foreground text-sm">Certificates:</span>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full">
                                  ISO 13485
                                </Badge>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full">
                                  CE Mark
                                </Badge>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-full">
                                  FDA 510(k)
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-start">
                              <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">Get Free Sample</Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {alternativeVendors.length > 0 ? (
                        alternativeVendors.map((vendor) => (
                          <div key={vendor.id} className="border rounded-lg p-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                                <img
                                  src={vendor.productImage || vendor.image_url || "/placeholder.svg?height=64&width=64"}
                                  alt={vendor.productName || item.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{vendor.productName || item.name}</h4>
                                  {vendor.savings && vendor.savings > 0 && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                      Save ${vendor.savings.toFixed(2)}
                                    </Badge>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Price:</span> ${vendor.pricePerUnit.toFixed(2)}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Manufacturer:</span> {vendor.manufacturer}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Shipping:</span> {vendor.shipping}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Vendor:</span> {vendor.name}
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-muted-foreground">Compliance:</span>{" "}
                                    <Badge variant="outline" className={`
                                      ${vendor.compliance === 'Hospital Approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                                        vendor.compliance.includes('Pending') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        'bg-blue-50 text-blue-700 border-blue-200'}
                                    `}>
                                      {vendor.compliance.includes('Pending') ? 'Pending Review' : vendor.compliance}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                  <Button size="sm" className="bg-black text-white hover:bg-black/90">Create Order</Button>
                                  <Button size="sm" variant="outline" className="gap-1">
                                    <Phone className="h-3 w-3" />
                                    Call
                                  </Button>
                                  <Button size="sm" variant="outline" className="gap-1">
                                    <Mail className="h-3 w-3" />
                                    Email
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground p-4">
                          No alternative vendors available.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "documents" && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {[
                      {
                        name: "Product Specification Sheet",
                        type: "PDF",
                        size: "1.2 MB",
                        date: "2023-10-15",
                      },
                      {
                        name: "Safety Data Sheet",
                        type: "PDF",
                        size: "850 KB",
                        date: "2023-09-22",
                      },
                      {
                        name: "Quality Certificate",
                        type: "PDF",
                        size: "1.5 MB",
                        date: "2023-11-05",
                      },
                    ].map((doc, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary p-2 rounded">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{doc.date}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "orders" && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {[
                        {
                          date: "2024-02-15",
                          type: "Order",
                          quantity: 50,
                          unitPrice: 12.99,
                          total: 649.50,
                          status: "Delivered",
                          orderNumber: "ORD-2024-001",
                          vendor: "MedSupply Co."
                        },
                        {
                          date: "2024-01-20",
                          type: "Adjustment",
                          quantity: -5,
                          unitPrice: 12.99,
                          total: -64.95,
                          status: "Completed",
                          orderNumber: "ADJ-2024-003",
                          vendor: "System"
                        },
                        {
                          date: "2024-01-10",
                          type: "Order",
                          quantity: 75,
                          unitPrice: 12.99,
                          total: 974.25,
                          status: "Delivered",
                          orderNumber: "ORD-2023-156",
                          vendor: "MedSupply Co."
                        },
                        {
                          date: "2023-12-15",
                          type: "Adjustment",
                          quantity: -3,
                          unitPrice: 12.99,
                          total: -38.97,
                          status: "Completed",
                          orderNumber: "ADJ-2023-089",
                          vendor: "System"
                        },
                        {
                          date: "2023-12-01",
                          type: "Order",
                          quantity: 100,
                          unitPrice: 12.99,
                          total: 1299.00,
                          status: "Delivered",
                          orderNumber: "ORD-2023-145",
                          vendor: "MedSupply Co."
                        }
                      ].map((transaction, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${
                              transaction.type === "Order" 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {transaction.type === "Order" ? (
                                <ShoppingCart className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  {transaction.type === "Order" ? "Order" : "Stock Adjustment"}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {transaction.orderNumber}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {transaction.vendor} • {transaction.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {transaction.quantity > 0 ? "+" : ""}{transaction.quantity} units
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${transaction.total.toFixed(2)}
                            </p>
                            <Badge
                              variant="outline"
                              className={`mt-1 ${
                                transaction.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center pt-4">
                      <Button className="gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Create New Order
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "feedback" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Feedback from Doctors</h3>
                <div className="space-y-4">
                  {feedbackData.map((feedback, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">{feedback.name}</p>
                            <p className="text-sm text-muted-foreground">{feedback.department}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: feedback.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{feedback.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">{feedback.date}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column with Current Inventory and Market Trends */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="font-medium">
                    {item.currentStock}/{item.totalStock}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      (item.currentStock / item.totalStock) * 100 < 30
                        ? "bg-red-500"
                        : (item.currentStock / item.totalStock) * 100 < 70
                          ? "bg-amber-500"
                          : "bg-green-500"
                    }`}
                    style={{
                      width: `${(item.currentStock / item.totalStock) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant="outline"
                    className={
                      item.status === "Stock"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Low"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires In:</span>
                  <span>{item.expiresIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>Storage Room B, Shelf 3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>2 days ago</span>
                </div>
                <div className="pt-4 space-y-2">
                  <Button
                    size="sm"
                    onClick={handleReorder}
                    className="w-full gap-2 bg-black text-white hover:bg-black/90"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Reorder
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleContactVendor}
                    className="w-full gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Contact Vendor
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("orders")}
                    className="w-full gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Transaction History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Market Trends & Alerts</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Last updated: {marketIntelligence?.last_updated || new Date().toLocaleDateString()}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarketResearch}
                  disabled={isResearchingMarket}
                  className="h-8 w-8 p-0"
                >
                  {isResearchingMarket ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <h4 className="font-medium text-orange-900">Supply Chain Status</h4>
                  </div>
                  <p className="text-sm text-orange-800">Stable supply chain with multiple reliable manufacturers. No immediate concerns.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <LineChart className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Price Forecast</h4>
                  </div>
                  <p className="text-sm text-blue-800">Prices expected to remain stable for the next quarter. Consider bulk ordering for potential volume discounts.</p>
                </div>

                <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <h4 className="font-medium text-red-900">Tariff Alert: Origin Country</h4>
                  </div>
                  <p className="text-sm text-red-800">
                    A new 15% tariff on goods from China (where {item.manufacturer} operates) is effective next month. This may increase landed cost by ~$ { (item.unitPrice * 0.15).toFixed(2) } per unit.
                  </p>
                  <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-red-700 hover:text-red-900">
                    Explore Alternatives
                  </Button>
                </div>

                {/* Scenario 2: Potential Future Tariff */}
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <h4 className="font-medium text-amber-900">Watchlist: Component Country</h4>
                  </div>
                  <p className="text-sm text-amber-800">
                    Trade negotiations with Vietnam, a source for key components, are ongoing. Potential tariffs could impact pricing in 3-6 months.
                  </p>
                </div>

                {/* Key Manufacturers (Now follows Tariffs) */}
                <div className="mt-4 pt-4 border-t">
                   <h4 className="font-medium mb-2">Key Manufacturers</h4>
                   <div className="flex flex-wrap gap-2">
                     {item?.vendors.map((vendor, i) => (
                       <Badge key={i} variant="secondary">
                         {vendor.manufacturer}
                       </Badge>
                     ))}
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <InventoryItemQuickActions
        onChatWithAI={handleChatWithAI}
        onEmailVendor={handleEmailVendor}
        onReorder={handleReorder}
        onEdit={handleEdit}
        onDelete={handleDelete}
        itemName={item.name}
        itemStatus={item.status}
      />
    </div>
  )
}

