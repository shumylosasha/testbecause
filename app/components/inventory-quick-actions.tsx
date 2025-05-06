"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Upload,
  MessageSquare,
  ShoppingCart,
  TrendingDown,
  AlertTriangle,
  FileText,
  Bell,
  X,
  FileSpreadsheet,
  FileIcon as FilePdf,
  File,
  Loader2,
  ChevronLeft,
  Mic,
  Menu,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

interface InventoryQuickActionsProps {
  onAddItem: () => void
  onUploadInventory: (file: File) => Promise<void>
  onChatWithAI: () => void
  selectedItemsCount: number
  onCreateOrder: () => void
  onNewItemsAdded?: (items: any[]) => void
  onViewAIInsight?: (insight: any) => void
}

type AINotification = {
  id: string
  message: string
  timestamp: Date
  read: boolean
  type: "info" | "alert" | "suggestion"
  action: {
    label: string
    onClick: () => void
  }
  itemDetails?: {
    name: string
    sku: string
    currentPrice: number
    suggestedPrice: number
  }
}

type AIChatMessage = {
  role: "user" | "assistant"
  content: string
  action?: {
    label: string
    onClick: () => void
  }
  cards?: {
    type: "cost-savings" | "low-stock" | "alternative-vendors" | "similar-products"
    items: Array<{
      name: string
      sku: string
      currentPrice?: number
      suggestedPrice?: number
      currentStock?: number
      reorderPoint?: number
      vendor?: string
      savings?: number
      rating?: number
      similarity?: number
      category?: string
      specifications?: string
    }>
  }
  loading?: boolean
}

type UploadStatus = "idle" | "ready" | "uploading" | "processing" | "analyzing" | "complete"

export function InventoryQuickActions({
  onAddItem,
  onUploadInventory,
  onChatWithAI,
  selectedItemsCount,
  onCreateOrder,
  onNewItemsAdded,
  onViewAIInsight,
}: InventoryQuickActionsProps) {
  const [showNotificationList, setShowNotificationList] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [showChatHistory, setShowChatHistory] = useState(false)
  const [aiChatInput, setAIChatInput] = useState("")
  const [aiChatMessages, setAIChatMessages] = useState<AIChatMessage[]>(() => {
    // Load chat history from localStorage on component mount
    if (typeof window !== 'undefined') {
      const savedChat = localStorage.getItem('inventory-chat-history')
      if (savedChat) {
        return JSON.parse(savedChat)
      }
    }
    return [{
      role: "assistant",
      content: "Hello! I'm your procurement assistant. How can I help you today?",
      action: {
        label: "View Dashboard",
        onClick: () => (window.location.href = "/"),
      },
    }]
  })
  const [aiStatus, setAiStatus] = useState<"ok" | "attention">("ok")
  const [notifications, setNotifications] = useState<AINotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [processingMessage, setProcessingMessage] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const router = useRouter()
  const chatMessagesEndRef = useRef<HTMLDivElement>(null)

  // Generate and manage AI notifications
  useEffect(() => {
    // Initial notifications
    const initialNotifications: AINotification[] = [
      {
        id: "notif-1",
        message: "Your inventory is running low on Surgical Gloves",
        type: "alert",
        read: false,
        timestamp: new Date(),
        action: {
          label: "View Details",
          onClick: () => {
            // Navigate to inventory page with filter for Surgical Gloves
            window.location.href = "/inventory?filter=surgical-gloves";
          },
        },
      },
      {
        id: "notif-2",
        message: "New vendor prices available for Medical Masks",
        type: "suggestion",
        read: false,
        timestamp: new Date(),
        action: {
          label: "View Prices",
          onClick: () => {
            // Navigate to vendor comparison page
            window.location.href = "/vendors/compare?item=medical-masks";
          },
        },
      }
    ];

    setNotifications(initialNotifications)
    updateUnreadCount(initialNotifications)

    // Set initial status based on notifications
    setAiStatus(initialNotifications.some((n) => n.type === "alert" && !n.read) ? "attention" : "ok")

    // Add new notifications periodically
    const interval = setInterval(() => {
      // Only add notifications if not in upload process
      if (uploadStatus === "idle" || uploadStatus === "ready" || uploadStatus === "complete") {
        const newNotificationTypes = [
          {
            message: "I analyzed your inventory and found potential savings of $1,250",
            type: "suggestion",
            action: {
              label: "View Analysis",
              onClick: () => alert("Viewing savings analysis..."),
            },
          },
          {
            message: "2 items in your inventory are running low and need reordering",
            type: "alert",
            action: {
              label: "Reorder Now",
              onClick: () => onCreateOrder(),
            },
          },
          {
            message: "New vendor available for IV catheters with 10% lower pricing",
            type: "info",
            action: {
              label: "Compare Vendors",
              onClick: () => alert("Comparing vendor pricing..."),
            },
          },
          {
            message: "I've optimized your reorder points based on recent usage patterns",
            type: "suggestion",
            action: {
              label: "Apply Changes",
              onClick: () => alert("Applying optimized reorder points..."),
            },
          },
          {
            message: "Price drop alert: Medical masks now available at 20% lower cost",
            type: "alert",
            action: {
              label: "Create RFQ",
              onClick: () => {
                const itemDetails = {
                  name: "Medical Masks",
                  sku: "MM-001",
                  currentPrice: 120,
                  suggestedPrice: 96
                };
                sessionStorage.setItem('rfqItemDetails', JSON.stringify(itemDetails));
                window.location.href = "/orders/create";
              },
            },
            itemDetails: {
              name: "Medical Masks",
              sku: "MM-001",
              currentPrice: 120,
              suggestedPrice: 96
            }
          },
        ]

        const randomType = newNotificationTypes[Math.floor(Math.random() * newNotificationTypes.length)]

        setNotifications((prev) => {
          const newNotification: AINotification = {
            id: Date.now().toString(),
            message: randomType.message,
            timestamp: new Date(),
            read: false,
            type: randomType.type as "info" | "alert" | "suggestion",
            action: randomType.action,
          }

          const updatedNotifications = [newNotification, ...prev].slice(0, 8) // Keep only the 8 most recent
          updateUnreadCount(updatedNotifications)

          // Update status if there are alert notifications
          if (newNotification.type === "alert") {
            setAiStatus("attention")
          }

          return updatedNotifications
        })
      }
    }, 45000) // Add new notification every 45 seconds

    return () => clearInterval(interval)
  }, [uploadStatus, onCreateOrder, onViewAIInsight])

  // Handle drag and drop events
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        handleFileSelected(file)
      }
    }

    const toolbar = toolbarRef.current
    if (toolbar) {
      toolbar.addEventListener("dragover", handleDragOver)
      toolbar.addEventListener("dragleave", handleDragLeave)
      toolbar.addEventListener("drop", handleDrop)

      return () => {
        toolbar.removeEventListener("dragover", handleDragOver)
        toolbar.removeEventListener("dragleave", handleDragLeave)
        toolbar.removeEventListener("drop", handleDrop)
      }
    }
  }, [isDragging])

  const updateUnreadCount = (notifs: AINotification[]) => {
    setUnreadCount(notifs.filter((n) => !n.read).length)
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    setAiStatus("ok")
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "suggestion":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const handleFileSelected = (file: File) => {
    // Check if file is PDF or Excel
    const fileType = file.type
    if (
      fileType === "application/pdf" ||
      fileType === "application/vnd.ms-excel" ||
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setUploadFile(file)
      setUploadStatus("ready")
    } else {
      alert("Please upload a PDF or Excel file")
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0])
    }
  }

  const handleUploadClick = async () => {
    if (!uploadFile) return

    try {
      // Start upload process
      setUploadStatus("uploading")
      setProcessingMessage("Uploading file...")

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      // Add AI notification about upload
      addAINotification(`Processing ${uploadFile.name}`, "info", {
        label: "View Progress",
        onClick: () => alert("Viewing upload progress..."),
      })

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Processing stage
      setUploadStatus("processing")
      setProcessingMessage("Processing with AI...")
      addAINotification("Analyzing inventory data with AI", "info", {
        label: "View Analysis",
        onClick: () => alert("Viewing AI analysis..."),
      })

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Analyzing stage
      setUploadStatus("analyzing")
      setProcessingMessage("Identifying items...")

      // Call the actual upload handler
      await onUploadInventory(uploadFile)

      // Complete the progress
      clearInterval(progressInterval)
      setUploadProgress(100)
      setProcessingMessage("Upload complete!")
      setUploadStatus("complete")

      // Generate fake new items
      const newItems = [
        {
          id: `new-${Date.now()}-1`,
          name: "Bed Alarm (10x30 in)",
          sku: "BA-001",
          currentStock: 50,
          totalStock: 50,
          status: "stock",
          category: "Ambulatory Acc.",
          packaging: "Box",
          expiresIn: "24 months",
          swaps: [],
          potentialSavings: 0,
          unitPrice: 75,
          requiredUnits: 50,
          manufacturer: "McKesson",
          image: "https://imgcdn.mckesson.com/CumulusWeb/Images/Original_Image/1020958.jpg",
          vendors: [{
            id: 'mckesson',
            name: 'McKesson',
            pricePerUnit: 75,
            status: {
              isCurrentVendor: true,
              isSelected: true
            },
            image_url: 'https://www.mckesson.com/assets/img/mckesson-logo.svg'
          }],
          selectedVendor: {
            id: 'mckesson',
            name: 'McKesson',
            pricePerUnit: 75,
            status: {
              isCurrentVendor: true,
              isSelected: true
            },
            image_url: 'https://www.mckesson.com/assets/img/mckesson-logo.svg'
          },
          selectedVendorIds: ['mckesson'],
          selectedVendors: [{
            id: 'mckesson',
            name: 'McKesson',
            pricePerUnit: 75,
            status: {
              isCurrentVendor: true,
              isSelected: true
            },
            image_url: 'https://www.mckesson.com/assets/img/mckesson-logo.svg'
          }]
        },
        {
          id: `new-${Date.now()}-2`,
          name: "Respiratory Accessory",
          sku: "RA-001",
          currentStock: 30,
          totalStock: 30,
          status: "stock",
          category: "Nasal Respiratory",
          packaging: "Box",
          expiresIn: "24 months",
          swaps: [],
          potentialSavings: 0,
          unitPrice: 220,
          requiredUnits: 30,
          manufacturer: "McKesson",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnmi2uYcU6pT08t7cpkjs_6nwFOqwC_lKp3Q&s",
          vendors: [{
            id: 'mckesson',
            name: 'McKesson',
            pricePerUnit: 220,
            status: {
              isCurrentVendor: true,
              isSelected: true
            },
            image_url: 'https://www.mckesson.com/assets/img/mckesson-logo.svg'
          }],
          selectedVendor: {
            id: 'mckesson',
            name: 'McKesson',
            pricePerUnit: 220,
            status: {
              isCurrentVendor: true,
              isSelected: true
            },
            image_url: 'https://www.mckesson.com/assets/img/mckesson-logo.svg'
          },
          selectedVendorIds: ['mckesson'],
          selectedVendors: [{
            id: 'mckesson',
            name: 'McKesson',
            pricePerUnit: 220,
            status: {
              isCurrentVendor: true,
              isSelected: true
            },
            image_url: 'https://www.mckesson.com/assets/img/mckesson-logo.svg'
          }]
        }
      ]

      // Add success notification
      addAINotification(`Successfully processed ${newItems.length} items from ${uploadFile.name}`, "info", {
        label: "View Items",
        onClick: () => alert("Viewing processed items..."),
      })

      // Pass new items to parent
      if (onNewItemsAdded) {
        onNewItemsAdded(newItems)
      }

      // Navigate to orders/create page to show Ready to Purchase and Order Insights
      window.location.href = "/orders/create"

      // Reset after a delay
      setTimeout(() => {
        setUploadFile(null)
        setUploadStatus("idle")
        setUploadProgress(0)
      }, 2000)
    } catch (error) {
      console.error("Upload error:", error)
      addAINotification("Error processing file. Please try again.", "alert", {
        label: "Retry",
        onClick: () => handleUploadClick(),
      })
      setUploadStatus("idle")
      setUploadFile(null)
      setUploadProgress(0)
    }
  }

  const addAINotification = (
    message: string,
    type: "info" | "alert" | "suggestion",
    action: { label: string; onClick: () => void },
  ) => {
    const newNotification: AINotification = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      read: false,
      type,
      action,
    }

    setNotifications((prev) => {
      const updatedNotifications = [newNotification, ...prev].slice(0, 8)
      updateUnreadCount(updatedNotifications)
      return updatedNotifications
    })

    if (type === "alert") {
      setAiStatus("attention")
    }
  }

  const getFileIcon = () => {
    if (!uploadFile) return <Upload className="h-4 w-4" />

    const fileType = uploadFile.type
    if (fileType === "application/pdf") {
      return <FilePdf className="h-4 w-4 text-red-500" />
    } else if (
      fileType === "application/vnd.ms-excel" ||
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />
    }

    return <File className="h-4 w-4" />
  }

  const renderUploadButton = () => {
    if (uploadStatus === "idle") {
      return (
        <Button
          variant="ghost"
          className="rounded-full flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          <span>Upload</span>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileInputChange}
          />
        </Button>
      )
    }

    if (uploadStatus === "ready") {
      return (
        <div className="flex items-center gap-2">
          <div className="bg-gray-800 rounded-full px-3 py-1 flex items-center gap-2 max-w-[180px]">
            {getFileIcon()}
            <span className="text-sm truncate text-gray-200">{uploadFile?.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
              onClick={() => {
                setUploadFile(null)
                setUploadStatus("idle")
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Button
            size="sm"
            className="rounded-full h-8 bg-primary text-white hover:bg-primary/90"
            onClick={handleUploadClick}
          >
            Process File
          </Button>
        </div>
      )
    }

    if (uploadStatus === "uploading" || uploadStatus === "processing" || uploadStatus === "analyzing") {
      return (
        <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1 min-w-[200px]">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1 text-gray-200">
              <span>{processingMessage}</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-1.5 bg-gray-700 [&>*]:bg-primary" />
          </div>
        </div>
      )
    }

    if (uploadStatus === "complete") {
      return (
        <div className="flex items-center gap-2 bg-green-800 rounded-full px-3 py-1">
          <FileText className="h-4 w-4 text-green-200" />
          <span className="text-green-100 text-sm font-medium">Done</span>
        </div>
      )
    }

    return null
  }

  const getAIStatusText = () => {
    // Normal operation
    if (notifications.some((n) => n.type === "alert" && !n.read)) {
      return "Value opportunity"
    } else if (notifications.some((n) => n.type === "suggestion" && !n.read)) {
      return "New suggestions"
    } else if (notifications.some((n) => !n.read)) {
      return "New notifications"
    }

    return "All good"
  }

  const handleAIChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiChatInput.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: aiChatInput }
    setAIChatMessages((prev) => [...prev, userMessage])
    setAIChatInput("")

    // Add loading state
    const loadingMessage = {
      role: "assistant" as const,
      content: "Analyzing your request...",
      loading: true
    }
    setAIChatMessages((prev) => [...prev, loadingMessage])

    // Simulate AI response with delay
    setTimeout(() => {
      // Remove loading message
      setAIChatMessages((prev) => prev.filter(msg => !msg.loading))

      let aiResponse: AIChatMessage

      if (aiChatInput.toLowerCase().includes("cost saving") || aiChatInput.toLowerCase().includes("savings")) {
        aiResponse = {
          role: "assistant",
          content: "I've found several cost-saving opportunities in your inventory:",
          cards: {
            type: "cost-savings",
            items: [
              {
                name: "Surgical Gloves",
                sku: "SG-001",
                currentPrice: 85,
                suggestedPrice: 72.25,
                savings: 15
              },
              {
                name: "Medical Masks",
                sku: "MM-001",
                currentPrice: 120,
                suggestedPrice: 96,
                savings: 20
              },
              {
                name: "IV Catheters",
                sku: "IV-001",
                currentPrice: 45,
                suggestedPrice: 38.25,
                savings: 15
              }
            ]
          }
        }
      } else if (aiChatInput.toLowerCase().includes("running low") || aiChatInput.toLowerCase().includes("low stock")) {
        aiResponse = {
          role: "assistant",
          content: "Here are the items that are running low and need attention:",
          cards: {
            type: "low-stock",
            items: [
              {
                name: "Surgical Gloves",
                sku: "SG-001",
                currentStock: 50,
                reorderPoint: 100
              },
              {
                name: "Medical Masks",
                sku: "MM-001",
                currentStock: 75,
                reorderPoint: 150
              },
              {
                name: "IV Catheters",
                sku: "IV-001",
                currentStock: 30,
                reorderPoint: 80
              }
            ]
          }
        }
      } else if (aiChatInput.toLowerCase().includes("alternative vendor") || aiChatInput.toLowerCase().includes("alternative vendors")) {
        aiResponse = {
          role: "assistant",
          content: "Which product would you like to find alternative vendors for?",
          action: {
            label: "Search All Products",
            onClick: () => {
              setAIChatMessages((prev) => [...prev, {
                role: "assistant",
                content: "Here are some alternative vendors for your products:",
                cards: {
                  type: "alternative-vendors",
                  items: [
                    {
                      name: "Surgical Gloves",
                      sku: "SG-001",
                      vendor: "MedSupply Co.",
                      rating: 4.5,
                      suggestedPrice: 72.25
                    },
                    {
                      name: "Medical Masks",
                      sku: "MM-001",
                      vendor: "HealthTech Solutions",
                      rating: 4.8,
                      suggestedPrice: 96
                    },
                    {
                      name: "IV Catheters",
                      sku: "IV-001",
                      vendor: "MediCorp",
                      rating: 4.2,
                      suggestedPrice: 38.25
                    }
                  ]
                }
              }])
            }
          }
        }
      } else if (aiChatInput.toLowerCase().includes("similar") || aiChatInput.toLowerCase().includes("find similar")) {
        aiResponse = {
          role: "assistant",
          content: "Which product would you like to find similar items for?",
          action: {
            label: "Search All Products",
            onClick: () => {
              setAIChatMessages((prev) => [...prev, {
                role: "assistant",
                content: "Here are some similar products I found:",
                cards: {
                  type: "similar-products",
                  items: [
                    {
                      name: "Premium Surgical Gloves",
                      sku: "SG-002",
                      category: "Surgical Supplies",
                      similarity: 95,
                      specifications: "Latex-free, Powder-free, Size M",
                      currentPrice: 78.50
                    },
                    {
                      name: "Elite Medical Masks",
                      sku: "MM-002",
                      category: "PPE",
                      similarity: 92,
                      specifications: "3-ply, ASTM Level 2",
                      currentPrice: 110.00
                    },
                    {
                      name: "Advanced IV Catheters",
                      sku: "IV-002",
                      category: "IV Supplies",
                      similarity: 88,
                      specifications: "20G, Safety Lock",
                      currentPrice: 42.75
                    }
                  ]
                }
              }])
            }
          }
        }
      } else {
        // Default response for other queries
        aiResponse = {
          role: "assistant",
          content: "I can help you with that. Would you like to:",
          action: {
            label: "Find Cost Savings",
            onClick: () => {
              setAIChatInput("Find cost saving opportunities")
              setTimeout(() => {
                const form = document.getElementById('ai-chat-form')
                if (form) {
                  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
                }
              }, 0)
            }
          }
        }
      }

      setAIChatMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  const handleCreateOrder = () => {
    // Navigate to create order page with selected items
    if (selectedItemsCount > 0) {
      // Use direct navigation to ensure we go to the create page
      window.location.href = "/orders/create"
    }
  }

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('inventory-chat-history', JSON.stringify(aiChatMessages))
    }
    // Autoscroll to bottom on new message
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [aiChatMessages])

  const handleCardClick = (sku: string) => {
    // Map SKUs to their corresponding inventory IDs
    const skuToInventoryId: { [key: string]: string } = {
      'SG-001': 'inv-001',
      'MM-001': 'inv-002',
      'IV-001': 'inv-003',
      'SG-002': 'inv-004',
      'MM-002': 'inv-005',
      'IV-002': 'inv-006',
    }

    const inventoryId = skuToInventoryId[sku]
    if (inventoryId) {
      router.push(`/inventory/${inventoryId}`)
    }
  }

  const clearChatHistory = () => {
    // Reset to initial welcome message
    setAIChatMessages([{
      role: "assistant",
      content: "Hello! I'm your procurement assistant. How can I help you today?",
      action: {
        label: "View Dashboard",
        onClick: () => (window.location.href = "/"),
      },
    }])
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('inventory-chat-history')
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      {/* Notification list with light theme */}
      {showNotificationList && (
        <div className="absolute bottom-full mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">AI Notifications</h4>
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              Mark all as read
            </Button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 hover:bg-gray-50 transition-colors",
                      !notification.read && "bg-primary/5",
                    )}
                  >
                    <div className="flex gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className={cn("text-sm text-gray-900", !notification.read && "font-medium")}>{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={notification.action.onClick}
                          >
                            {notification.action.label}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            )}
          </div>
        </div>
      )}

      {/* AI Chat input with light theme */}
      {showAIChat && (
        <div className={`fixed bottom-16 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-row transition-all duration-200 ${showChatHistory ? 'w-[864px]' : 'w-[600px]'} max-w-[90vw]`}>
          {/* Sidebar on the left */}
          {showChatHistory && (
            <div className="w-64 border-r border-gray-200 transition-all duration-200">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h5 className="font-medium text-sm text-gray-900">Chat History</h5>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  onClick={clearChatHistory}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[300px] overflow-y-auto">
                {aiChatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      index === aiChatMessages.length - 1 ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => setShowChatHistory(false)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="h-5 w-5 mt-0.5 shrink-0 bg-primary rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{msg.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {msg.role === "user" ? "You" : "AI Assistant"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Main Chat Area always fixed width, always last */}
          <div className="w-[600px] flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setShowChatHistory(!showChatHistory)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <h4 className="font-medium text-gray-900">Chat with AI Assistant</h4>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  onClick={clearChatHistory}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowAIChat(false)} 
                  className="text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-3 max-h-[300px] overflow-y-auto">
              {aiChatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                  <div
                    className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg`}
                  >
                    {msg.role === "assistant" && <div className="h-5 w-5 mt-0.5 shrink-0 bg-primary rounded-full"></div>}
                    <div>
                      <p className="text-sm">{msg.content}</p>
                      {msg.loading && (
                        <div className="flex items-center gap-2 mt-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-gray-500">Processing...</span>
                        </div>
                      )}
                      {msg.cards && (
                        <div className="mt-3 grid grid-cols-1 gap-2">
                          {msg.cards.items.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:border-primary hover:shadow-md transition-all cursor-pointer"
                              onClick={() => handleCardClick(item.sku)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                                </div>
                                {msg.cards?.type === "cost-savings" && item.savings && (
                                  <span className="text-green-600 font-medium">{item.savings}% savings</span>
                                )}
                                {msg.cards?.type === "low-stock" && item.currentStock && (
                                  <span className="text-amber-600 font-medium">
                                    {item.currentStock} units left
                                  </span>
                                )}
                                {msg.cards?.type === "alternative-vendors" && item.rating && (
                                  <span className="text-blue-600 font-medium">
                                    Rating: {item.rating}/5
                                  </span>
                                )}
                                {msg.cards?.type === "similar-products" && item.similarity && (
                                  <span className="text-purple-600 font-medium">
                                    {item.similarity}% match
                                  </span>
                                )}
                              </div>
                              {msg.cards?.type === "cost-savings" && (
                                <div className="mt-2 flex justify-between text-sm">
                                  <span className="text-gray-500">Current: ${item.currentPrice}</span>
                                  <span className="text-green-600">Suggested: ${item.suggestedPrice}</span>
                                </div>
                              )}
                              {msg.cards?.type === "low-stock" && (
                                <div className="mt-2 text-sm text-gray-500">
                                  Reorder point: {item.reorderPoint} units
                                </div>
                              )}
                              {msg.cards?.type === "alternative-vendors" && (
                                <div className="mt-2 flex justify-between text-sm">
                                  <span className="text-gray-500">Vendor: {item.vendor}</span>
                                  <span className="text-green-600">Price: ${item.suggestedPrice}</span>
                                </div>
                              )}
                              {msg.cards?.type === "similar-products" && (
                                <div className="mt-2 space-y-1">
                                  <div className="text-sm text-gray-500">
                                    Category: {item.category}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Specifications: {item.specifications}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Price: ${item.currentPrice}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.role === "assistant" && msg.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 h-7 text-xs border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={msg.action.onClick}
                        >
                          {msg.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatMessagesEndRef} />
            </div>
            <div className="p-3 border-t border-gray-200">
              <form id="ai-chat-form" onSubmit={handleAIChatSubmit} className="flex gap-2">
                <div className="flex-1 flex gap-2">
                  <Input
                    value={aiChatInput}
                    onChange={(e) => setAIChatInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-primary"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost"
                    className="h-10 w-10 shrink-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => {
                      // TODO: Implement voice input
                      console.log("Voice input clicked")
                    }}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Button type="submit" size="sm" className="bg-primary text-white hover:bg-primary/90">
                  Send
                </Button>
              </form>

              {/* Suggestions with light theme */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Which items are running low?",
                    "Find cost-saving opportunities",
                    "Suggest alternative vendors",
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => {
                        setAIChatInput(suggestion);
                        setTimeout(() => {
                          const form = document.getElementById('ai-chat-form');
                          if (form) {
                            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                          }
                        }, 0);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Toolbar */}
      <div
        ref={toolbarRef}
        className={cn(
          "bg-white backdrop-blur-sm border border-gray-200 rounded-full shadow-lg px-3 py-2 flex items-center gap-3 transition-all",
          isDragging && "ring-2 ring-primary border-primary bg-primary/5",
        )}
      >
        {/* AI Section now on the left */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full flex items-center gap-2 relative text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
            onClick={() => {
              setShowNotificationList(!showNotificationList)
              setShowAIChat(false)
              setShowAISuggestions(false)
            }}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                aiStatus === "ok" ? "bg-green-500" : "bg-purple-500 animate-pulse",
              )}
            ></div>
            <span className="font-medium text-[14px]">{getAIStatusText()}</span>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full px-1.5 py-0.5 font-medium min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 flex items-center gap-2"
            onClick={() => {
              setShowAIChat(!showAIChat)
              setShowNotificationList(false)
              setShowChatHistory(false)
            }}
            disabled={uploadStatus !== "idle" && uploadStatus !== "ready" && uploadStatus !== "complete"}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Ask AI</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        {/* Regular actions */}
        <Button
          variant="ghost"
          className="rounded-full flex items-center gap-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
          onClick={onAddItem}
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </Button>

        {/* Upload button with light theme */}
        {(() => {
          if (uploadStatus === "idle") {
            return (
              <Button
                variant="ghost"
                className="rounded-full flex items-center gap-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                <span>Upload inventory</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileInputChange}
                />
              </Button>
            )
          }

          if (uploadStatus === "ready") {
            return (
              <div className="flex items-center gap-2">
                <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-2 max-w-[180px] border border-gray-200">
                  {getFileIcon()}
                  <span className="text-sm truncate text-gray-700">{uploadFile?.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 text-gray-400"
                    onClick={() => {
                      setUploadFile(null)
                      setUploadStatus("idle")
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="rounded-full h-8 bg-primary text-white hover:bg-primary/90 active:bg-primary/80 font-medium"
                  onClick={handleUploadClick}
                >
                  Process File
                </Button>
              </div>
            )
          }

          if (uploadStatus === "uploading" || uploadStatus === "processing" || uploadStatus === "analyzing") {
            return (
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 min-w-[200px] border border-gray-200">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1 text-gray-700">
                    <span>{processingMessage}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1.5 bg-gray-200 [&>*]:bg-primary" />
                </div>
              </div>
            )
          }

          if (uploadStatus === "complete") {
            return (
              <div className="flex items-center gap-2 bg-green-50 rounded-full px-3 py-1.5 border border-green-200">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-green-700 text-sm font-medium">Done</span>
              </div>
            )
          }

          return null
        })() as React.ReactNode}

        {/* Create Order button (conditional) */}
        {selectedItemsCount > 0 && (
          <Button
            className="rounded-full flex items-center gap-2 ml-2 bg-primary text-white hover:bg-primary/90 active:bg-primary/80 font-medium"
            onClick={handleCreateOrder}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Create Order ({selectedItemsCount})</span>
          </Button>
        )}
      </div>

      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-gray-700 font-medium">Drop file to upload</div>
        </div>
      )}
    </div>
  )
}

