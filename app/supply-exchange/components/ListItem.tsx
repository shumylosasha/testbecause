import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ShoppingCart, AlertCircle, Clock } from "lucide-react";
import Image from "next/image";

interface SupplyItem {
  id: string;
  name: string;
  description: string;
  expiryDate: string;
  quantity: number;
  department: string;
  hospital: string;
  condition: string;
  price: number;
  category: string;
  imageUrl?: string;
}

interface ListItemProps {
  item: SupplyItem;
}

export function ListItem({ item }: ListItemProps) {
  const daysUntilExpiry = Math.ceil(
    (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isExpiringSoon = daysUntilExpiry <= 30;
  const isLowStock = item.quantity <= 20;

  // Placeholder image if none provided
  const imageUrl = item.imageUrl || "https://via.placeholder.com/200?text=No+Image";
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full bg-gray-50">
        <Image 
          src={imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isExpiringSoon && (
            <Badge className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200">
              <Clock className="h-3 w-3" />
              Expires Soon
            </Badge>
          )}
          {item.category && (
            <Badge variant="secondary" className="whitespace-nowrap">
              {item.category}
            </Badge>
          )}
          {isLowStock && (
            <Badge variant="outline" className="bg-white/90">
              Low Stock
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
          <Badge variant="outline" className="ml-2 whitespace-nowrap">{item.condition}</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <div>
            <p className="font-medium text-lg">${item.price.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
          </div>
          
          <Button variant="default" size="sm" className="gap-1 py-2 px-4">
            <MessageSquare className="h-4 w-4" />
            Contact
          </Button>
        </div>
      </div>
      
      <div className="px-5 pb-5 pt-3 border-t text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-1">
            <span>From: {item.hospital}</span>
            <span>Dept: {item.department}</span>
          </div>
          <div className="text-right">
            <span>Expires: {formatDate(item.expiryDate)}</span>
            {isExpiringSoon && (
              <p className="text-amber-600 font-medium mt-1">In {daysUntilExpiry} days</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}