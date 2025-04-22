"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MessageSquare,
  AlertTriangle,
  Bell,
  X,
  Mic,
  UserPlus,
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  FileSpreadsheet,
  File,
  FileIcon as FilePdf
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface VendorQuickActionsProps {
  onChatWithAI: () => void
  onAddVendor: () => void
  onUploadVendors: (file: File) => Promise<void>
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
}

type UploadStatus = "idle" | "ready" | "uploading" | "processing" | "analyzing" | "complete"

export function VendorQuickActions({
  onChatWithAI,
  onAddVendor,
  onUploadVendors,
}: VendorQuickActionsProps) {
  const [showNotificationList, setShowNotificationList] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [aiChatInput, setAIChatInput] = useState("")
  const [aiChatMessages, setAIChatMessages] = useState<
    Array<{
      role: "user" | "assistant"
      content: string
      action?: {
        label: string
        onClick: () => void
      }
    }>
  >([
    {
      role: "assistant",
      content: "Hello! I'm your procurement assistant. How can I help you with vendor management today?",
      action: {
        label: "View Vendors",
        onClick: () => (window.location.href = "/vendors"),
      },
    },
  ])
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

  const updateUnreadCount = (notifs: AINotification[]) => {
    setUnreadCount(notifs.filter((n) => !n.read).length)
  }

  useEffect(() => {
    // Initial notifications
    const initialNotifications: AINotification[] = [
      {
        id: "1",
        message: "3 vendors have updated their catalogs this week",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false,
        type: "info",
        action: {
          label: "View Updates",
          onClick: () => alert("Viewing vendor catalog updates..."),
        },
      },
      {
        id: "2",
        message: "Contract renewal needed for MedSupply Inc.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        type: "alert",
        action: {
          label: "Review Contract",
          onClick: () => alert("Reviewing vendor contract..."),
        },
      },
    ]

    setNotifications(initialNotifications)
    updateUnreadCount(initialNotifications)
    setAiStatus(initialNotifications.some((n) => n.type === "alert" && !n.read) ? "attention" : "ok")
  }, [])

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
        return <Bell className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const getAIStatusText = () => {
    if (notifications.some((n) => n.type === "alert" && !n.read)) {
      return "Action needed"
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

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          text: "I can help you analyze this vendor's performance based on historical data.",
          action: {
            label: "View Analysis",
            onClick: () => alert("Viewing vendor analysis..."),
          },
        },
        {
          text: "Would you like me to compare pricing across similar vendors?",
          action: {
            label: "Compare Pricing",
            onClick: () => alert("Comparing vendor pricing..."),
          },
        },
        {
          text: "I can help you identify potential new vendors for your product categories.",
          action: {
            label: "Find Vendors",
            onClick: () => alert("Finding potential vendors..."),
          },
        },
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiMessage = {
        role: "assistant" as const,
        content: randomResponse.text,
        action: randomResponse.action,
      }
      setAIChatMessages((prev) => [...prev, aiMessage])
    }, 1000)

    // Call the actual onChatWithAI function if needed
    onChatWithAI()
  }

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

  const handleFileSelected = (file: File) => {
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv") || 
                file.type === "application/vnd.ms-excel" || 
                file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setUploadFile(file)
      setUploadStatus("ready")
    } else {
      alert("Please select a valid CSV or Excel file")
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
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 10
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
      setUploadProgress(100)
      setUploadStatus("processing")
      setProcessingMessage("Processing vendor data...")
      
      // Add AI notification about processing
      addAINotification("Analyzing vendor information with AI", "info", {
        label: "View Analysis",
        onClick: () => alert("Viewing AI analysis..."),
      })

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Analyzing stage
      setUploadStatus("analyzing")
      setProcessingMessage("Validating vendor information...")

      // Simulate analysis delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Call the actual upload handler
      await onUploadVendors(uploadFile)

      // Complete the upload
      setUploadStatus("complete")
      setProcessingMessage("Vendors imported successfully!")
      
      // Add a notification about the imported vendors - fixed to 3 from the mock data
      addAINotification(
        `Successfully imported 3 new vendors from ${uploadFile.name}`,
        "info",
        {
          label: "View Vendors",
          onClick: () => window.location.reload(),
        }
      )

      // Reset after a delay
      setTimeout(() => {
        setUploadFile(null)
        setUploadStatus("idle")
        setProcessingMessage("")
        setUploadProgress(0)
      }, 2000)
    } catch (error) {
      console.error("Error uploading vendors:", error)
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

    setNotifications((prev) => [newNotification, ...prev])
    updateUnreadCount([newNotification, ...notifications])

    if (type === "alert") {
      setAiStatus("attention")
    }
  }

  const getFileIcon = () => {
    if (!uploadFile) return <Upload className="h-4 w-4" />

    const fileType = uploadFile.type
    if (fileType === "application/pdf" || uploadFile.name.endsWith('.pdf')) {
      return <FilePdf className="h-4 w-4 text-red-500" />
    } else if (
      fileType === "application/vnd.ms-excel" ||
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      uploadFile.name.endsWith('.xlsx') ||
      uploadFile.name.endsWith('.xls') ||
      uploadFile.name.endsWith('.csv')
    ) {
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />
    }

    return <File className="h-4 w-4" />
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      {/* Notification list with dark theme */}
      {showNotificationList && (
        <div className="absolute bottom-full mb-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden text-gray-200">
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <h4 className="font-medium">AI Notifications</h4>
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-gray-300 hover:bg-gray-800 hover:text-white">
              Mark all as read
            </Button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 hover:bg-gray-800/50 transition-colors",
                      !notification.read && "bg-primary/20",
                    )}
                  >
                    <div className="flex gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
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
        <div className="absolute bottom-full mb-2 w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Chat with AI Assistant</h4>
            <Button variant="ghost" size="icon" onClick={() => setShowAIChat(false)} className="text-gray-500 hover:bg-gray-100 hover:text-gray-900">
              <X className="h-4 w-4" />
            </Button>
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
          </div>
          <div className="p-3 border-t border-gray-200">
            <form onSubmit={handleAIChatSubmit} className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  value={aiChatInput}
                  onChange={(e) => setAIChatInput(e.target.value)}
                  placeholder="Ask a question about vendors..."
                  className="flex-1 bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-primary"
                />
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost"
                  className="h-10 w-10 shrink-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => {
                    // Voice input placeholder
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
                  "Show top vendors",
                  "Find new suppliers",
                  "Check contract expiration dates",
                  "Compare vendor ratings",
                  "Analyze vendor spend",
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => {
                      setAIChatInput(suggestion)
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
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
          isDragging && "ring-2 ring-blue-500 border-blue-200 bg-blue-50"
        )}
      >
        {/* AI Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full flex items-center gap-2 relative text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
            onClick={() => {
              setShowNotificationList(!showNotificationList)
              setShowAIChat(false)
            }}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                aiStatus === "ok" ? "bg-purple-500" : "bg-purple-500 animate-pulse",
              )}
            ></div>
            <span className="font-medium text-[14px]">{getAIStatusText()}</span>
            {unreadCount > 0 && (
              <span className="bg-gray-800 text-white text-xs rounded-full px-1.5 py-0.5 font-medium min-w-[20px] text-center">
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
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Ask AI</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        {/* Vendor Actions */}
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full flex items-center gap-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
          onClick={onAddVendor}
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Vendor</span>
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          accept=".csv,.xlsx,.xls"
        />

        {/* Upload button with file handling */}
        {uploadStatus === "idle" && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full flex items-center gap-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Vendors</span>
          </Button>
        )}

        {uploadStatus === "ready" && (
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
              className="rounded-full h-8 bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 font-medium"
              onClick={handleUploadClick}
            >
              Process File
            </Button>
          </div>
        )}

        {uploadStatus === "uploading" && (
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 min-w-[200px] border border-gray-200">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1 text-gray-700">
                <span>Uploading file...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1.5 bg-gray-200" />
            </div>
          </div>
        )}

        {uploadStatus === "processing" && (
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 min-w-[200px] border border-gray-200">
            <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1 text-gray-700">
                <span>Processing vendor data...</span>
              </div>
              <Progress value={100} className="h-1.5 bg-gray-200" />
            </div>
          </div>
        )}

        {uploadStatus === "analyzing" && (
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 min-w-[200px] border border-gray-200">
            <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1 text-gray-700">
                <span>Analyzing vendor information...</span>
              </div>
              <Progress value={100} className="h-1.5 bg-gray-200" />
            </div>
          </div>
        )}

        {uploadStatus === "complete" && (
          <div className="flex items-center gap-2 bg-green-50 rounded-full px-3 py-1.5 border border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">Done</span>
          </div>
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