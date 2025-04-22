import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  FileText, 
  ShoppingCart, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Package
} from "lucide-react"
import Link from "next/link"
import { DynamicDate } from "../components/DynamicDate"

export default function VendorDashboard() {
  // Mock RFQ list data
  const rfqList = [
    {
      id: "RFQ-2023-089",
      hospital: "Memorial Hospital",
      dueDate: "Jun 28, 2023",
      status: "urgent"
    },
    {
      id: "RFQ-2023-075",
      hospital: "City Medical Center",
      dueDate: "Jul 5, 2023",
      status: "pending"
    },
    {
      id: "RFQ-2023-067",
      hospital: "Regional Healthcare",
      dueDate: "Jul 12, 2023",
      status: "pending"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <DynamicDate />
      </div>

      {/* Stats cards - 4 in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active RFQs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 pending shipment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sales Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">Compared to last quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quote Acceptance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
            <p className="text-xs text-muted-foreground">Year-to-date average</p>
          </CardContent>
        </Card>
      </div>

      {/* Two cards in the middle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent RFQs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-primary">Recent RFQs</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/vendor-dashboard/rfq">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rfqList.map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="font-medium text-primary">{item.id}</div>
                    <div className="text-sm text-muted-foreground">{item.hospital}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-right text-muted-foreground">{item.dueDate}</div>
                    <Badge variant={item.status === "urgent" ? "destructive" : "outline"} className="font-medium">
                      {item.status === "urgent" ? "Due Soon" : "Pending"}
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/vendor-dashboard/rfq/${item.id}`}>Respond</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-primary">Recent Orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/vendor-orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "ORD-39857",
                  hospital: "Memorial Hospital",
                  date: "Jun 15, 2023",
                  status: "shipped"
                },
                {
                  id: "ORD-39826",
                  hospital: "City Medical Center",
                  date: "Jun 12, 2023",
                  status: "processing"
                },
                {
                  id: "ORD-39785",
                  hospital: "County Hospital",
                  date: "Jun 8, 2023",
                  status: "delivered"
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="font-medium text-primary">{item.id}</div>
                    <div className="text-sm text-muted-foreground">{item.hospital}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-right text-muted-foreground">{item.date}</div>
                    <Badge variant={
                      item.status === "shipped" ? "secondary" : 
                      item.status === "processing" ? "outline" : 
                      "default"
                    } className="font-medium">
                      {item.status === "shipped" ? (
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span>Shipped</span>
                        </div>
                      ) : item.status === "processing" ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Processing</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Delivered</span>
                        </div>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 