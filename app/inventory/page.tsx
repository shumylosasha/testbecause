"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, MoreHorizontal, Upload, Plus, Bot, X } from "lucide-react"
import { inventoryData } from "@/data/inventory-data"
import Link from "next/link"
import { InventoryQuickActions } from "../components/inventory-quick-actions"
import Image from "next/image"
import AiInsightOverlay from "../components/AiInsightOverlay"
import GenericInsightOverlay from "../components/GenericInsightOverlay"

// Define the AiInsight type locally or import if shared
interface AiInsight {
  items: string[];
  reason: string;
  trendData?: any; // Placeholder for chart data
}

export default function InventoryPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState(inventoryData)
  const [isAiInsightOpen, setIsAiInsightOpen] = useState(false) // State for overlay visibility
  const [selectedInsight, setSelectedInsight] = useState<AiInsight | null>(null) // State for insight data
  const [isGenericInsightOpen, setIsGenericInsightOpen] = useState(false)
  const [genericInsightContent, setGenericInsightContent] = useState<React.ReactNode>(null)
  const [genericInsightTitle, setGenericInsightTitle] = useState<string>("AI Product Matches")

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "stock":
        return "bg-green-100 text-green-800"
      case "low":
        return "bg-amber-100 text-amber-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
    if (selectedItems.length > 0) {
      window.location.href = "/orders/create"
    }
  }

  const handleNewItemsAdded = (newItems: any[]) => {
    setItems(prevItems => [...newItems, ...prevItems])
  }

  // Placeholder insight data
  const currentInsight: AiInsight = {
    items: ["IV Catheters 20G", "Surgical Masks"],
    reason: "based on seasonal trends and recent usage velocity.",
    trendData: null // Placeholder for actual chart data
  }

  const handleViewInsight = () => {
    setSelectedInsight(currentInsight)
    setIsAiInsightOpen(true)
  }

  const handleAIInsight = (insight: any) => {
    if (insight?.trendData?.type === "product_match") {
      setGenericInsightTitle("AI Product Matches")
      setGenericInsightContent(
        <div>
          <p className="mb-4 text-base">Here are <b>{insight.items.length}</b> products that match your needs:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {insight.trendData.details.map((item: any, idx: number) => (
              <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={48} height={48} className="rounded bg-white object-contain border w-12 h-12" unoptimized />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded"> <span className="text-gray-400 text-xs">No image</span> </div>
                  )}
                  <div>
                    <div className="font-semibold text-blue-700 text-base">{item.name}</div>
                    {typeof item.matchScore === 'number' && (
                      <div className="text-xs text-gray-500">Match: <span className="font-bold">{(item.matchScore * 100).toFixed(0)}%</span></div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Price: <span className="font-medium">${item.currentPrice}</span> → <span className="text-green-700 font-medium">${item.suggestedPrice}</span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button size="sm" className="flex-1 bg-primary text-white hover:bg-primary/90" onClick={() => alert(`Added ${item.name} to order!`)}>Add to Order</Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => alert(`Viewing details for ${item.name}`)}>View Details</Button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-700 text-sm">These were selected based on your recent inventory trends and price drops.</p>
        </div>
      )
      setIsGenericInsightOpen(true)
    } else {
      setSelectedInsight(insight)
      setIsAiInsightOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Items</CardTitle>
            <CardDescription>Manage your hospital inventory items</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-300 bg-blue-50/70 py-3 px-4">
            <Bot className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="text-sm text-blue-900"><span className="font-bold text-blue-700">{currentInsight.items[0]}</span> and <span className="font-bold text-blue-700">{currentInsight.items[1]}</span> are running low and may need reordering based on seasonal trends.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-sm shrink-0 border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900"
                  onClick={handleViewInsight} // Attach the handler
                >
                  View
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-5 w-5 -mr-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredItems.length > 0 && selectedItems.length === filteredItems.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-12">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Packaging</TableHead>
                  <TableHead>Expires In</TableHead>
                  <TableHead className="text-center">
                    <span className="font-semibold text-primary">Swaps</span>
                  </TableHead>
                  <TableHead className="text-center">
                    <span className="font-semibold text-primary">Potential Savings</span>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                        aria-label={`Select ${item.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
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
                      <Link href={`/inventory/${item.id}`} className="hover:underline text-primary">
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>
                      {item.currentStock}/{item.totalStock}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.packaging}</TableCell>
                    <TableCell>{item.expiresIn}</TableCell>
                    <TableCell className="text-center">
                      {item.vendors && item.vendors.length > 0 ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                        >
                          {item.vendors.length}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.potentialSavings > 0 ? (
                        <div className="text-green-600 font-medium">
                          {Math.round((item.potentialSavings / (item.unitPrice * item.requiredUnits)) * 100)}%
                        </div>
                      ) : (
                        <div className="text-center">-</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => (window.location.href = `/inventory/${item.id}`)}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit item</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Add to order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <InventoryQuickActions
        onAddItem={handleAddItem}
        onUploadInventory={handleUploadInventory}
        onChatWithAI={handleChatWithAI}
        selectedItemsCount={selectedItems.length}
        onCreateOrder={handleCreateOrder}
        onNewItemsAdded={handleNewItemsAdded}
        onViewAIInsight={handleAIInsight}
      />

      <AiInsightOverlay 
        isOpen={isAiInsightOpen}
        onClose={() => setIsAiInsightOpen(false)}
        insight={selectedInsight}
      />

      <GenericInsightOverlay
        isOpen={isGenericInsightOpen}
        onClose={() => setIsGenericInsightOpen(false)}
        title={genericInsightTitle}
        icon={<Bot className="h-5 w-5 text-blue-600" />}
        content={genericInsightContent}
        actions={
          <Button onClick={() => setIsGenericInsightOpen(false)} className="w-full">Close</Button>
        }
      />
    </div>
  )
}

