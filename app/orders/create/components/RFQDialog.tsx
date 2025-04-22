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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface RFQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: any[];
  selectedVendors: { [key: string]: string[] };
  onSend: (data: {
    items: { id: string; quantity: number }[];
    vendors: { id: string; sendEmail: boolean; initiateAiCall: boolean }[];
    notes: string;
  }) => Promise<void>;
}

export function RFQDialog({
  open,
  onOpenChange,
  items,
  selectedVendors,
  onSend,
}: RFQDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [notes, setNotes] = useState("");
  const [communicationPrefs, setCommunicationPrefs] = useState<{
    [vendorId: string]: { email: boolean; aiCall: boolean };
  }>({});

  const handleCommunicationChange = (vendorId: string, method: "email" | "aiCall", checked: boolean) => {
    setCommunicationPrefs((prev) => ({
      ...prev,
      [vendorId]: {
        ...prev[vendorId],
        [method]: checked,
      },
    }));
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const payload = {
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        vendors: Object.values(selectedVendors)
          .flatMap((vendors) =>
            vendors.map((vendor) => ({
              id: vendor,
              sendEmail: communicationPrefs[vendor]?.email ?? false,
              initiateAiCall: communicationPrefs[vendor]?.aiCall ?? false,
            }))
          )
          .filter((v) => v.sendEmail || v.initiateAiCall),
        notes,
      };

      await onSend(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending RFQ:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Generate RFQ</DialogTitle>
          <DialogDescription>
            Review and send your Request for Quotation to selected vendors
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Items Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Selected Vendors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {selectedVendors[item.id]?.length || 0} vendors
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Communication Preferences */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Communication Preferences</h3>
            <div className="rounded-md border p-4 space-y-4">
              {Object.values(selectedVendors)
                .flat()
                .filter((v, i, a) => a.indexOf(v) === i) // Get unique vendors
                .map((vendorId) => (
                  <div key={vendorId} className="space-y-2">
                    <Label className="font-medium">{vendorId}</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${vendorId}-email`}
                          checked={communicationPrefs[vendorId]?.email ?? false}
                          onCheckedChange={(checked) =>
                            handleCommunicationChange(
                              vendorId,
                              "email",
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`${vendorId}-email`}>Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${vendorId}-aiCall`}
                          checked={communicationPrefs[vendorId]?.aiCall ?? false}
                          onCheckedChange={(checked) =>
                            handleCommunicationChange(
                              vendorId,
                              "aiCall",
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`${vendorId}-aiCall`}>AI Call</Label>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information for the vendors..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send RFQ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 