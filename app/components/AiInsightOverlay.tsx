import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Bot, LineChart, ShoppingCart, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

interface AiInsight {
  items: string[];
  reason: string;
  trendData?: {
    months: string[];
    usage: number[];
    prediction: number[];
  };
}

interface AiInsightOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  insight: AiInsight | null;
}

const AiInsightOverlay: React.FC<AiInsightOverlayProps> = ({ 
  isOpen, 
  onClose, 
  insight 
}) => {
  const overlayRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside and ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscKey);
      };
    }
    return undefined;
  }, [isOpen, onClose]);

  if (!isOpen || !insight) return null;

  // Generate chart data if not provided
  const chartData = insight.trendData || {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    usage: [65, 70, 75, 80, 85, 90, 85, 80, 75, 70, 65, 60],
    prediction: [60, 65, 70, 75, 80, 85, 90, 95, 100, 95, 90, 85]
  };

  const formattedData = chartData.months.map((month, index) => ({
    month,
    usage: chartData.usage[index],
    prediction: chartData.prediction[index]
  }));

  return (
    <AnimatePresence>
      {isOpen && insight && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Side Panel */}
          <motion.div
            ref={overlayRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 w-[calc(100%-32px)] max-w-[600px] bg-white shadow-lg z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <div className="text-lg font-semibold">AI Assistant</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* AI Message */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-gray-900">
                        I've noticed that <span className="font-semibold text-blue-700">{insight.items.join(' and ')}</span> are running low in your inventory.
                      </p>
                      <p className="text-gray-900">
                        Based on historical usage patterns and seasonal trends, I recommend considering a reorder soon to maintain optimal stock levels.
                      </p>
                    </div>
                  </div>

                  {/* Usage Trend Chart */}
                  <Card className="mt-4">
                    <CardContent className="pt-6">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={formattedData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                            <XAxis 
                              dataKey="month" 
                              className="text-sm text-gray-500"
                              tick={{ fill: '#6B7280' }}
                            />
                            <YAxis 
                              className="text-sm text-gray-500"
                              tick={{ fill: '#6B7280' }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.375rem',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="usage" 
                              stroke="#3B82F6" 
                              strokeWidth={2}
                              dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                              name="Historical Usage"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="prediction" 
                              stroke="#10B981" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={{ fill: '#10B981', strokeWidth: 2 }}
                              name="Predicted Usage"
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Suggested Actions */}
                  <div className="space-y-3 mt-6">
                    <Button className="w-full justify-start gap-2" onClick={() => alert('Initiate draft order action triggered')}>
                      <ShoppingCart className="h-4 w-4" />
                      Create Order for Low Stock Items
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => alert('View usage details action triggered')}>
                      <LineChart className="h-4 w-4" />
                      View Detailed Usage Analysis
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-primary" onClick={onClose}>
                      <CheckCircle className="h-4 w-4" />
                      Acknowledge & Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AiInsightOverlay; 