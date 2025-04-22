import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  Calendar, 
  ClipboardList, 
  Building, 
  User, 
  FileSpreadsheet, 
  PlusCircle,
  Package,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for catalog items that can be added to the quote
const catalogItems = [
  {
    id: "PRD-1248",
    name: "Surgical Gloves (Medium)",
    category: "PPE",
    sku: "SRG-GLV-MED",
    price: 12.99,
    stock: 842
  },
  {
    id: "PRD-1247",
    name: "IV Catheter 20G",
    category: "Medical Supplies",
    sku: "IV-CTH-20G",
    price: 3.25,
    stock: 1204
  },
  {
    id: "PRD-1245",
    name: "Examination Gloves (Large)",
    category: "PPE",
    sku: "EXM-GLV-LRG",
    price: 9.99,
    stock: 742
  },
  {
    id: "PRD-1242",
    name: "Surgical Mask Level 3",
    category: "PPE",
    sku: "SRG-MSK-LV3",
    price: 14.50,
    stock: 215
  },
  {
    id: "PRD-1238",
    name: "Alcohol Prep Pads",
    category: "Medical Supplies",
    sku: "ALC-PREP-PAD",
    price: 2.75,
    stock: 3500
  }
];

export default function RFQPage({ params }: { params: { id: string } }) {
  // Mock RFQ data that would come from an API in a real implementation
  const rfq = {
    id: params.id || "RFQ-2023-089",
    title: "Q2 Medical Supplies Procurement",
    status: "pending",
    dueDate: "June 28, 2023",
    issueDate: "June 15, 2023",
    hospital: {
      name: "Memorial Hospital",
      address: "123 Medical Center Blvd, Springfield, IL 62701",
      contact: "Dr. Sarah Johnson",
      email: "procurement@memorialhospital.org",
      phone: "(555) 123-4567"
    },
    description: "Request for Quote for Q2 medical supplies including PPE, catheters, and general medical consumables. Please provide competitive pricing with consideration for bulk discounts. Delivery expected within 2 weeks of order confirmation.",
    items: [
      {
        id: 1,
        name: "Surgical Gloves (Medium)",
        description: "Powder-free, latex-free, size medium",
        quantity: 5000,
        unit: "pairs",
        specifications: "Must be compliant with ASTM D3578 and EN 455 standards",
      },
      {
        id: 2,
        name: "IV Catheter 20G",
        description: "20G IV catheter with safety mechanism",
        quantity: 2000,
        unit: "pieces",
        specifications: "Safety-engineered feature to prevent needlestick injuries, sterile, individually packaged",
      },
      {
        id: 3,
        name: "Surgical Masks Level 3",
        description: "High fluid resistance, Class I medical device",
        quantity: 10000,
        unit: "pieces",
        specifications: "ASTM F2100 Level 3, with ear loops, >98% bacterial filtration efficiency",
      }
    ],
    attachments: [
      {
        name: "RFQ_Details.pdf",
        size: "1.2 MB",
        type: "PDF",
        url: "#"
      },
      {
        name: "Product_Specifications.xlsx",
        size: "458 KB",
        type: "Excel",
        url: "#"
      }
    ]
  };

  // Initial quote items based on requested items
  const initialQuoteItems = rfq.items.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: 0,
    total: 0,
    note: ""
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/vendor-dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">RFQ Details</h1>
          <Badge variant={rfq.status === "urgent" ? "destructive" : "outline"} className="ml-2">
            {rfq.status === "urgent" ? "Due Soon" : "Pending"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download RFQ
          </Button>
          <Button>Submit Quote</Button>
        </div>
      </div>

      {/* RFQ Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{rfq.title}</CardTitle>
            <CardDescription>RFQ ID: {rfq.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Issue Date</span>
                </div>
                <div>{rfq.issueDate}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due Date</span>
                </div>
                <div>{rfq.dueDate}</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                <ClipboardList className="h-4 w-4" />
                <span>Description</span>
              </div>
              <p className="text-sm">{rfq.description}</p>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
                <Building className="h-4 w-4" />
                <span>Hospital Information</span>
              </div>
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="font-medium">{rfq.hospital.name}</div>
                <div>{rfq.hospital.address}</div>
                <div className="mt-2">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{rfq.hospital.contact}</span>
                  </div>
                  <div>{rfq.hospital.email}</div>
                  <div>{rfq.hospital.phone}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RFQ Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rfq.attachments.map((attachment, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-muted rounded-md p-2">
                    {attachment.type === "PDF" ? (
                      <FileSpreadsheet className="h-5 w-5 text-red-500" />
                    ) : (
                      <FileSpreadsheet className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{attachment.name}</div>
                    <div className="text-xs text-muted-foreground">{attachment.size}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={attachment.url}>
                    <Download className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Download All Files
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Requested Items */}
      <Card>
        <CardHeader>
          <CardTitle>Requested Items</CardTitle>
          <CardDescription>Items requested by the hospital in this RFQ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Specifications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfq.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.quantity.toLocaleString()}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.specifications}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quote Preparation */}
      <Tabs defaultValue="add-items" className="w-full">
        <CardHeader className="px-0 pt-0">
          <div className="flex justify-between items-center">
            <CardTitle>Quote Preparation</CardTitle>
            <TabsList>
              <TabsTrigger value="add-items">Add Items</TabsTrigger>
              <TabsTrigger value="upload-excel">Upload Excel</TabsTrigger>
            </TabsList>
          </div>
          <CardDescription>Prepare your quote response by adding items or uploading an Excel file</CardDescription>
        </CardHeader>

        <TabsContent value="add-items" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Quote Items</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add from Catalog
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Add Items from Catalog</DialogTitle>
                      <DialogDescription>
                        Select products from your catalog to add to this quote
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="relative mb-4">
                      <Input 
                        placeholder="Search products..." 
                        className="pl-8"
                      />
                      <div className="absolute left-2.5 top-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                      </div>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {catalogItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <input 
                                  type="checkbox" 
                                  id={`select-${item.id}`} 
                                  className="rounded border-gray-300"
                                />
                              </TableCell>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.sku}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{item.stock}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Selected Items</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Unit Price ($)</TableHead>
                    <TableHead className="text-right">Total ($)</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialQuoteItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          defaultValue={item.quantity} 
                          className="w-20 h-8"
                        />
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-right">
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          className="w-24 h-8 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right">$0.00</TableCell>
                      <TableCell>
                        <Input 
                          placeholder="Add note..." 
                          className="h-8 w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Add an additional row showing a successfully added catalog item */}
                  <TableRow>
                    <TableCell className="font-medium">
                      Alcohol Prep Pads
                      <Badge variant="outline" className="ml-2">From Catalog</Badge>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        defaultValue={1000} 
                        className="w-20 h-8"
                      />
                    </TableCell>
                    <TableCell>pieces</TableCell>
                    <TableCell className="text-right">
                      <Input 
                        type="number" 
                        step="0.01" 
                        defaultValue="2.75"
                        className="w-24 h-8 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right">$2,750.00</TableCell>
                    <TableCell>
                      <Input 
                        placeholder="Add note..." 
                        defaultValue="Bulk pricing applied"
                        className="h-8 w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="space-y-1">
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-3 w-3" />
                  Add Custom Item
                </Button>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-sm font-medium">Subtotal: $2,750.00</div>
                <div className="text-sm font-medium">Tax (5%): $137.50</div>
                <div className="text-lg font-bold">Total: $2,887.50</div>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Select defaultValue="net30">
                    <SelectTrigger id="payment-terms">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                      <SelectItem value="net90">Net 90</SelectItem>
                      <SelectItem value="immediate">Immediate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-method">Shipping Method</Label>
                  <Select defaultValue="ground">
                    <SelectTrigger id="shipping-method">
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ground">Ground</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="overnight">Overnight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-timeframe">Delivery Timeframe</Label>
                <Select defaultValue="1-2weeks">
                  <SelectTrigger id="delivery-timeframe">
                    <SelectValue placeholder="Select delivery timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">Within 1 week</SelectItem>
                    <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2-4weeks">2-4 weeks</SelectItem>
                    <SelectItem value="4-8weeks">4-8 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add any additional information or terms for this quote..." 
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Save Draft</Button>
            <Button>Submit Quote</Button>
          </div>
        </TabsContent>

        <TabsContent value="upload-excel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Quote Excel</CardTitle>
              <CardDescription>
                Upload a completed Excel file with your quote information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">Drag and drop or click to upload</p>
                  <p className="text-xs text-muted-foreground">
                    Support for Excel files (.xlsx, .xls)
                  </p>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Select File
                </Button>
              </div>
              
              <div className="bg-muted rounded-md p-3 text-sm">
                <p className="font-medium">Instructions:</p>
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  <li>Download the <a href="#" className="text-primary underline">quote template</a></li>
                  <li>Fill in the required information for each requested item</li>
                  <li>Save the file and upload it here</li>
                  <li>Review the imported data before submitting</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <Button disabled>
                Upload and Continue
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button disabled>Submit Quote</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 