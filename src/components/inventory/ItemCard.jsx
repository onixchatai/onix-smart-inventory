
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

const categoryColors = {
  electronics: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800/50",
  furniture: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800/50",
  clothing: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800/50",
  jewelry: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-800/50",
  appliances: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800/50",
  books: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800/50",
  artwork: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-800/50",
  tools: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800/50",
  sports: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-800/50",
  other: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
};

const conditionColors = {
  excellent: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  fair: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  poor: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
};

export default function ItemCard({ item, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl dark:shadow-slate-950/50 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden group">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
              <span className="text-slate-400 dark:text-slate-500 text-sm">No Image</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onEdit(item)}
              className="w-8 h-8 bg-white/90 dark:bg-slate-950/90 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(item.id)}
              className="w-8 h-8 bg-white/90 dark:bg-slate-950/90 hover:bg-red-50 dark:hover:bg-red-900/50 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Category */}
          <div className="mb-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 leading-tight line-clamp-2">
                {item.name}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge className={`text-xs ${categoryColors[item.category]} border`}>
                {item.category?.replace('_', ' ')}
              </Badge>
              {item.condition && (
                <Badge variant="outline" className={`text-xs ${conditionColors[item.condition]}`}>
                  {item.condition}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Details */}
          <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            {item.brand && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Brand:</span>
                <span>{item.brand}</span>
              </div>
            )}
            
            {item.estimated_value && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ${item.estimated_value.toLocaleString()}
                </span>
              </div>
            )}
            
            {item.room_location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{item.room_location}</span>
              </div>
            )}
            
            {item.purchase_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(item.purchase_date), 'MMM yyyy')}</span>
              </div>
            )}
          </div>

          {/* Action Buttons for Mobile */}
          <div className="flex gap-2 mt-4 md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
              className="flex-1 text-xs dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="text-xs"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
