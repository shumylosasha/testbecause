'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, SlidersHorizontal, MessageSquare, MoreHorizontal } from "lucide-react";
import { ListItem } from './components/ListItem';
// Using direct relative import to fix type error
import { CreateItemDialog } from './components/CreateItemDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface SupplyItem {
  id: string;
  name: string;
  description: string;
  expiryDate: string;
  quantity: number;
  department: string;
  hospital: string;
  condition: string;
  price: number;
  category: string;
  imageUrl?: string;
  discount?: number; // Optional discount percentage
}

interface Category {
  value: string;
  label: string;
}

const dummyItems: SupplyItem[] = [
  {
    id: '1',
    name: 'Medical Gloves (Latex-Free)',
    description: 'Powder-free examination gloves, suitable for medical procedures. Hypoallergenic and latex-free.',
    expiryDate: '2024-08-01',
    quantity: 1000,
    department: 'Emergency',
    hospital: 'Central Hospital',
    condition: 'New',
    price: 50.00,
    category: 'Gloves',
    imageUrl: 'https://m.media-amazon.com/images/I/71ptpQ5DO+L.jpg'
  },
  {
    id: '2',
    name: 'N95 Respirator Masks',
    description: 'NIOSH-approved N95 respirator masks for healthcare settings. Provides protection against particulates.',
    expiryDate: '2024-05-15',
    quantity: 500,
    department: 'Pulmonology',
    hospital: 'Memorial Medical Center',
    condition: 'New',
    price: 120.50,
    category: 'Respiratory',
    imageUrl: 'https://protectivehealthgear.com/cdn/shop/files/N95-6150-Side_Shadow.png?v=1687904352&width=1080'
  },
  {
    id: '3',
    name: 'Surgical Masks',
    description: 'Disposable face masks for medical use. 3-ply design with comfortable earloops.',
    expiryDate: '2024-10-20',
    quantity: 1000,
    department: 'Surgery',
    hospital: 'University Hospital',
    condition: 'New',
    price: 35.75,
    category: 'Apparel',
    imageUrl: 'https://m.media-amazon.com/images/I/61GL9PjUwpS._AC_UY1100_.jpg'
  },
  {
    id: '4',
    name: 'Urinalysis Test Strips',
    description: 'Rapid diagnostic test strips for urinalysis. Results in 60 seconds.',
    expiryDate: '2024-04-10',
    quantity: 200,
    department: 'Laboratory',
    hospital: 'St. Luke\'s Medical',
    condition: 'New',
    price: 42.25,
    category: 'Clinical Laboratory',
    imageUrl: 'https://www.valuemed.co.uk/cdn/shop/products/ALLTEST-URS10-urine-testing-strips.jpg?v=1662545177'
  },
  {
    id: '5',
    name: 'Tongue Depressors',
    description: 'Sterile wooden tongue depressors for oral examinations. Pack of 500.',
    expiryDate: '2025-02-28',
    quantity: 50,
    department: 'General Medicine',
    hospital: 'Riverside Healthcare',
    condition: 'New',
    price: 18.00,
    category: 'Instruments',
    imageUrl: '/images/categories/Instruments.png'
  },
  {
    id: '6',
    name: 'Specimen Collection Containers',
    description: 'Sterile containers for specimen collection. Leak-proof design with secure cap.',
    expiryDate: '2025-01-15',
    quantity: 300,
    department: 'Laboratory',
    hospital: 'Central Hospital',
    condition: 'New',
    price: 55.00,
    category: 'Diagnostic Instruments',
    imageUrl: 'https://media.ascentbrandsinc.com/image/private/f_auto,t_ML_PDP_M/Products/16432-RD'
  },
  {
    id: '7',
    name: 'Urinal Bottle',
    description: 'Reusable male urinal bottle for bedbound patients. Easy to clean and sterilize.',
    expiryDate: '2026-06-30',
    quantity: 15,
    department: 'Nursing',
    hospital: 'Children\'s Hospital',
    condition: 'Like New',
    price: 28.50,
    category: 'Furnishings',
    imageUrl: '/images/categories/Furnishings.png'
  },
  {
    id: '8',
    name: 'Disinfectant Wipes',
    description: 'Hospital-grade disinfectant wipes. Effective against a broad spectrum of pathogens.',
    expiryDate: '2024-12-31',
    quantity: 100,
    department: 'Housekeeping',
    hospital: 'Memorial Medical Center',
    condition: 'New',
    price: 22.00,
    category: 'Housekeeping',
    imageUrl: 'https://www.ecolab.com/-/media/Widen/Healthcare/Clean-and-Safe-Patient-Rooms/Wipes-collection_Pad_550x310.jpg'
  }
];

const categories: Category[] = [
  { value: "all", label: "All Categories" },
  { value: "Respiratory", label: "Respiratory" },
  { value: "Apparel", label: "Apparel" },
  { value: "Gloves", label: "Gloves" },
  { value: "Housekeeping", label: "Housekeeping" },
  { value: "Clinical Laboratory", label: "Clinical Laboratory" },
  { value: "Instruments", label: "Instruments" },
  { value: "Furnishings", label: "Furnishings" },
  { value: "Diagnostic Instruments", label: "Diagnostic Instruments" }
];

const sortOptions = [
  { value: "expiryDate", label: "Expiry Date (Soonest)" },
  { value: "priceAsc", label: "Price (Low to High)" },
  { value: "priceDesc", label: "Price (High to Low)" },
  { value: "newest", label: "Recently Added" }
];

const conditions = [
  { value: "all", label: "All Conditions" },
  { value: "New", label: "New" },
  { value: "Like New", label: "Like New" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" }
];

// Function to get category images
const getCategoryImage = (category: string): string => {
  switch (category) {
    case "Respiratory":
      return "/images/categories/Respiratory.png";
    case "Apparel":
      return "/images/categories/Apparel.png";
    case "Gloves":
      return "/images/categories/Gloves.png";
    case "Housekeeping":
      return "/images/categories/Housekeeping.png";
    case "Clinical Laboratory":
      return "/images/categories/Clinical%20Laboratory.png";
    case "Instruments":
      return "/images/categories/Instruments.png";
    case "Furnishings":
      return "/images/categories/Furnishings.png";
    case "Diagnostic Instruments":
      return "/images/categories/Diagnostic%20Instruments.png";
    default:
      return "/images/categories/default.jpg";
  }
};

export default function SupplyExchange() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("expiryDate");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [activeTab, setActiveTab] = useState("marketplace");
  
  const [items, setItems] = useState<SupplyItem[]>(dummyItems);
  const [filteredItems, setFilteredItems] = useState<SupplyItem[]>(dummyItems);

  // Mockup data for My Listings tab
  const myListings: SupplyItem[] = [
    {
      id: '101',
      name: 'N95 Respirator Masks',
      description: 'NIOSH-approved N95 respirator masks for healthcare settings',
      expiryDate: '2024-12-15',
      quantity: 75,
      department: 'Pulmonology',
      hospital: 'Central Hospital',
      condition: 'New',
      price: 2.50,
      category: 'Respiratory',
      imageUrl: '/images/categories/Respiratory.png',
      discount: 15
    },
    {
      id: '102',
      name: 'Sterile Gloves',
      description: 'Powder-free surgical gloves for sterile procedures',
      expiryDate: '2024-11-20',
      quantity: 500,
      department: 'Surgery',
      hospital: 'Central Hospital',
      condition: 'New',
      price: 0.85,
      category: 'Gloves',
      imageUrl: '/images/categories/Gloves.png',
      discount: 10
    },
    {
      id: '103',
      name: 'Surgical Masks',
      description: 'Level 3 barrier protection surgical masks, fluid-resistant',
      expiryDate: '2025-01-15',
      quantity: 1000,
      department: 'Surgery',
      hospital: 'Central Hospital',
      condition: 'New',
      price: 0.35,
      category: 'Apparel',
      imageUrl: '/images/categories/Apparel.png',
      discount: 20
    }
  ];

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter and sort items based on selected criteria
  useEffect(() => {
    let result = [...items];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply condition filter
    if (selectedCondition !== "all") {
      result = result.filter(item => item.condition === selectedCondition);
    }
    
    // Apply sorting
    switch (selectedSort) {
      case "expiryDate":
        result.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
        break;
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        break;
    }
    
    setFilteredItems(result);
  }, [items, searchQuery, selectedCategory, selectedSort, selectedCondition]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Supply Exchange</CardTitle>
            <CardDescription>
              Exchange supplies between departments and hospitals
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} size="default" className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            List New Item
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="mb-6">
              <TabsTrigger value="marketplace" className="px-6 py-2">Marketplace</TabsTrigger>
              <TabsTrigger value="trending" className="px-6 py-2">Trending</TabsTrigger>
              <TabsTrigger value="my-listings" className="px-6 py-2">My Listings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="marketplace">
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1 flex gap-3 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[320px]">
                      <SheetHeader className="mb-6">
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Refine your search results
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-8 py-4">
                        <div className="grid gap-3">
                          <label className="text-base font-medium">Category</label>
                          <Select 
                            value={selectedCategory} 
                            onValueChange={setSelectedCategory}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <label className="text-base font-medium">Condition</label>
                          <Select 
                            value={selectedCondition} 
                            onValueChange={setSelectedCondition}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditions.map((condition) => (
                                <SelectItem key={condition.value} value={condition.value}>
                                  {condition.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <label className="text-base font-medium">Sort By</label>
                          <Select 
                            value={selectedSort} 
                            onValueChange={setSelectedSort}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              {sortOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                
                {/* Desktop filters */}
                <div className="hidden lg:flex gap-4">
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={selectedSort} 
                    onValueChange={setSelectedSort}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-4">Top Categories Catalog</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {categories.filter(cat => cat.value !== "all").map((category) => (
                  <Card key={category.value} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="relative h-44 w-full bg-gray-50">
                      <Image 
                        src={getCategoryImage(category.value)}
                        alt={category.label}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-base">{category.label}</h3>
                      <p className="text-muted-foreground text-sm mt-1">from 10$</p>
                      <Button variant="outline" className="w-full mt-3 text-sm h-8">
                        Show 21 Offers
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
              
              <h2 className="text-lg font-semibold mb-4">Recently Added Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.slice(0, 6).map((item) => (
                    <ListItem key={item.id} item={item} />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center">
                    <h3 className="text-xl font-medium">No items found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="trending">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems
                  .filter(item => {
                    const daysUntilExpiry = Math.ceil(
                      (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return daysUntilExpiry <= 30;
                  })
                  .map((item) => (
                    <ListItem key={item.id} item={item} />
                  ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="my-listings">
              <div className="space-y-6">
                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-800">New Interest Notification</h4>
                        <p className="text-blue-700 text-sm">Memorial Medical Center is interested in your N95 Respirator Masks (Qty: 75)</p>
                      </div>
                      <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">My Active Listings</h3>
                  <Button onClick={() => setIsDialogOpen(true)} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Listing
                  </Button>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Image</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Hospital/Dept</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myListings.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  width={40}
                                  height={40}
                                  className="object-contain"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No image</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatDate(item.expiryDate)}</TableCell>
                          <TableCell>{item.hospital} / {item.department}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="whitespace-nowrap">
                              {item.condition}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                              {item.discount}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={(newItem: Omit<SupplyItem, "id">) => {
          const itemWithCategory = {
            ...newItem,
            category: newItem.category || "Other",
            id: Date.now().toString(),
          };
          setItems([itemWithCategory, ...items]);
          setIsDialogOpen(false);
        }}
        categories={categories.filter(c => c.value !== "all")}
      />
    </div>
  );
}