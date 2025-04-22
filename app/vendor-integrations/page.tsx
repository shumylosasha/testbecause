import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Link, 
  DownloadCloud, 
  Server, 
  FileJson, 
  RefreshCw, 
  ChevronRight,
  CheckCircle2, 
  AlertCircle,
  Webhook,
  Settings,
  Database,
  ShoppingCart
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function VendorIntegrations() {
  const integrations = [
    {
      id: "api-1",
      name: "Hospital ERP System",
      type: "API",
      lastSync: "Today at 9:42 AM",
      status: "active",
      description: "Connects to hospital enterprise resource planning systems for automated order processing."
    },
    {
      id: "edi-1",
      name: "EDI Connection",
      type: "EDI",
      lastSync: "Yesterday at 4:15 PM",
      status: "active",
      description: "Electronic Data Interchange for automated purchase orders and invoices."
    },
    {
      id: "webhook-1",
      name: "Inventory Webhooks",
      type: "Webhook",
      lastSync: "Jun 12, 2023",
      status: "active",
      description: "Real-time inventory updates pushed to hospital procurement systems."
    },
    {
      id: "api-2",
      name: "Logistics API",
      type: "API",
      lastSync: "Jun 10, 2023",
      status: "inactive",
      description: "Integration with shipping and logistics providers for order tracking."
    }
  ]

  const apiLogs = [
    {
      timestamp: "2023-06-15 09:42:34",
      endpoint: "/api/orders",
      method: "GET",
      status: "200 OK",
      response: "Retrieved 12 orders"
    },
    {
      timestamp: "2023-06-15 09:41:12",
      endpoint: "/api/inventory",
      method: "POST",
      status: "200 OK",
      response: "Updated 3 products"
    },
    {
      timestamp: "2023-06-14 16:38:27",
      endpoint: "/api/quotes",
      method: "POST",
      status: "201 Created",
      response: "Created new quote"
    },
    {
      timestamp: "2023-06-14 15:15:03",
      endpoint: "/api/orders/ORD-39785",
      method: "GET",
      status: "404 Not Found",
      response: "Order not found"
    },
    {
      timestamp: "2023-06-14 14:10:41",
      endpoint: "/api/products",
      method: "PUT",
      status: "200 OK",
      response: "Updated product information"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <Button>
          <Link className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {/* Integration metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Connected systems</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,438</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">312</div>
            <p className="text-xs text-muted-foreground">Events processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.7%</div>
            <p className="text-xs text-muted-foreground">Past 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Integration tabs and content */}
      <Tabs defaultValue="integrations">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api-docs">API Documentation</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrations" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                    <Badge variant={integration.status === "active" ? "default" : "outline"}>
                      {integration.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{integration.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span className="font-medium">{integration.lastSync}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center">
                    <Switch id={`switch-${integration.id}`} defaultChecked={integration.status === "active"} />
                    <Label htmlFor={`switch-${integration.id}`} className="ml-2">Enabled</Label>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
              <CardDescription>
                Connect to more systems to streamline your operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-dashed">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm">ERP Systems</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Connect to major ERP systems like SAP, Oracle, and Microsoft Dynamics.
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" size="sm">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border border-dashed">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm">Supply Chain</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Connect with major supply chain management platforms and logistics providers.
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" size="sm">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border border-dashed">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm">Data Export</CardTitle>
                    <DownloadCloud className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Export your data to various file formats and third-party analytics tools.
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" size="sm">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-docs" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Access our API to automate your workflow and integrate with your systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Getting Started</h3>
                  <p className="text-sm text-muted-foreground">
                    Our REST API allows you to programmatically access your vendor account data and functionalities.
                    Use your API key to authenticate requests.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Authentication</h3>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Endpoints</h3>
                  <div className="space-y-3">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">GET</Badge>
                        <span className="font-mono text-sm">/api/v1/products</span>
                      </div>
                      <p className="text-sm text-muted-foreground">List all products in your catalog</p>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">POST</Badge>
                        <span className="font-mono text-sm">/api/v1/quotes</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Create a new quote</p>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">GET</Badge>
                        <span className="font-mono text-sm">/api/v1/orders</span>
                      </div>
                      <p className="text-sm text-muted-foreground">List all orders</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1">
                  <FileJson className="mr-2 h-4 w-4" />
                  Swagger Documentation
                </Button>
                <Button className="flex-1">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download API Key
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>API Logs</CardTitle>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead className="hidden md:table-cell">Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Response</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiLogs.map((log, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={
                            log.method === "GET" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                            log.method === "POST" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                            log.method === "PUT" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                            "bg-red-100 text-red-800 hover:bg-red-100"
                          }>
                            {log.method}
                          </Badge>
                          <span>{log.endpoint}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">{log.method}</TableCell>
                      <TableCell>
                        <Badge variant={log.status.startsWith("2") ? "default" : "destructive"}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs">{log.response}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">Previous</Button>
              <div className="text-sm text-muted-foreground">Page 1 of 12</div>
              <Button variant="outline" size="sm">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Configure your integration preferences and API settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Webhook Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive real-time notifications for events</p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>API Rate Limiting</Label>
                    <p className="text-xs text-muted-foreground">Limit API requests to prevent overload</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automated Sync</Label>
                    <p className="text-xs text-muted-foreground">Automatically sync data with connected systems</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Error Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive email alerts for integration errors</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 