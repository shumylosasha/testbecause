"use client"

import { useSidebar } from "@/components/sidebar-provider"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Package, 
  ShoppingCart, 
  Users, 
  FileCheck, 
  FileBarChart, 
  LayoutDashboard, 
  MessageSquare, 
  Replace, 
  User,
  Building,
  Link as LinkIcon
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const adminMenuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Vendors", href: "/vendors", icon: Users },
  { name: "Integrations", href: "/integrations", icon: LinkIcon },
  { name: "Reports", href: "/reports", icon: FileBarChart },
  { name: "Compliance", href: "/compliance", icon: FileCheck },
  { name: "Supply Exchange", href: "/supply-exchange", icon: Replace },
  { name: "Feedback", href: "/feedback", icon: MessageSquare },
]

const vendorMenuItems = [
  { name: "Dashboard", href: "/vendor-dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/vendor-orders", icon: ShoppingCart },
  { name: "Catalogue", href: "/vendor-catalog", icon: Package },
  { name: "Integrations", href: "/vendor-integrations", icon: LinkIcon },
]

export default function Sidebar() {
  // const { isOpen, toggle } = useSidebar() // Keep or remove later based on pinning feature
  const pathname = usePathname()
  const router = useRouter()
  const [showVendorMenu, setShowVendorMenu] = useState(false)

  const activeMenuItems = showVendorMenu ? vendorMenuItems : adminMenuItems

  const toggleUserMode = () => {
    const newMode = !showVendorMenu
    setShowVendorMenu(newMode)
    
    // Navigate to the appropriate dashboard
    if (newMode) {
      // If switching to Vendor mode, go to vendor dashboard
      router.push('/vendor-dashboard')
    } else {
      // If switching to Procurement mode, go to main dashboard
      router.push('/')
    }
  }

  return (
    <div
      className={cn(
        "group h-screen bg-white border-r transition-all duration-150 flex flex-col",
        "fixed top-0 left-0 z-50",
        "w-[60px] hover:w-[240px]"
      )}
    >
      <div className="p-4 flex justify-start items-center h-[60px] flex-shrink-0">
        <h2 className="font-bold text-md transition-opacity duration-150 delay-75">AMS</h2>
      </div>

      <nav className="mt-4 flex-grow overflow-y-auto overflow-x-hidden">
        <ul className="space-y-2 px-[14px]">
          {activeMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  title={item.name}
                  className={cn(
                    "flex items-center p-2 rounded-md transition-colors space-x-3 h-[44px]",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <div className={cn("flex-shrink-0", isActive ? "" : "")}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75 whitespace-nowrap text-sm font-medium">
                    {item.name}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="border-t mt-auto flex-shrink-0 flex items-center py-2 group-hover:px-[14px] px-[14px]">
        <button 
          onClick={toggleUserMode}
          title={showVendorMenu ? "Switch to Procurement" : "Switch to Vendor"}
          className={cn(
            "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center transition-colors flex-shrink-0",
            "mx-auto group-hover:mx-0",
            showVendorMenu ? "bg-primary/20 hover:bg-primary/30" : "bg-gray-200 hover:bg-gray-300"
          )}
        >
          <User className={cn("h-5 w-5", showVendorMenu ? "text-primary" : "text-gray-500")} />
        </button>
        <span className="text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75 whitespace-nowrap group-hover:ml-2">
          {showVendorMenu ? "Vendor" : "Procurement"}
        </span>
      </div>

    </div>
  )
}

