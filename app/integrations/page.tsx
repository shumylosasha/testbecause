import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Link, 
  Database, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Zap,
  FileText,
  ShoppingCart,
  Users,
  Building,
  Stethoscope,
  TrendingUp,
  Banknote,
  ClipboardList,
  BarChart4
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
import Image from "next/image"

// Function to get logo size constraints based on integration ID
const getLogoSize = (id: string) => {
  switch (id) {
    case 'epic-systems':
      return { width: 80, height: 30, className: "object-contain max-h-8" };
    case 'infor-lawson':
      return { width: 80, height: 30, className: "object-contain max-h-8" };
    default:
      return { width: 120, height: 40, className: "object-contain" };
  }
};

export default function Integrations() {
  // Sample data for existing integrations
  const activeIntegrations = [
    {
      id: "oracle-erp",
      name: "Oracle ERP Cloud",
      type: "API",
      lastSync: "Today at 10:15 AM",
      status: "active",
      description: "Enterprise resource planning integration for financial management.",
      logo: "https://cdn.freelogovectors.net/wp-content/uploads/2022/02/oracle_cloud_erp_logo_freelogovectors.net_.png"
    },
    {
      id: "workday-hr",
      name: "Workday HR",
      type: "API",
      lastSync: "Today at 9:30 AM",
      status: "active",
      description: "Human resources and employee management integration.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Workday_Logo.png/1280px-Workday_Logo.png"
    },
    {
      id: "coupa-procurement",
      name: "Coupa Procurement",
      type: "API",
      lastSync: "Yesterday at 4:45 PM",
      status: "active",
      description: "Spend management and procurement platform integration.",
      logo: "https://companieslogo.com/img/orig/COUP_BIG-46b5bd44.png?t=1720244491"
    }
  ]

  // Sample data for available integrations
  const availableIntegrations = [
    {
      id: "epic-systems",
      name: "Epic Systems",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Epic_Systems.svg/1200px-Epic_Systems.svg.png",
      description: "Electronic health record system integration for patient data and clinical inventory."
    },
    {
      id: "sap-ariba",
      name: "SAP Ariba",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDUZpDNbqBfZ6QSft3d808G5Q4LJOX5Rd9sg&s",
      description: "Procurement and supply chain management integration."
    },
    {
      id: "salesforce-health",
      name: "Salesforce Health Cloud",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4YO1RAEDKL-gXLoyj9GYfxfq_YycVlcDA-g&s",
      description: "Patient relationship management and healthcare CRM."
    },
    {
      id: "cerner",
      name: "Cerner",
      logo: "https://seekvectorlogo.com/wp-content/uploads/2019/03/cerner-vector-logo.png",
      description: "Clinical and financial healthcare IT solutions."
    },
    {
      id: "meditech",
      name: "MEDITECH",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXEGTMIlmnLYyo1EpjoP4JNZDgVihf1ATgPQ&s",
      description: "Electronic health records and clinical information systems."
    },
    {
      id: "allscripts",
      name: "Allscripts",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9yNnDXJZ3_1DK0ecNSAQZXT4a1eYEa0jGWA&s",
      description: "Electronic health record, practice management, and population health management."
    },
    {
      id: "mckesson",
      name: "McKesson",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/McKesson_logo.svg/1280px-McKesson_logo.svg.png",
      description: "Enterprise resource planning and supply chain management for healthcare."
    },
    {
      id: "athenahealth",
      name: "athenahealth",
      logo: "https://download.logo.wine/logo/Athenahealth/Athenahealth-Logo.wine.png",
      description: "Revenue cycle management, medical billing, and EHR services."
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

      {/* Integration tabs and content */}
      <Tabs defaultValue="integrations">
        <TabsList>
          <TabsTrigger value="integrations">All Integrations</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrations" className="space-y-6 mt-4">
          {/* Active Integrations Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {activeIntegrations.map((integration) => {
                const logoSize = getLogoSize(integration.id);
                return (
                <Card key={integration.id} className="hover:shadow-md transition-shadow h-[280px] flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2 w-full">
                        <div className="h-12 relative flex items-center">
                          <Image
                            src={integration.logo}
                            alt={integration.name}
                            width={logoSize.width}
                            height={logoSize.height}
                            className={logoSize.className}
                          />
                        </div>
                        <div>
                          <CardDescription className="line-clamp-2 mt-2">{integration.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="default" className="ml-2 shrink-0">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{integration.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="font-medium">{integration.lastSync}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between mt-auto">
                    <div className="flex items-center">
                      <Switch id={`switch-${integration.id}`} defaultChecked={integration.status === "active"} />
                      <Label htmlFor={`switch-${integration.id}`} className="ml-2">Enabled</Label>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                      <Settings className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )})}
            </div>
          </div>

          {/* Available Integrations Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableIntegrations.map((integration) => {
                const logoSize = getLogoSize(integration.id);
                return (
                <Card key={integration.id} className="hover:shadow-md transition-shadow h-[280px] flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2 w-full">
                        <div className="h-12 relative flex items-center">
                          <Image
                            src={integration.logo}
                            alt={integration.name}
                            width={logoSize.width}
                            height={logoSize.height}
                            className={logoSize.className}
                          />
                        </div>
                        <div>
                          <CardDescription className="line-clamp-2 mt-2">{integration.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2 shrink-0">
                        Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">API</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">Ready to connect</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between mt-auto">
                    <Button variant="outline" className="w-full" size="sm">
                      <Zap className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </CardFooter>
                </Card>
              )})}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Sync Logs</CardTitle>
              <CardDescription>View recent data synchronization activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Integration</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Today, 10:15 AM</TableCell>
                    <TableCell>Oracle ERP Cloud</TableCell>
                    <TableCell>Data Sync</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>
                    </TableCell>
                    <TableCell>124</TableCell>
                    <TableCell className="text-right">2.3s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Today, 9:30 AM</TableCell>
                    <TableCell>Workday HR</TableCell>
                    <TableCell>Full Sync</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>
                    </TableCell>
                    <TableCell>89</TableCell>
                    <TableCell className="text-right">4.1s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Yesterday, 4:45 PM</TableCell>
                    <TableCell>Coupa Procurement</TableCell>
                    <TableCell>Data Sync</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>
                    </TableCell>
                    <TableCell>56</TableCell>
                    <TableCell className="text-right">1.8s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Yesterday, 3:12 PM</TableCell>
                    <TableCell>Oracle ERP Cloud</TableCell>
                    <TableCell>Data Sync</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>
                    </TableCell>
                    <TableCell>118</TableCell>
                    <TableCell className="text-right">6.5s</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Yesterday, 1:30 PM</TableCell>
                    <TableCell>Workday HR</TableCell>
                    <TableCell>Data Sync</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>
                    </TableCell>
                    <TableCell>42</TableCell>
                    <TableCell className="text-right">2.7s</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">View All Logs</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure global integration preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Automatic Synchronization</h3>
                  <p className="text-sm text-muted-foreground">Allow systems to sync automatically on schedule</p>
                </div>
                <Switch id="auto-sync" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Error Notifications</h3>
                  <p className="text-sm text-muted-foreground">Send alert emails when integration errors occur</p>
                </div>
                <Switch id="error-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Detailed Logging</h3>
                  <p className="text-sm text-muted-foreground">Store detailed log information for troubleshooting</p>
                </div>
                <Switch id="detailed-logging" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Rate Limiting</h3>
                  <p className="text-sm text-muted-foreground">Apply rate limits to prevent API overload</p>
                </div>
                <Switch id="rate-limiting" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 