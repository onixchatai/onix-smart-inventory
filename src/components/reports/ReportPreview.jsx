
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, MapPin, DollarSign } from "lucide-react";
import { format } from "date-fns";

const categoryColors = {
  electronics: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  furniture: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  clothing: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  jewelry: "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
  appliances: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  books: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
  artwork: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
  tools: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
  sports: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300",
  other: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
};

export default function ReportPreview({ reportData, items, isVisible }) {
  const totalValue = items.reduce((sum, item) => sum + (item.estimated_value || 0), 0);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm dark:shadow-slate-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 dark:text-slate-50">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                Report Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[600px] overflow-y-auto">
              {/* Report Header */}
              <div className="text-center p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/50 rounded-xl">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                  {reportData.title}
                </h2>
                <div className="space-y-1 text-slate-600 dark:text-slate-300">
                  {reportData.owner_name && (
                    <p><strong>Owner:</strong> {reportData.owner_name}</p>
                  )}
                  {reportData.owner_address && (
                    <p><strong>Address:</strong> {reportData.owner_address}</p>
                  )}
                  <p><strong>Report Date:</strong> {format(new Date(reportData.report_date), 'MMMM d, yyyy')}</p>
                  <p><strong>Purpose:</strong> {reportData.purpose}</p>
                </div>
              </div>

              {/* Summary Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{items.length}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total Items</div>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    ${totalValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">Total Value</div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Detailed Inventory</h3>
                <div className="space-y-4">
                  {items.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {index + 1}. {item.name}
                        </h4>
                        <Badge className={`${categoryColors[item.category]} text-xs`}>
                          {item.category?.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{item.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                        {item.brand && <div><strong>Brand:</strong> {item.brand}</div>}
                        {item.model && <div><strong>Model:</strong> {item.model}</div>}
                        {item.condition && <div><strong>Condition:</strong> {item.condition}</div>}
                        {item.estimated_value && (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <DollarSign className="w-3 h-3" />
                            ${item.estimated_value.toLocaleString()}
                          </div>
                        )}
                        {item.room_location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.room_location}
                          </div>
                        )}
                        {item.purchase_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(item.purchase_date), 'MMM yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {items.length > 5 && (
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        ... and {items.length - 5} more items
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Full list will be included in downloaded report
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              {reportData.additional_notes && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Additional Notes</h3>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                      {reportData.additional_notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This report was generated using InventoryAI on {format(new Date(), 'MMMM d, yyyy')}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  All values and information are based on user input and AI analysis
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
