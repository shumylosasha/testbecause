"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Filter, MoreHorizontal, Plus, Star, FileText, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { VendorQuickActions } from "../components/vendor-quick-actions"

// Add interface for vendor data above the mock data declaration
interface Vendor {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  categories: string[];
  status: string;
  rating: number;
  ratingDetails: {
    onTime: number;
    onQuantity: number;
    productQuality: number;
  };
  complianceStatus: string;
  lastOrder: string;
  totalSpend: number;
  leadTime: string;
  isNew?: boolean; // Optional property for new vendors
}

// Mock data for vendors
const vendorsData: Vendor[] = [
  {
    id: "vendor-001",
    name: "MedSupply Inc.",
    contactName: "John Smith",
    contactEmail: "john.smith@medsupply.com",
    contactPhone: "+1 (555) 123-4567",
    categories: ["Surgical Supplies", "IV Supplies", "PPE"],
    status: "Active",
    rating: 4.8,
    ratingDetails: {
      onTime: 4.9,
      onQuantity: 4.7,
      productQuality: 4.8
    },
    complianceStatus: "Approved",
    lastOrder: "2023-12-15",
    totalSpend: 15420.75,
    leadTime: "2-3 days"
  },
  {
    id: "vendor-002",
    name: "Hospital Direct",
    contactName: "Sarah Johnson",
    contactEmail: "sarah.j@hospitaldirect.com",
    contactPhone: "+1 (555) 987-6543",
    categories: ["Surgical Supplies", "Examination Supplies", "Cleaning Supplies"],
    status: "Active",
    rating: 4.5,
    ratingDetails: {
      onTime: 4.3,
      onQuantity: 4.6,
      productQuality: 4.6
    },
    complianceStatus: "Approved",
    lastOrder: "2023-12-20",
    totalSpend: 8750.25,
    leadTime: "3-5 days"
  },
  {
    id: "vendor-003",
    name: "PPE Direct",
    contactName: "Michael Chen",
    contactEmail: "mchen@ppedirect.com",
    contactPhone: "+1 (555) 456-7890",
    categories: ["PPE", "Cleaning Supplies"],
    status: "Active",
    rating: 4.2,
    ratingDetails: {
      onTime: 4.0,
      onQuantity: 4.5,
      productQuality: 4.1
    },
    complianceStatus: "Approved",
    lastOrder: "2023-12-22",
    totalSpend: 5320.5,
    leadTime: "1-2 days"
  },
  {
    id: "vendor-004",
    name: "Discount Medical",
    contactName: "Lisa Rodriguez",
    contactEmail: "lisa@discountmedical.com",
    contactPhone: "+1 (555) 234-5678",
    categories: ["Surgical Supplies", "Examination Supplies"],
    status: "Pending Review",
    rating: 3.9,
    ratingDetails: {
      onTime: 3.8,
      onQuantity: 4.2,
      productQuality: 3.7
    },
    complianceStatus: "Under Review",
    lastOrder: "2023-11-30",
    totalSpend: 2150.75,
    leadTime: "5-7 days"
  },
  {
    id: "vendor-005",
    name: "PrimeCare Supplies",
    contactName: "David Wilson",
    contactEmail: "dwilson@primecare.com",
    contactPhone: "+1 (555) 876-5432",
    categories: ["Surgical Supplies", "IV Supplies", "Examination Supplies"],
    status: "Active",
    rating: 4.7,
    ratingDetails: {
      onTime: 4.8,
      onQuantity: 4.5,
      productQuality: 4.8
    },
    complianceStatus: "Approved",
    lastOrder: "2023-12-10",
    totalSpend: 12680.3,
    leadTime: "2-4 days"
  },
]

// Rating explanation tooltips - simplified to one sentence each
const ratingExplanations = {
  onTime: "Measures how reliably the vendor delivers orders by the promised dates.",
  onQuantity: "Evaluates if the vendor consistently delivers the exact quantities ordered.",
  productQuality: "Reflects the quality of received products against specifications."
}

// Helper function to render star ratings visually
const StarRating = ({ rating }: { rating: number }) => {
  // We'll use 5 stars max
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
      {hasHalfStar && (
        <div className="relative h-3 w-3">
          <Star className="absolute h-3 w-3 text-amber-400" />
          <div className="absolute overflow-hidden w-[50%] h-3">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-3 w-3 text-amber-400" />
      ))}
    </div>
  );
};

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({ key: "", direction: null });
  const [vendors, setVendors] = useState<Vendor[]>(vendorsData)

  const handleAddVendor = () => {
    alert("Adding new vendor...")
  }

  const handleChatWithAI = () => {
    console.log("Chat with AI about vendors")
  }

  const handleUploadVendors = async (file: File) => {
    try {
      // In a real app, this would process the file and import vendors
      // Here we'll just simulate a delay for the mock functionality
      await new Promise((resolve) => setTimeout(resolve, 3000))
      
      // Generate some mockup vendors
      const mockVendors = [
        {
          id: `vendor-${Date.now()}-1`,
          name: "NovaMed Supplies",
          contactName: "Emma Williams",
          contactEmail: "emma@novamed.com",
          contactPhone: "+1 (555) 345-6789",
          categories: ["Examination Supplies", "Diagnostic Equipment"],
          status: "Active",
          rating: 0,
          ratingDetails: {
            onTime: 0,
            onQuantity: 0,
            productQuality: 0
          },
          complianceStatus: "Under Review",
          lastOrder: "",
          totalSpend: 0,
          leadTime: "3-5 days",
          isNew: true  // Mark as new vendor
        },
        {
          id: `vendor-${Date.now()}-2`,
          name: "EcoCare Health",
          contactName: "Daniel Lopez",
          contactEmail: "daniel@ecocare.com",
          contactPhone: "+1 (555) 789-0123",
          categories: ["Sustainable Products", "PPE"],
          status: "Active",
          rating: 0,
          ratingDetails: {
            onTime: 0,
            onQuantity: 0,
            productQuality: 0
          },
          complianceStatus: "Under Review",
          lastOrder: "",
          totalSpend: 0,
          leadTime: "4-6 days",
          isNew: true  // Mark as new vendor
        },
        {
          id: `vendor-${Date.now()}-3`,
          name: "TechMed Solutions",
          contactName: "Jennifer Kim",
          contactEmail: "jkim@techmed.com",
          contactPhone: "+1 (555) 234-5678",
          categories: ["Medical Devices", "Monitoring Equipment"],
          status: "Pending Review",
          rating: 0,
          ratingDetails: {
            onTime: 0,
            onQuantity: 0,
            productQuality: 0
          },
          complianceStatus: "Under Review",
          lastOrder: "",
          totalSpend: 0,
          leadTime: "7-10 days",
          isNew: true  // Mark as new vendor
        }
      ];
      
      // Add mockup vendors to the list
      setVendors(prev => [...mockVendors, ...prev]);
      
      console.log(`Processed vendor file: ${file.name}`);
    } catch (error) {
      console.error("Error uploading vendors:", error);
    }
  }

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    if (sortConfig.direction === 'ascending') return <ChevronUp className="h-4 w-4 ml-1" />;
    if (sortConfig.direction === 'descending') return <ChevronDown className="h-4 w-4 ml-1" />;
    return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
  };

  // Filter vendors based on search query
  let filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.categories.some((category) => category.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Sort vendors based on sort configuration
  if (sortConfig.key && sortConfig.direction) {
    filteredVendors = [...filteredVendors].sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'ascending' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortConfig.key === 'complianceStatus') {
        return sortConfig.direction === 'ascending' 
          ? a.complianceStatus.localeCompare(b.complianceStatus)
          : b.complianceStatus.localeCompare(a.complianceStatus);
      }
      if (sortConfig.key === 'rating') {
        return sortConfig.direction === 'ascending' 
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
      if (sortConfig.key === 'leadTime') {
        // Strip non-numeric characters and convert to number for comparison
        const getLeadTimeDays = (lt: string) => {
          const match = lt.match(/(\d+)[-\s]*(\d*)/);
          return match ? parseInt(match[2] || match[1]) : 0;
        };
        
        return sortConfig.direction === 'ascending' 
          ? getLeadTimeDays(a.leadTime) - getLeadTimeDays(b.leadTime)
          : getLeadTimeDays(b.leadTime) - getLeadTimeDays(a.leadTime);
      }
      if (sortConfig.key === 'lastOrder') {
        const dateA = new Date(a.lastOrder);
        const dateB = new Date(b.lastOrder);
        return sortConfig.direction === 'ascending' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      if (sortConfig.key === 'totalSpend') {
        return sortConfig.direction === 'ascending' 
          ? a.totalSpend - b.totalSpend
          : b.totalSpend - a.totalSpend;
      }
      
      return 0;
    });
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending review":
        return "bg-amber-100 text-amber-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplianceStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "under review":
        return "bg-amber-100 text-amber-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>Manage your procurement vendors and suppliers</CardDescription>
          </div>
          <Button className="gap-2" onClick={handleAddVendor}>
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">
                    <button 
                      className="flex items-center font-semibold" 
                      onClick={() => requestSort('name')}
                    >
                      Vendor Name
                      {getSortIcon('name')}
                    </button>
                  </TableHead>
                  <TableHead className="w-[180px]">Categories</TableHead>
                  <TableHead className="w-[120px]">
                    <button 
                      className="flex items-center font-semibold" 
                      onClick={() => requestSort('complianceStatus')}
                    >
                      Compliance
                      {getSortIcon('complianceStatus')}
                    </button>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <button 
                      className="flex items-center font-semibold" 
                      onClick={() => requestSort('rating')}
                    >
                      Rating
                      {getSortIcon('rating')}
                    </button>
                  </TableHead>
                  <TableHead className="w-[100px]">
                    <button 
                      className="flex items-center font-semibold" 
                      onClick={() => requestSort('leadTime')}
                    >
                      Lead Time
                      {getSortIcon('leadTime')}
                    </button>
                  </TableHead>
                  <TableHead className="w-[100px]">
                    <button 
                      className="flex items-center font-semibold" 
                      onClick={() => requestSort('lastOrder')}
                    >
                      Last Order
                      {getSortIcon('lastOrder')}
                    </button>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <button 
                      className="flex items-center font-semibold" 
                      onClick={() => requestSort('totalSpend')}
                    >
                      Total Spend
                      {getSortIcon('totalSpend')}
                    </button>
                  </TableHead>
                  <TableHead className="w-[60px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${
                          vendor.isNew 
                            ? "bg-orange-500 animate-pulse" 
                            : getStatusColor(vendor.status)
                                .replace('bg-green-100 text-green-800', 'bg-green-500')
                                .replace('bg-amber-100 text-amber-800', 'bg-amber-500')
                                .replace('bg-red-100 text-red-800', 'bg-red-500')
                                .replace('bg-gray-100 text-gray-800', 'bg-gray-500')
                        }`} />
                        {vendor.isNew && (
                          <span className="mr-1.5 text-xs bg-orange-100 text-orange-800 rounded-full px-2 py-0.5 font-medium border border-orange-200">
                            New
                          </span>
                        )}
                        {vendor.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {vendor.categories.map((category, i) => (
                          <Badge key={i} variant="outline" className="bg-muted">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getComplianceStatusColor(vendor.complianceStatus)}>
                        {vendor.complianceStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 cursor-help border-b border-dotted border-gray-400">
                              <span>{vendor.rating}</span>
                              <StarRating rating={vendor.rating} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="start" className="w-80 p-0">
                            <div className="bg-white rounded-md shadow-lg border p-4">
                              <h4 className="font-medium mb-2 text-sm">Rating Breakdown</h4>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium">On Time</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs">{vendor.ratingDetails.onTime}</span>
                                      <StarRating rating={vendor.ratingDetails.onTime} />
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600">{ratingExplanations.onTime}</p>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium">On Quantity</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs">{vendor.ratingDetails.onQuantity}</span>
                                      <StarRating rating={vendor.ratingDetails.onQuantity} />
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600">{ratingExplanations.onQuantity}</p>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium">Product Quality</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs">{vendor.ratingDetails.productQuality}</span>
                                      <StarRating rating={vendor.ratingDetails.productQuality} />
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600">{ratingExplanations.productQuality}</p>
                                </div>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{vendor.leadTime}</TableCell>
                    <TableCell>{vendor.lastOrder}</TableCell>
                    <TableCell>${vendor.totalSpend.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit vendor</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View contracts
                            </DropdownMenuItem>
                            <DropdownMenuItem>Create order</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <VendorQuickActions
        onChatWithAI={handleChatWithAI}
        onAddVendor={handleAddVendor}
        onUploadVendors={handleUploadVendors}
      />
    </div>
  )
}

