"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Package, Star, FileText, Clock, CheckCircle2, XCircle, AlertCircle, Filter, Search, ShoppingCart, Tag, ArrowLeft, Send, ImageIcon, ChevronDown, ChevronUp, FlagIcon, ArrowRight } from "lucide-react"
import { DynamicDate } from "../components/DynamicDate"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { inventoryData } from "@/data/inventory-data"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Define types for our feedback items
interface BaseFeedbackItem {
  type: "feedback" | "request" | "survey";
  product: string;
  image?: string;
  date: string;
  comment: string;
  status?: string;
  user?: string;
  department?: string;
  brand?: string;
  attachedPhotos?: string[];
  critical?: boolean;
  procurementResponse?: string;
  procurementResponseDate?: string;
  vendor?: string;
}

interface FeedbackItem extends BaseFeedbackItem {
  type: "feedback";
  user: string;
  department: string;
  rating: number;
}

interface RequestItem extends BaseFeedbackItem {
  type: "request";
  user: string;
  department: string;
  urgency?: string;
  requestId?: string;
  requestedQuantity?: string;
  expectedDelivery?: string;
}

interface SurveyItem extends BaseFeedbackItem {
  type: "survey";
  target: string;
  responses: number;
  vendor?: string;
  startDate?: string;
  targetResponses?: number;
  averageResponseRate?: number;
  respondents?: { id: string; name: string; image?: string }[];
  averageRating?: number;
}

type FeedItem = FeedbackItem | RequestItem | SurveyItem;

// Custom type for badge variants that includes teal
type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | "teal" | "green" | null | undefined;

// Type for related feedback
interface RelatedFeedback {
  user: string;
  department: string;
  rating?: number;
  comment: string;
  date: string;
}

// Type guard functions
function isFeedbackItem(item: FeedItem): item is FeedbackItem {
  return item.type === "feedback";
}

function isRequestItem(item: FeedItem): item is RequestItem {
  return item.type === "request";
}

function isSurveyItem(item: FeedItem): item is SurveyItem {
  return item.type === "survey";
}

export default function FeedbackPage() {
  // State for the side panel
  const [selectedFeedback, setSelectedFeedback] = useState<FeedItem | null>(null)
  const [sideViewOpen, setSideViewOpen] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [feedbackStatus, setFeedbackStatus] = useState("")
  const [feedbackTab, setFeedbackTab] = useState("details")

  // Find product images from inventory data
  const gloveImage = inventoryData.find(item => item.name === "Surgical Gloves (Medium)")?.image
  const maskImage = inventoryData.find(item => item.name === "N95 Respirator Masks")?.image
  const gownImage = inventoryData.find(item => item.name === "Disposable Surgical Gowns")?.image
  const ivSetImage = inventoryData.find(item => item.name === "IV Administration Sets")?.image
  const gauzeImage = inventoryData.find(item => item.name === "Sterile Gauze Pads")?.image

  // Example attached photos
  const exampleAttachedPhotos = [
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1586975949231-9374052a0d63?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]

  // Doctor photo URLs
  const doctorPhotos: Record<string, string> = {
    "Dr. Sarah Chen": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Dr. James Wilson": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Nurse Michael Wong": "https://plus.unsplash.com/premium_photo-1661757066209-3570ef8a89c1?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Nurse Lisa Johnson": "https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGRvY3RvciUyMHdvbWFufGVufDB8fDB8fHww",
    "Dr. Robert Taylor": "https://plus.unsplash.com/premium_photo-1681996484614-6afde0d53071?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    "Dr. Michael Thompson": "https://plus.unsplash.com/premium_photo-1661627338048-d5650cef65dd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }

  // Combined feed items for the All tab
  const allFeedItems: FeedItem[] = [
    {
      type: "feedback",
      product: "Surgical Gloves (Medium)",
      image: gloveImage,
      user: "Dr. Sarah Chen",
      department: "Surgery",
      rating: 2,
      comment: "The gloves are too thin and tear easily during procedures. This compromises sterility and safety during operations. We need better quality gloves that can withstand the rigors of surgical procedures.",
      date: "2 days ago",
      status: "New",
      brand: "MediGuard",
      attachedPhotos: [exampleAttachedPhotos[0]],
      critical: true,
      procurementResponse: "Investigating alternative suppliers. Temporary stock available.",
      procurementResponseDate: "1 day ago"
    },
    {
      type: "request",
      product: "Surgical Drapes - Emergency Order",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO5tWZA_FUd-qyPJ5J-ZrJwoSGHuORKv9Iog&s",
      department: "Emergency",
      user: "Dr. James Wilson",
      date: "2023-03-21",
      comment: "Current stock near depletion, increased surgical procedures scheduled",
      status: "In Stock",
      urgency: "High",
      brand: "Medline Sterile Surgical Drapes",
      critical: true,
      requestId: "SD-2024-03-21-001",
      requestedQuantity: "500 units",
      expectedDelivery: "March 22, 2024 (Express)",
      procurementResponse: "We've checked our inventory system and found that there is actually a supply of Medline Sterile Surgical Drapes (500+ units) already in the hospital. The stock is located in Storage Room B, Section 3, Shelf 2 in the East Wing. The inventory was recently moved during the department reorganization last week, which might explain why it wasn't found. Please contact Materials Management at ext. 4532 if you need assistance accessing these supplies.",
      procurementResponseDate: "Today, 10:45 AM"
    },
    {
      type: "survey",
      product: "Surgical Instruments",
      image: gauzeImage,
      target: "Surgeons",
      date: "2023-07-15",
      comment: "Quality assessment survey for surgical instruments",
      status: "Active",
      responses: 42,
      brand: "SurgePro",
      vendor: "MedTech Supplies",
      startDate: "2023-07-01",
      targetResponses: 50,
      averageResponseRate: 84,
      averageRating: 3.7,
      respondents: [
        { id: "1", name: "Dr. John Smith", image: doctorPhotos["Dr. James Wilson"] },
        { id: "2", name: "Dr. Sarah Chen", image: doctorPhotos["Dr. Sarah Chen"] },
        { id: "3", name: "Dr. Marcus Johnson" },
        { id: "4", name: "Dr. Emily Davis" },
        { id: "5", name: "Dr. Robert Taylor", image: doctorPhotos["Dr. Robert Taylor"] }
      ]
    },
    {
      type: "feedback",
      product: "N95 Respirator Masks",
      image: maskImage,
      user: "Nurse Michael Wong",
      department: "Pediatrics",
      rating: 4,
      comment: "Good protection but uncomfortable during extended wear.",
      date: "3 days ago",
      status: "Viewed",
      brand: "3Medical",
      attachedPhotos: [exampleAttachedPhotos[1]],
      procurementResponse: "Ordered samples from alternative suppliers for comfort evaluation.",
      procurementResponseDate: "Yesterday"
    },
    {
      type: "request",
      product: "Eco-Friendly Examination Gloves",
      image: gloveImage,
      department: "General Practice",
      user: "Nurse Lisa Johnson",
      date: "2023-07-28",
      comment: "Need latex-free alternatives for allergic patients.",
      status: "Under Review",
      urgency: "Medium",
      brand: "EcoGlove",
      requestId: "EG-2023-07-28-003",
      requestedQuantity: "200 boxes",
      expectedDelivery: "August 5, 2023 (Standard)"
    },
  ]
  
  // Related feedback data (feedback from other doctors for the same product)
  const relatedFeedbackData: Record<string, RelatedFeedback[]> = {
    "Surgical Gloves (Medium)": [
      {
        user: "Dr. John Smith",
        department: "Emergency",
        rating: 3,
        comment: "Quality is inconsistent between batches. Some are excellent while others tear too easily.",
        date: "1 week ago"
      },
      {
        user: "Dr. Emily Davis",
        department: "Surgery",
        rating: 2,
        comment: "The fit is too loose around the wrist, which creates a risk during procedures.",
        date: "2 weeks ago"
      }
    ],
    "N95 Respirator Masks": [
      {
        user: "Dr. Robert Lee",
        department: "Infectious Disease",
        rating: 5,
        comment: "Excellent filtration and seal. Meets all safety requirements for our department.",
        date: "5 days ago"
      },
      {
        user: "Nurse Jessica Kim",
        department: "ICU",
        rating: 3,
        comment: "Good protection but the straps break easily after extended use.",
        date: "1 week ago"
      }
    ],
    "Disposable Surgical Gowns": [
      {
        user: "Dr. Marcus Johnson",
        department: "Surgery",
        rating: 4,
        comment: "Good quality but would prefer more coverage in the back area.",
        date: "3 days ago"
      }
    ],
    "Advanced Pulse Oximeter": [
      {
        user: "Dr. Lisa Chen",
        department: "Cardiology",
        rating: 3,
        comment: "Accuracy is good but battery life is poor compared to previous models.",
        date: "4 days ago"
      }
    ],
    "Eco-Friendly Examination Gloves": [
      {
        user: "Dr. Sophia Martinez",
        department: "Dermatology",
        rating: 4,
        comment: "Good alternative for patients with latex allergies, but slightly less durable.",
        date: "5 days ago"
      }
    ]
  }

  // Function to handle opening the side view
  const handleViewDetails = (item: FeedItem) => {
    setSelectedFeedback(item)
    setFeedbackStatus(item.status || "")
    setFeedbackTab("details")
    setSideViewOpen(true)
  }

  // Function to handle status change
  const handleStatusChange = (value: string) => {
    setFeedbackStatus(value)
    // In a real app, you would save this status change to your backend
  }

  // Function to handle response submission
  const handleSubmitResponse = () => {
    if (responseText.trim()) {
      // In a real app, you would save this response to your backend
      // For now, we'll just clear the response text
      setResponseText("")
      // You could also update the status to "Responded" or something similar
    }
  }

  // Function to create an order from feedback
  const handleCreateOrder = () => {
    // In a real app, you would redirect to the order creation page with pre-filled details
    // or open a modal to create the order
    if (selectedFeedback) {
      alert(`Creating order for ${selectedFeedback.product}`)
    }
  }

  // Function to search inventory
  const handleSearchInventory = () => {
    // In a real app, you would redirect to the inventory page with pre-filled search
    // or open a modal to search inventory
    if (selectedFeedback) {
      alert(`Searching inventory for ${selectedFeedback.product}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feedback & Product Requests</h1>
        <DynamicDate />
      </div>

      <Tabs defaultValue="all" className="w-full">
        {/* <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="feedback">Product Feedback</TabsTrigger>
          <TabsTrigger value="requests">Product Requests</TabsTrigger>
          <TabsTrigger value="surveys">Feedback Surveys</TabsTrigger>
        </TabsList> */}
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Feed */}
            <div className="lg:col-span-2">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search feedback and requests..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {allFeedItems.map((item, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex flex-col gap-4">
                          <div className={`flex justify-between items-start p-3 rounded-md ${
                            item.type === "feedback" ? "bg-blue-50" :
                            item.type === "request" ? "bg-amber-50" :
                            "bg-emerald-50"
                          }`}>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{item.product}</h3>
                                <span className="text-xs border border-gray-300 rounded-full px-2 py-0.5 capitalize">
                                  {item.type}
                                </span>
                                {item.critical && (
                                  <Badge variant="outline" className="text-xs px-1.5 py-0 border-orange-500 text-orange-700 bg-orange-50">Critical</Badge>
                                )}
                              </div>
                              {item.type === "request" && "requestId" in item && item.requestId ? (
                                <p className="text-xs text-muted-foreground mt-1">
                                  <span className="font-medium">{item.requestId}</span>
                                </p>
                              ) : item.brand && item.type !== "request" ? (
                                <p className="text-xs text-muted-foreground mt-1">
                                  <span className="font-medium">{item.brand}</span>
                                </p>
                              ) : null}
                            </div>
                            <div>
                              {item.status && (
                                <Badge variant={
                                  item.status === "Pending" ? "outline" :
                                  item.status === "Under Review" || item.status === "Processing" ? "teal" :
                                  item.status === "Approved" || item.status === "In Stock" ? "green" :
                                  "destructive"
                                } className={
                                  item.status === "Active" ? "bg-black hover:bg-black" :
                                  item.status === "Processing" || item.status === "Under Review" ? "bg-teal-500 hover:bg-teal-600 text-white" :
                                  item.status === "In Stock" ? "bg-green-500 hover:bg-green-600 text-white" :
                                  ""
                                }>
                                  {item.status === "Under Review" ? "Processing" : item.status}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {item.type !== "survey" && item.user && (
                              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border bg-gray-50">
                                <Image 
                                  src={item.user && doctorPhotos[item.user] ? doctorPhotos[item.user] : `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user}`}
                                  alt={item.user || "User"}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium">
                                {item.type === "survey" && "target" in item ? 
                                  `Target: ${item.target}` : 
                                  item.user ? item.user : ""}
                              </p>
                              {item.department && (
                                <p className="text-xs text-muted-foreground">
                                  {item.department}
                                </p>
                              )}
                            </div>
                          </div>

                          {item.type === "feedback" && item.rating !== undefined && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < (item.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                ))}
                                <span className="text-sm ml-2">{item.rating}/5</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                            </div>
                          )}
                          
                          <p className="text-sm">{item.comment}</p>
                          
                          {/* Request details */}
                          {item.type === "request" && (
                            <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md text-sm">
                              <div className="grid grid-cols-3 gap-2">
                                {item.brand && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Preferred Brand</p>
                                    <p className="font-medium">{item.brand}</p>
                                  </div>
                                )}
                                {"requestedQuantity" in item && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Requested Quantity</p>
                                    <p className="font-medium">{item.requestedQuantity || "N/A"}</p>
                                  </div>
                                )}
                                {"expectedDelivery" in item && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Expected Delivery</p>
                                    <p className="font-medium">{item.expectedDelivery || "Not specified"}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Survey details */}
                          {item.type === "survey" && (
                            <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md text-sm">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border bg-gray-50">
                              {item.image ? (
                                <Image 
                                  src={item.image} 
                                  alt={item.product} 
                                  fill 
                                  className="object-cover"
                                        sizes="40px"
                                />
                              ) : (
                                      <div className="flex items-center justify-center h-full">
                                        <Package className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                                  <div>
                                    <p className="font-medium text-sm">{item.product}</p>
                                    {isSurveyItem(item) && item.vendor && (
                                      <p className="text-xs text-muted-foreground">{item.vendor}</p>
                                    )}
                                  </div>
                                </div>
                                {isSurveyItem(item) && item.averageRating && (
                                  <div className="flex items-center">
                                    <div className="flex items-center">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(item.averageRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                      ))}
                                    </div>
                                    <span className="text-sm ml-1 font-medium">{item.averageRating}</span>
                                  </div>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {isSurveyItem(item) && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Responses</p>
                                    <p className="text-sm font-medium">
                                      {item.responses}
                                      {item.targetResponses && 
                                        <span className="text-muted-foreground">/{item.targetResponses}</span>
                                      }
                                    </p>
                                  </div>
                                )}
                                {isSurveyItem(item) && item.startDate && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Start Date</p>
                                    <p className="text-sm font-medium">{item.startDate}</p>
                                  </div>
                                )}
                                {isSurveyItem(item) && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Response Rate</p>
                                    <p className="text-sm font-medium">{item.averageResponseRate || 0}%</p>
                                  </div>
                                )}
                              </div>
                              {"respondents" in item && item.respondents && item.respondents.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground mb-2">Respondents</p>
                                  <div className="flex flex-wrap">
                                    {item.respondents.slice(0, 5).map((respondent, idx) => (
                                      <div 
                                        key={respondent.id}
                                        className="relative w-8 h-8 rounded-full overflow-hidden border border-white -ml-2 first:ml-0 bg-gray-50"
                                        style={{ zIndex: 5 - idx }}
                                      >
                              <Image 
                                          src={respondent.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${respondent.name}`}
                                          alt={respondent.name}
                                fill
                                className="object-cover"
                                          sizes="32px"
                              />
                            </div>
                                    ))}
                                    {item.respondents.length > 5 && (
                                      <div className="relative w-8 h-8 rounded-full bg-gray-100 -ml-2 flex items-center justify-center text-xs font-medium text-gray-600 border border-white">
                                        +{item.respondents.length - 5}
                          </div>
                                    )}
                                </div>
                              </div>
                              )}
                            </div>
                          )}
                          
                          {/* Attached Photos Preview */}
                          {item.attachedPhotos && item.attachedPhotos.length > 0 && (
                            <div className="flex gap-4 flex-wrap">
                              {item.attachedPhotos.map((photo, photoIndex) => (
                                <div 
                                  key={photoIndex} 
                                  className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden border"
                                >
                                  <Image
                                    src={photo}
                                    alt={`Attached photo ${photoIndex + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                              ))}
                              </div>
                            )}
                          
                          {/* Procurement Response */}
                          {item.procurementResponse && (
                            <>
                              <div className="h-px bg-gray-200 my-2" />
                              <div className="p-2 bg-gray-50 rounded-md">
                                <div className="flex justify-between mb-1">
                                  <p className="text-xs font-semibold text-gray-700">Procurement Response</p>
                                  {item.procurementResponseDate && (
                                    <p className="text-xs text-gray-600">{item.procurementResponseDate}</p>
                                  )}
                            </div>
                                <p className="text-sm text-gray-700">{item.procurementResponse}</p>
                              </div>
                            </>
                          )}
                          
                          <div className="flex justify-between items-center">
                            {!item.type.includes("feedback") && (
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                            )}
                            {item.type.includes("feedback") && (
                              <span></span>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleViewDetails(item)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Activity</Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right column - Stats */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    {/* Feedback Stats */}
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">New Feedback</span>
                          </div>
                          <p className="text-2xl font-bold">
                            <span>24</span>
                            <span className="text-muted-foreground">/35</span>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-muted-foreground">Avg Rating</span>
                          </div>
                          <p className="text-2xl font-bold">3.8</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Inquiries</span>
                          </div>
                          <p className="text-2xl font-bold">
                            <span>12</span>
                            <span className="text-muted-foreground">/15</span>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Requests</span>
                          </div>
                          <p className="text-2xl font-bold">
                            <span>18</span>
                            <span className="text-muted-foreground">/20</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Department Activity */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Department Activity</h4>
                      <div className="space-y-4">
                        {[
                          { department: "Surgery", count: 42 },
                          { department: "Emergency", count: 38 },
                          { department: "Pediatrics", count: 27 },
                          { department: "Cardiology", count: 24 },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm">{item.department}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${(item.count / 42) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">{item.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Top Issues */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Top Issues</h4>
                      <div className="space-y-3">
                        {[
                          { product: "Surgical Gloves (Medium)", issues: 8 },
                          { product: "IV Catheters 20G", issues: 6 },
                          { product: "Digital Thermometer T200", issues: 5 },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm">{item.product}</span>
                            <Badge variant="outline">{item.issues} issues</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Survey Status */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Survey Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Active Surveys</span>
                          <Badge>4 running</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Response Rate</span>
                          <Badge variant="outline">68% avg</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Completion</span>
                          <Badge variant="secondary">164 responses</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Feed */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      {
                        product: "Surgical Gloves (Medium)",
                        image: gloveImage,
                        user: "Dr. Sarah Chen",
                        department: "Surgery",
                        rating: 2,
                        comment: "The gloves are too thin and tear easily during procedures. This compromises sterility and safety during operations. We need better quality gloves that can withstand the rigors of surgical procedures.",
                        date: "2 days ago",
                        status: "New",
                        type: "feedback",
                        brand: "MediGuard",
                        attachedPhotos: [exampleAttachedPhotos[0]],
                        critical: true,
                        procurementResponse: "Investigating alternative suppliers. Temporary stock available.",
                        procurementResponseDate: "1 day ago"
                      },
                      {
                        product: "N95 Respirator Masks",
                        image: maskImage,
                        user: "Nurse Michael Wong",
                        department: "Pediatrics",
                        rating: 4,
                        comment: "Good protection but uncomfortable during extended wear.",
                        date: "3 days ago",
                        status: "Viewed",
                        type: "feedback",
                        brand: "3Medical",
                        attachedPhotos: [exampleAttachedPhotos[1]],
                        procurementResponse: "Ordered samples from alternative suppliers for comfort evaluation.",
                        procurementResponseDate: "Yesterday"
                      },
                      {
                        product: "Surgical Stapler",
                        image: gauzeImage,
                        user: "Dr. Robert Taylor",
                        department: "Cardiology",
                        rating: 5,
                        comment: "Excellent precision and reliability. The ergonomic design reduces hand fatigue during long procedures.",
                        date: "1 week ago",
                        status: "Resolved",
                        type: "feedback",
                        brand: "SurgePro",
                        attachedPhotos: []
                      },
                    ].map((item, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 border bg-gray-50 flex items-center justify-center">
                              {item.image ? (
                                <Image 
                                  src={item.image} 
                                  alt={item.product} 
                                  fill 
                                  className="object-cover"
                                  sizes="80px"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                              <div>
                                <h3 className="font-medium">{item.product}</h3>
                                <div className="flex flex-col gap-1 mt-1">
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Tag className="h-3 w-3" />
                                    {item.brand && (
                                      <span>Brand: <span className="font-medium">{item.brand}</span></span>
                                    )}
                                  </p>
                                  {isSurveyItem(item) && item.vendor && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <ShoppingCart className="h-3 w-3" />
                                      <span>Vendor: <span className="font-medium">{item.vendor}</span></span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              </div>
                              <Badge variant={
                              item.status === "Pending" ? "outline" :
                              item.status === "Under Review" || item.status === "Processing" ? "teal" :
                              item.status === "Approved" || item.status === "In Stock" ? "green" :
                              "destructive"
                            } className={
                              item.status === "Active" ? "bg-black hover:bg-black" :
                              item.status === "Processing" || item.status === "Under Review" ? "bg-teal-500 hover:bg-teal-600 text-white" :
                              item.status === "In Stock" ? "bg-green-500 hover:bg-green-600 text-white" :
                              ""
                            }>
                              {item.status === "Under Review" ? "Processing" : item.status}
                              </Badge>
                            </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            {isSurveyItem(item) && (
                              <div>
                                <p className="text-xs text-muted-foreground">Target Group</p>
                                <p className="text-sm font-medium">{item.target}</p>
                              </div>
                            )}
                            {isSurveyItem(item) && item.startDate && (
                              <div>
                                <p className="text-xs text-muted-foreground">Start Date</p>
                                <p className="text-sm font-medium">{item.startDate}</p>
                              </div>
                            )}
                            {isSurveyItem(item) && (
                              <div>
                                <p className="text-xs text-muted-foreground">Response Rate</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">
                                    {item.averageResponseRate}
                                    {item.targetResponses && 
                                      <span className="text-muted-foreground">/{item.targetResponses}</span>
                                    }
                                  </p>
                                  {item.targetResponses && (
                                    <div className="relative w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className="absolute top-0 left-0 h-full bg-primary"
                                        style={{ width: `${Math.min(100, (item.averageResponseRate / item.targetResponses) * 100)}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm">{item.comment}</p>
                          
                          {item.respondents && item.respondents.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Respondents</p>
                              <div className="flex">
                                {item.respondents.slice(0, 5).map((respondent, idx) => (
                                  <div 
                                    key={respondent.id}
                                    className="relative w-8 h-8 rounded-full overflow-hidden border border-white -ml-2 first:ml-0 bg-gray-50"
                                    style={{ zIndex: 5 - idx }}
                                  >
                                    <Image 
                                      src={respondent.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${respondent.name}`}
                                      alt={respondent.name}
                                      fill
                                      className="object-cover"
                                      sizes="32px"
                                    />
                                  </div>
                                ))}
                                {item.respondents.length > 5 && (
                                  <div className="relative w-8 h-8 rounded-full bg-gray-100 -ml-2 flex items-center justify-center text-xs font-medium text-gray-600 border border-white">
                                    +{item.respondents.length - 5}
                            </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {isSurveyItem(item) ? (
                                <span className="text-sm">{item.responses} responses</span>
                              ) : (
                                <span className="text-sm">View details</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                              <Button size="sm" variant="outline" onClick={() => handleViewDetails(item as SurveyItem)}>View Details</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Feedback</Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right column - Stats */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    {/* Feedback Stats */}
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">New Feedback</span>
                          </div>
                          <p className="text-2xl font-bold">
                            <span>24</span>
                            <span className="text-muted-foreground">/35</span>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-muted-foreground">Avg Rating</span>
                          </div>
                          <p className="text-2xl font-bold">3.8</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Department Activity */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Department Activity</h4>
                      <div className="space-y-4">
                        {[
                          { department: "Surgery", count: 42 },
                          { department: "Emergency", count: 38 },
                          { department: "Pediatrics", count: 27 },
                          { department: "Cardiology", count: 24 },
                          { department: "Neurology", count: 19 },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm">{item.department}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${(item.count / 42) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">{item.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Top Issues */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Top Issues</h4>
                      <div className="space-y-3">
                        {[
                          { product: "Surgical Gloves (Medium)", issues: 8 },
                          { product: "IV Catheters 20G", issues: 6 },
                          { product: "Digital Thermometer T200", issues: 5 },
                          { product: "Blood Pressure Monitors", issues: 4 },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm">{item.product}</span>
                            <Badge variant="outline">{item.issues} issues</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Feed */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      {
                        product: "Advanced Pulse Oximeter",
                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO5tWZA_FUd-qyPJ5J-ZrJwoSGHuORKv9Iog&s",
                        department: "Intensive Care",
                        user: "Dr. James Wilson",
                        date: "2023-08-01",
                        comment: "Need higher accuracy for critical patients. Current models have variance issues that lead to false alarms and missed deteriorations. Requesting models with at least 98% accuracy at low perfusion states.",
                        status: "Pending",
                        urgency: "High",
                        type: "request"
                      },
                      {
                        product: "Eco-Friendly Examination Gloves",
                        image: gloveImage,
                        department: "General Practice",
                        user: "Nurse Lisa Johnson",
                        date: "2023-07-28",
                        comment: "Need latex-free alternatives for allergic patients. The current nitrile options are causing skin reactions in some sensitive patients. Looking for hypoallergenic options.",
                        status: "Under Review",
                        urgency: "Medium",
                        type: "request"
                      },
                      {
                        product: "Smart Infusion Pumps",
                        image: ivSetImage,
                        department: "Oncology",
                        user: "Dr. Michael Thompson",
                        date: "2023-07-20",
                        comment: "Request for smart infusion pumps with drug libraries and error reduction software. Current models lack safety features needed for complex chemotherapy regimens.",
                        status: "Approved",
                        urgency: "High",
                        type: "request"
                      },
                    ].map((item, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex gap-4">
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 border bg-gray-50 flex items-center justify-center">
                              {item.image ? (
                                <Image 
                                  src={item.image} 
                                  alt={item.product} 
                                  fill 
                                  className="object-cover"
                                  sizes="80px"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border bg-gray-50">
                              <Image 
                                src={item.user && doctorPhotos[item.user] ? doctorPhotos[item.user] : `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user}`}
                                alt={item.user || "User"}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{item.product}</h3>
                                <p className="text-sm text-muted-foreground">From: {item.user} ({item.department})</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge variant={
                                  item.status === "Pending" ? "outline" :
                                  item.status === "Under Review" || item.status === "Processing" ? "teal" :
                                  item.status === "Approved" ? "green" :
                                  "destructive"
                                }>
                                  {item.status}
                                </Badge>
                                <Badge variant={
                                  item.urgency === "High" ? "destructive" : 
                                  item.urgency === "Medium" ? "secondary" : 
                                  "outline"
                                }>
                                  {item.urgency} Priority
                                </Badge>
                              </div>
                            </div>
                            <p className="mt-2 text-sm">{item.comment}</p>
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                              <Button size="sm" variant="outline" onClick={() => handleViewDetails(item as RequestItem)}>View Details</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Requests</Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right column - Stats */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    {/* Request Stats */}
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">New Requests</span>
                          </div>
                          <p className="text-2xl font-bold">
                            <span>18</span>
                            <span className="text-muted-foreground">/20</span>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Approved</span>
                          </div>
                          <p className="text-2xl font-bold">
                            <span>7</span>
                            <span className="text-muted-foreground">/10</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Department Activity */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Department Activity</h4>
                      <div className="space-y-4">
                        {[
                          { department: "Emergency", count: 8 },
                          { department: "Intensive Care", count: 6 },
                          { department: "Surgery", count: 5 },
                          { department: "General Practice", count: 4 },
                          { department: "Oncology", count: 3 },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm">{item.department}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${(item.count / 8) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">{item.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Request Status */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Request Status</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Pending</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full bg-amber-500"
                                style={{ width: `65%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">65%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Approved</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `25%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">25%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Rejected</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full bg-red-500"
                                style={{ width: `10%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">10%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="surveys" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Feed */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Define surveys with additional data */}
                    {[
                      {
                        product: "Surgical Instruments",
                        image: gauzeImage,
                        target: "Surgeons",
                        date: "2023-07-15",
                        comment: "Quality assessment survey for surgical instruments",
                        status: "Active",
                        responses: 42,
                        type: "survey" as const,
                        brand: "SurgePro",
                        vendor: "MedTech Supplies",
                        startDate: "2023-07-01",
                        targetResponses: 50,
                        averageResponseRate: 84,
                        averageRating: 3.7,
                        respondents: [
                          { id: "1", name: "Dr. John Smith", image: doctorPhotos["Dr. James Wilson"] },
                          { id: "2", name: "Dr. Sarah Chen", image: doctorPhotos["Dr. Sarah Chen"] },
                          { id: "3", name: "Dr. Marcus Johnson" },
                          { id: "4", name: "Dr. Emily Davis" },
                          { id: "5", name: "Dr. Robert Taylor", image: doctorPhotos["Dr. Robert Taylor"] }
                        ]
                      },
                      {
                        product: "Patient Monitoring Systems",
                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO5tWZA_FUd-qyPJ5J-ZrJwoSGHuORKv9Iog&s",
                        target: "ICU Staff",
                        date: "2023-07-10",
                        comment: "Feedback survey on usability and reliability of current patient monitoring systems in intensive care units.",
                        status: "Active",
                        responses: 28,
                        type: "survey" as const,
                        brand: "VitalTech",
                        vendor: "Healthcare Innovations",
                        startDate: "2023-07-05",
                        targetResponses: 40,
                        averageResponseRate: 70,
                        averageRating: 4.2,
                        respondents: [
                          { id: "1", name: "Nurse Michael Wong", image: doctorPhotos["Nurse Michael Wong"] },
                          { id: "2", name: "Dr. Lisa Chen" },
                          { id: "3", name: "Nurse Jessica Kim" }
                        ]
                      },
                      {
                        product: "Diagnostic Equipment",
                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO5tWZA_FUd-qyPJ5J-ZrJwoSGHuORKv9Iog&s",
                        target: "Radiology",
                        date: "2023-06-30",
                        comment: "Survey on diagnostic equipment performance, reliability, and features for future procurement decisions.",
                        status: "Completed",
                        responses: 35,
                        type: "survey" as const,
                        brand: "DiagnoScan",
                        vendor: "Medical Imaging Solutions",
                        startDate: "2023-06-15",
                        targetResponses: 35,
                        averageResponseRate: 100,
                        averageRating: 3.9,
                        respondents: [
                          { id: "1", name: "Dr. Michael Thompson", image: doctorPhotos["Dr. Michael Thompson"] },
                          { id: "2", name: "Dr. Robert Taylor", image: doctorPhotos["Dr. Robert Taylor"] },
                          { id: "3", name: "Dr. James Wilson", image: doctorPhotos["Dr. James Wilson"] }
                        ]
                      }
                    ].map((survey, i) => {
                      // Convert to SurveyItem for TypeScript
                      const surveyItem = survey as unknown as SurveyItem;
                      return (
                      <div key={i} className="border rounded-lg p-4">
                          <div className="flex flex-col gap-4">
                            {/* Header with product & status */}
                            <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 border bg-gray-50 flex items-center justify-center">
                                  {surveyItem.image ? (
                              <Image 
                                      src={surveyItem.image} 
                                      alt={surveyItem.product} 
                                fill 
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                              <div>
                                  <h3 className="font-medium">{surveyItem.product}</h3>
                                  <div className="flex flex-col gap-1 mt-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Tag className="h-3 w-3" />
                                      <span>Brand: <span className="font-medium">{surveyItem.brand}</span></span>
                                    </p>
                                    {surveyItem.vendor && (
                                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <ShoppingCart className="h-3 w-3" />
                                        <span>Vendor: <span className="font-medium">{surveyItem.vendor}</span></span>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Badge variant={
                                surveyItem.status === "Active" ? "default" : 
                                surveyItem.status === "Completed" ? "secondary" : 
                                "outline"
                              }>
                                {surveyItem.status}
                              </Badge>
                            </div>
                            
                            {/* Survey metrics */}
                            <div className="grid grid-cols-3 gap-4">
                              {isSurveyItem(surveyItem) && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Responses</p>
                              <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">
                                      {surveyItem.responses}
                                      {surveyItem.targetResponses && 
                                        <span className="text-muted-foreground">/{surveyItem.targetResponses}</span>
                                      }
                                    </p>
                                    {surveyItem.targetResponses && (
                                      <div className="relative w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                          className="absolute top-0 left-0 h-full bg-primary"
                                          style={{ width: `${Math.min(100, (surveyItem.responses / surveyItem.targetResponses) * 100)}%` }}
                                        />
                            </div>
                                    )}
                            </div>
                          </div>
                              )}
                              {isSurveyItem(surveyItem) && surveyItem.averageRating && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Average Rating</p>
                                  <div className="flex items-center">
                                    <div className="flex items-center">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(surveyItem.averageRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                      ))}
                        </div>
                                    <span className="text-sm ml-2 font-medium">{surveyItem.averageRating}</span>
                        </div>
                                </div>
                              )}
                              {isSurveyItem(surveyItem) && surveyItem.averageResponseRate && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Response Rate</p>
                                  <p className="text-sm font-medium">{surveyItem.averageResponseRate}%</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Description */}
                            <p className="text-sm">{surveyItem.comment}</p>
                            
                            {/* Respondents with stacked avatars */}
                            {surveyItem.respondents && surveyItem.respondents.length > 0 && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-2">Respondents</p>
                                <div className="flex">
                                  {surveyItem.respondents.slice(0, 5).map((respondent, idx) => (
                                    <div 
                                      key={respondent.id}
                                      className="relative w-8 h-8 rounded-full overflow-hidden border border-white -ml-2 first:ml-0 bg-gray-50"
                                      style={{ zIndex: 5 - idx }}
                                    >
                                      <Image 
                                        src={respondent.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${respondent.name}`}
                                        alt={respondent.name}
                                        fill
                                        className="object-cover"
                                        sizes="32px"
                                      />
                      </div>
                    ))}
                                  {surveyItem.respondents.length > 5 && (
                                    <div className="relative w-8 h-8 rounded-full bg-gray-100 -ml-2 flex items-center justify-center text-xs font-medium text-gray-600 border border-white">
                                      +{surveyItem.respondents.length - 5}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Footer with actions */}
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                {isSurveyItem(surveyItem) ? (
                                  <span className="text-sm">{surveyItem.responses} responses</span>
                                ) : (
                                  <span className="text-sm">View details</span>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-muted-foreground">{surveyItem.date}</span>
                                <Button size="sm" variant="outline" onClick={() => handleViewDetails(surveyItem)}>
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Surveys</Button>
                </CardFooter>
              </Card>
            </div>

            {/* Right column - Stats */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    {/* Survey Stats */}
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Active Surveys</span>
                          </div>
                          <p className="text-2xl font-bold">
                            <span>4</span>
                            <span className="text-muted-foreground">/6</span>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Response Rate</span>
                          </div>
                          <p className="text-2xl font-bold">68%</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Survey Completion */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Survey Completion</h4>
                      <div className="space-y-4">
                        {[
                          { 
                            survey: "Surgical Instruments Satisfaction", 
                            completion: 42, 
                            target: 50,
                            status: "Active" 
                          },
                          { 
                            survey: "Nursing Equipment Usability", 
                            completion: 87, 
                            target: 100,
                            status: "Ending Soon" 
                          },
                          { 
                            survey: "Laboratory Supplies Quality", 
                            completion: 35, 
                            target: 35,
                            status: "Completed" 
                          },
                          { 
                            survey: "Diagnostic Equipment Feedback", 
                            completion: 0, 
                            target: 30,
                            status: "Scheduled" 
                          },
                        ].map((item, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{item.survey}</span>
                              <Badge variant={
                                item.status === "Active" ? "default" : 
                                item.status === "Ending Soon" ? "destructive" : 
                                item.status === "Completed" ? "secondary" :
                                "outline"
                              }>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${(item.completion / item.target) * 100}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>{item.completion} responses</span>
                              <span>{Math.round((item.completion / item.target) * 100)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Survey Status */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Survey Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Active Surveys</span>
                          <Badge>4 running</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Response Rate</span>
                          <Badge variant="outline">68% avg</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Completion</span>
                          <Badge variant="secondary">164 responses</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Side View Sheet */}
      <Sheet open={sideViewOpen} onOpenChange={setSideViewOpen}>
        <SheetContent className="w-[95%] sm:w-[800px] sm:max-w-[800px] !max-w-[800px] overflow-y-auto">
          {selectedFeedback && (
            <div className="space-y-6">
              {/* Product Info Section */}
              <div className="border-b pb-4">
                <div className="flex gap-4 items-start">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 border bg-gray-50">
                    {selectedFeedback.image ? (
                      <Image 
                        src={selectedFeedback.image} 
                        alt={selectedFeedback.product} 
                        fill 
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{selectedFeedback.product}</h3>
                      <Badge variant={
                        feedbackStatus === "Pending" ? "outline" :
                        feedbackStatus === "Under Review" || feedbackStatus === "Processing" ? "secondary" :
                        feedbackStatus === "Approved" || feedbackStatus === "In Stock" ? "default" :
                        "destructive"
                      } className={
                        feedbackStatus === "In Stock" ? "bg-green-500 hover:bg-green-600 text-white" : ""
                      }>
                        {feedbackStatus}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">
                        View Item <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    {selectedFeedback.brand && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Brand: <span className="font-medium">{selectedFeedback.brand}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border bg-gray-50">
                    <Image 
                      src={selectedFeedback.user && doctorPhotos[selectedFeedback.user] ? doctorPhotos[selectedFeedback.user] : `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedFeedback.user}`}
                      alt={selectedFeedback.user || "User"}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedFeedback.user}</p>
                        <p className="text-sm text-muted-foreground">{selectedFeedback.department}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{selectedFeedback.date}</span>
                    </div>
                    {selectedFeedback.type === "feedback" && isFeedbackItem(selectedFeedback) && (
                      <div className="flex items-center gap-2 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < selectedFeedback.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                        <span className="text-sm">{selectedFeedback.rating}/5</span>
                      </div>
                    )}
                    <p className="text-sm mt-2">{selectedFeedback.comment}</p>
                  </div>
                </div>

                {/* Attached Photos */}
                {selectedFeedback.attachedPhotos && selectedFeedback.attachedPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedFeedback.attachedPhotos.map((photo, photoIndex) => (
                      <div 
                        key={photoIndex} 
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <Image
                          src={photo}
                          alt={`Attached photo ${photoIndex + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 150px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Related Feedback Accordion */}
              {selectedFeedback.product && relatedFeedbackData[selectedFeedback.product] && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="related-feedback">
                    <AccordionTrigger className="text-sm">
                      Related Feedback ({relatedFeedbackData[selectedFeedback.product].length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {relatedFeedbackData[selectedFeedback.product].map((feedback, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border bg-gray-50">
                                <Image 
                                  src={feedback.user && doctorPhotos[feedback.user] ? doctorPhotos[feedback.user] : `https://api.dicebear.com/7.x/avataaars/svg?seed=${feedback.user}`}
                                  alt={feedback.user}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{feedback.user}</p>
                                <p className="text-xs text-muted-foreground">{feedback.department}</p>
                              </div>
                            </div>
                            {feedback.rating !== undefined && (
                              <div className="flex items-center mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < (feedback.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                ))}
                              </div>
                            )}
                            <p className="text-sm">{feedback.comment}</p>
                            <p className="text-xs text-muted-foreground mt-2">{feedback.date}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {/* Actions Section */}
              <div className="mt-6">
                {/* Procurement Response */}
                {selectedFeedback.procurementResponse && (
                  <div className="space-y-2 mb-6">
                    <h4 className="text-sm font-medium">Procurement Response</h4>
                    <div className={`p-3 rounded-lg ${selectedFeedback.product.includes("Surgical Drapes") ? "bg-green-50" : "bg-blue-50"}`}>
                      <div className="flex justify-between items-start">
                        <div className={`text-sm ${selectedFeedback.product.includes("Surgical Drapes") ? "text-green-700" : "text-blue-700"}`}>
                          {selectedFeedback.product.includes("Surgical Drapes") ? (
                            <>
                              <div className="flex items-start mb-2">
                                <AlertCircle className="h-5 w-5 mr-2 shrink-0 text-green-600" />
                                <p className="font-medium">Product already available in hospital</p>
                              </div>
                              <p>{selectedFeedback.procurementResponse.split("The stock is")[0]}</p>
                              <div className="mt-2 bg-green-100 p-2 rounded border border-green-200">
                                <div className="flex items-start">
                                  <FlagIcon className="h-5 w-5 mr-2 shrink-0 text-green-600" />
                                  <p className="font-medium">The stock is{selectedFeedback.procurementResponse.split("The stock is")[1].split("Please contact")[0]}</p>
                                </div>
                                <p className="ml-7 mt-1">Please contact{selectedFeedback.procurementResponse.split("Please contact")[1]}</p>
                              </div>
                            </>
                          ) : (
                            <p>{selectedFeedback.procurementResponse}</p>
                          )}
                        </div>
                        {selectedFeedback.procurementResponseDate && (
                          <p className={`text-xs ml-4 ${selectedFeedback.product.includes("Surgical Drapes") ? "text-green-600" : "text-blue-600"}`}>
                            {selectedFeedback.procurementResponseDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Procurement Feedback Input */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium">Send Response</h4>
                  <div className="relative">
                    <Textarea
                      placeholder="Type your response here..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      className="min-h-[100px] pr-20"
                    />
                    <Button 
                      size="sm" 
                      className="absolute right-2 bottom-2"
                      onClick={handleSubmitResponse}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Quick Actions</h4>
                  <div className="flex items-center justify-between gap-4">
                    {selectedFeedback.product.includes("Surgical Drapes") ? (
                      <>
                        <Button variant="outline" className="flex-1">
                          <FlagIcon className="h-4 w-4 mr-2" />
                          View Location on Map
                        </Button>
                        <Button variant="outline" onClick={handleSearchInventory} className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Check Stock Inventory
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" onClick={handleCreateOrder} className="flex-1">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Find Alternatives
                        </Button>
                        <Button variant="outline" onClick={handleSearchInventory} className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Check Stock Inventory
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
} 