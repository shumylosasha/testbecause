'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Building, Clock, Shield, Package, Play } from "lucide-react"
import Image from "next/image"
import { VENDOR_LOGOS } from "@/lib/constants"

interface ProductOffer {
  id: string
  title: string
  type: 'free' | 'recommended' | 'recent'
  labelColor: string
  description: string
  price?: string
  usageDuration: string
  quantity: string
  image: string
  rating: number
  vendor: {
    name: string
    rating: number
  }
  leadTime: string
  compliance: string[]
  sku: string
  unitPrice: number
  totalCost: number
  isVideo?: boolean
}

const sampleOffers: ProductOffer[] = [
  {
    id: '1',
    title: 'Surgical Masks',
    type: 'free',
    labelColor: 'bg-green-500',
    description: 'Premium quality surgical masks with high filtration efficiency',
    usageDuration: '2-3 days',
    quantity: '50 pieces',
    image: 'https://m.media-amazon.com/images/I/719j93kHtGL._AC_UY1000_.jpg',
    rating: 4.5,
    vendor: {
      name: '3M Healthcare',
      rating: 4.8
    },
    leadTime: '3-5 business days',
    compliance: ['FDA Approved', 'ISO 13485', 'CE Mark'],
    sku: 'MSK-2023-50',
    unitPrice: 0,
    totalCost: 0
  },
  {
    id: '2',
    title: 'Digital Thermometers',
    type: 'recommended',
    labelColor: 'bg-blue-500',
    description: 'High-precision digital thermometers for accurate temperature readings',
    price: '$29.99',
    usageDuration: '10 days',
    quantity: '100 units',
    image: 'https://newsnetwork.mayoclinic.org/n7-mcnn/7bcc9724adf7b803/uploads/2020/03/shutterstock_763301095_101F_Fotor-16x9-1-1024x576.jpg',
    rating: 4.8,
    vendor: {
      name: 'Medline',
      rating: 4.9
    },
    leadTime: '5-7 business days',
    compliance: ['FDA Approved', 'ISO 9001'],
    sku: 'DT-100-2024',
    unitPrice: 0.30,
    totalCost: 29.99,
    isVideo: true
  },
  {
    id: '3',
    title: 'Disposable Gloves',
    type: 'recent',
    labelColor: 'bg-purple-500',
    description: 'Medical-grade disposable gloves for healthcare professionals',
    price: '$199.99',
    usageDuration: '5 days',
    quantity: '1000 pairs',
    image: 'https://m.media-amazon.com/images/I/71GJx79GiFL._AC_UY1000_DpWeblab_.jpg',
    rating: 4.2,
    vendor: {
      name: 'Cardinal Health',
      rating: 4.6
    },
    leadTime: '2-3 business days',
    compliance: ['FDA Approved', 'ISO 13485', 'ASTM D6319'],
    sku: 'DG-1000-M',
    unitPrice: 0.20,
    totalCost: 199.99
  }
]

export function ProductDiscovery() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getVendorLogo = (vendorName: string) => {
    return VENDOR_LOGOS[vendorName as keyof typeof VENDOR_LOGOS] || VENDOR_LOGOS.default
  }

  const getButtonText = (offer: ProductOffer) => {
    if (offer.type === 'free') return 'Get Free Samples'
    return 'View'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Discovery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleOffers.map((offer) => (
            <div 
              key={offer.id} 
              className={`flex flex-col bg-card rounded-lg border shadow-sm
                ${offer.type === 'free' ? 'border-blue-400 border-2' : ''}
              `}
            >
              <div className={`relative h-48 w-full rounded-t-lg ${!offer.isVideo ? 'bg-gray-50' : ''}`}>
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className={`${offer.isVideo ? 'object-cover' : 'object-contain p-4'}`}
                />
                {offer.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/80 cursor-pointer">
                      <Play className="h-6 w-6 fill-current" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-base">{offer.title}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-mono">
                      {offer.sku}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="relative h-6 w-6 rounded-full bg-white shadow-sm overflow-hidden">
                      <Image
                        src={getVendorLogo(offer.vendor.name)}
                        alt={offer.vendor.name}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{offer.vendor.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-muted-foreground">
                        {offer.vendor.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">{offer.description}</p>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="ml-1 font-medium">{offer.quantity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Unit Price:</span>
                    <span className="ml-1 font-medium">{formatCurrency(offer.unitPrice)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usage:</span>
                    <span className="ml-1 font-medium">{offer.usageDuration}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Cost:</span>
                    <span className="ml-1 font-medium">{formatCurrency(offer.totalCost)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="ml-1 text-xs">{offer.leadTime}</span>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="flex flex-wrap gap-1 py-1">
                  {offer.compliance.map((cert, index) => (
                    <div key={index} className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-[10px]">
                      <Shield className="h-2.5 w-2.5 mr-1" />
                      {cert}
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-100" />

                <div className="flex justify-start">
                  <Button 
                    size="default" 
                    className="px-8 rounded-full"
                  >
                    {getButtonText(offer)}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 