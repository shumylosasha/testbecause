import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Category {
  value: string;
  label: string;
}

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: Omit<SupplyItem, "id">) => void;
  categories: Category[];
}

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

export function CreateItemDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
}: CreateItemDialogProps) {
  const [formData, setFormData] = useState<Omit<SupplyItem, "id">>({
    name: "",
    description: "",
    expiryDate: "",
    quantity: 0,
    department: "",
    hospital: "",
    condition: "New",
    price: 0,
    category: categories[0]?.value || "",
  });

  const [activeTab, setActiveTab] = useState("basic");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      description: "",
      expiryDate: "",
      quantity: 0,
      department: "",
      hospital: "",
      condition: "New",
      price: 0,
      category: categories[0]?.value || "",
    });
    setActiveTab("basic");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-0">
        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-2xl">List New Supply Item</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Add your item to the marketplace for other departments and hospitals to see.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 px-8 mb-6">
            <TabsTrigger value="basic" className="py-3">Basic Info</TabsTrigger>
            <TabsTrigger value="details" className="py-3">Details</TabsTrigger>
            <TabsTrigger value="source" className="py-3">Source & Pricing</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="px-8 pb-8">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="name" className="text-base">Item Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Medical Gloves (Latex-Free)"
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="category" className="text-base">Category*</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="description" className="text-base">Description*</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Include important details about the item"
                    className="min-h-[120px] text-base"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("details")}
                    className="h-12 px-6"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="px-8 pb-8">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="condition" className="text-base">Condition*</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) =>
                      setFormData({ ...formData, condition: value })
                    }
                    required
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Like New">Like New</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="expiryDate" className="text-base">Expiry Date*</Label>
                  <div className="flex">
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      className="h-12"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="quantity" className="text-base">Quantity*</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("basic")}
                    className="h-12 px-6"
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("source")}
                    className="h-12 px-6"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="source" className="px-8 pb-8">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="hospital" className="text-base">Hospital/Organization*</Label>
                  <Input
                    id="hospital"
                    value={formData.hospital}
                    onChange={(e) =>
                      setFormData({ ...formData, hospital: e.target.value })
                    }
                    placeholder="e.g., Central Hospital"
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="department" className="text-base">Department*</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="e.g., Emergency, Pharmacy"
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="price" className="text-base">Price ($)*</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="h-12"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Set a fair price to encourage exchange
                  </p>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="imageUrl" className="text-base">Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="h-12"
                  />
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("details")}
                    className="h-12 px-6"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="h-12 px-8">
                    List Item
                  </Button>
                </div>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}