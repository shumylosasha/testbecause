import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, Users, AlertTriangle, BarChart3, ArrowUpCircle } from "lucide-react"
import { DynamicDate } from "./components/DynamicDate"
import { OrderItem } from "./components/OrderItem"
import { ProductDiscovery } from "./components/ProductDiscovery"
import { QuickActionsToolbar } from "@/components/ui/quick-actions"

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DynamicDate />
      </div>

      {/* Stats cards - 4 in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,568</div>
            <p className="text-xs text-muted-foreground">YTD through alternatives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64.3%</div>
            <p className="text-xs text-muted-foreground">Q2 spending on track</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Gains</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8%</div>
            <p className="text-xs text-muted-foreground">Improved processing time</p>
          </CardContent>
        </Card>
      </div>

      {/* Two cards in the middle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <OrderItem key={i} index={i} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Surgical Gloves (Medium)",
                  status: "Low Stock",
                  level: "warning",
                },
                {
                  name: "IV Catheters 20G",
                  status: "Urgent",
                  level: "critical",
                },
                {
                  name: "Alcohol Prep Pads",
                  status: "Price Increase",
                  level: "info",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={cn(
                        "h-4 w-4",
                        item.level === "critical"
                          ? "text-destructive"
                          : item.level === "warning"
                            ? "text-amber-500"
                            : "text-blue-500",
                      )}
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.status}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Discovery at the bottom */}
      <ProductDiscovery />

      {/* Quick Actions Toolbar */}
      <QuickActionsToolbar />
    </div>
  )
}

