
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  { value: "all", label: "All Categories", count: 0 },
  { value: "electronics", label: "Electronics", count: 0 },
  { value: "furniture", label: "Furniture", count: 0 },
  { value: "clothing", label: "Clothing", count: 0 },
  { value: "jewelry", label: "Jewelry", count: 0 },
  { value: "appliances", label: "Appliances", count: 0 },
  { value: "books", label: "Books", count: 0 },
  { value: "artwork", label: "Artwork", count: 0 },
  { value: "tools", label: "Tools", count: 0 },
  { value: "sports", label: "Sports", count: 0 },
  { value: "other", label: "Other", count: 0 }
];

export default function InventoryFilters({ items = [], selectedCategory, onCategoryChange }) {
  // Count items in each category
  const categoryCount = items.reduce((acc, item) => {
    if (item.category) {
      acc[item.category] = (acc[item.category] || 0) + 1;
    }
    return acc;
  }, {});
  categoryCount.all = items.length;

  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const count = categoryCount[category.value] || 0;
          const isSelected = selectedCategory === category.value;
          
          return (
            <Button
              key={category.value}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.value)}
              className={`transition-all duration-200 ${
                isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700 dark:text-slate-300'
              }`}
              disabled={count === 0 && category.value !== "all"}
            >
              {category.label}
              {count > 0 && (
                <Badge 
                  variant="secondary" 
                  className={`ml-2 ${
                    isSelected 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
