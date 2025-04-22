import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  FileText, 
  Filter, 
  Search, 
  CalendarIcon 
} from "lucide-react"
import Link from "next/link"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RFQListPage() {
  // Mock RFQ data
  const rfqList = [
    {
      id: "RFQ-2023-089",
      title: "Q2 Medical Supplies Procurement",
      hospital: "Memorial Hospital",
      issueDate: "Jun 15, 2023",
      dueDate: "Jun 28, 2023",
      itemCount: 3,
      status: "urgent"
    },
    {
      id: "RFQ-2023-075",
      title: "Surgical Equipment Replacement",
      hospital: "City Medical Center",
      issueDate: "Jun 10, 2023",
      dueDate: "Jul 5, 2023",
      itemCount: 8,
      status: "pending"
    },
    {
      id: "RFQ-2023-067",
      title: "Laboratory Supplies Restock",
      hospital: "Regional Healthcare",
      issueDate: "Jun 5, 2023",
      dueDate: "Jul 12, 2023",
      itemCount: 12,
      status: "pending"
    },
    {
      id: "RFQ-2023-062",
      title: "Emergency Room Supplies",
      hospital: "County Hospital",
      issueDate: "Jun 1, 2023",
      dueDate: "Jun 20, 2023",
      itemCount: 5,
      status: "urgent"
    },
    {
      id: "RFQ-2023-058",
      title: "Diagnostic Equipment Maintenance",
      hospital: "Memorial Hospital",
      issueDate: "May 28, 2023",
      dueDate: "Jun 15, 2023",
      itemCount: 2,
      status: "expired"
    },
    {
      id: "RFQ-2023-051",
      title: "Sterilization Supplies Annual Order",
      hospital: "City Medical Center",
      issueDate: "May 20, 2023",
      dueDate: "Jun 10, 2023",
      itemCount: 9,
      status: "expired"
    },
    {
      id: "RFQ-2023-045",
      title: "Respiratory Care Equipment",
      hospital: "Regional Healthcare",
      issueDate: "May 15, 2023",
      dueDate: "Jun 5, 2023",
      itemCount: 4,
      status: "answered"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/vendor-dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Request for Quotes</h1>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">All RFQs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rfqList.length}</div>
            <p className="text-xs text-muted-foreground">Last 90 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rfqList.filter(rfq => rfq.status === "urgent").length}</div>
            <p className="text-xs text-muted-foreground">Need quick response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rfqList.filter(rfq => rfq.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Answered</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rfqList.filter(rfq => rfq.status === "answered").length}</div>
            <p className="text-xs text-muted-foreground">Quotes submitted</p>
          </CardContent>
        </Card>
      </div>

      {/* RFQ List Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <CardTitle>Request for Quotes</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search RFQs..."
                  className="pl-8 w-[200px] md:w-[300px]"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All RFQs</SelectItem>
                  <SelectItem value="urgent">Due Soon</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Hospital</TableHead>
                <TableHead className="hidden md:table-cell">Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="hidden sm:table-cell">Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqList.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-medium">{rfq.id}</TableCell>
                  <TableCell>{rfq.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{rfq.hospital}</TableCell>
                  <TableCell className="hidden md:table-cell">{rfq.issueDate}</TableCell>
                  <TableCell>{rfq.dueDate}</TableCell>
                  <TableCell className="hidden sm:table-cell">{rfq.itemCount}</TableCell>
                  <TableCell>
                    <Badge variant={
                      rfq.status === "urgent" ? "destructive" : 
                      rfq.status === "pending" ? "outline" : 
                      rfq.status === "answered" ? "secondary" :
                      "default"
                    }>
                      {rfq.status === "urgent" ? "Due Soon" : 
                      rfq.status === "pending" ? "Pending" : 
                      rfq.status === "answered" ? "Answered" :
                      "Expired"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {rfq.status !== "expired" && rfq.status !== "answered" ? (
                      <Button size="sm" asChild>
                        <Link href={`/vendor-dashboard/rfq/${rfq.id}`}>
                          {rfq.status === "urgent" ? "Respond Now" : "Respond"}
                        </Link>
                      </Button>
                    ) : rfq.status === "answered" ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/vendor-dashboard/rfq/${rfq.id}`}>View Quote</Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>Expired</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 