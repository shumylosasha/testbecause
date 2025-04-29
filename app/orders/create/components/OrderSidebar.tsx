import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Truck, Users, Sparkles } from "lucide-react"

interface OrderSidebarProps {
  selectedItems: any[] // Replace with proper type from your items interface
  className?: string
}

export function OrderSidebar({ selectedItems, className = "" }: OrderSidebarProps) {
  if (selectedItems.length === 0) return null

  return (
    <div className={`w-[360px] space-y-4 pt-[120px] ${className}`}>
      {/* Budget Section */}
      <Card>
        <CardHeader className="border-b bg-muted/30 py-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Budget</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-sm mb-3">
            <div className="flex-1">
              <div className="w-full h-[12px] bg-gray-200 rounded-full overflow-hidden">
                <div className="relative w-full h-full">
                  <div className="absolute left-0 h-full rounded-l-full bg-gray-500" style={{ width: '35%' }}></div>
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span>Spent: $35,000</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                  <span>Left: $40,000</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Combine Order Section */}
      <Card>
        <CardHeader className="border-b bg-muted/30 py-3">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Combine Order</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-1 text-xs mb-3">
            <Truck className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-muted-foreground">Add a partner to fill the truck completely</span>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between items-baseline text-sm mb-1.5">
              <span className="text-muted-foreground">Truck Capacity</span>
              <span className="font-medium">40% filled</span>
            </div>
            <div className="w-full h-[6px] bg-muted/40 rounded-full">
              <div className="h-full rounded-full bg-blue-500" style={{ width: '40%' }}></div>
            </div>
          </div>
          
          <Button size="sm" variant="outline" className="w-full h-7 text-xs text-center justify-center">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Find Partner
          </Button>
        </CardContent>
      </Card>

      {/* AI Insights Section */}
      <Card>
        <CardHeader className="border-b bg-muted/30 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">AI Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-700 mb-2">3 items in this order are nearing budget limit for Surgery Department.</p>
                <Button size="sm" variant="outline" className="h-7 w-full text-xs text-center justify-center bg-white text-blue-700 border-blue-200 hover:bg-blue-50">
                  Review Items
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 