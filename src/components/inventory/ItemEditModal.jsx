
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Save, X } from "lucide-react";

const categories = [
  "electronics", "furniture", "clothing", "jewelry", "appliances", 
  "books", "artwork", "tools", "sports", "other"
];

const conditions = ["excellent", "good", "fair", "poor"];

export default function ItemEditModal({ isOpen, item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    estimated_value: "",
    condition: "",
    brand: "",
    model: "",
    serial_number: "",
    room_location: "",
    purchase_date: "",
    purchase_price: ""
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        category: item.category || "",
        estimated_value: item.estimated_value?.toString() || "",
        condition: item.condition || "",
        brand: item.brand || "",
        model: item.model || "",
        serial_number: item.serial_number || "",
        room_location: item.room_location || "",
        purchase_date: item.purchase_date || "",
        purchase_price: item.purchase_price?.toString() || ""
      });
    }
  }, [item]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedItem = {
      ...item,
      ...formData,
      estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null
    };
    
    onSave(updatedItem);
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-slate-50">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Save className="w-4 h-4 text-white" />
            </div>
            Edit Item Details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="dark:text-slate-300">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter item name"
                  required
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                />
              </div>

              <div>
                <Label htmlFor="category" className="dark:text-slate-300">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="dark:focus:bg-slate-700">
                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition" className="dark:text-slate-300">Condition</Label>
                <Select value={formData.condition} onValueChange={(value) => handleChange('condition', value)}>
                  <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition} className="dark:focus:bg-slate-700">
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="room_location" className="dark:text-slate-300">Location/Room</Label>
                <Input
                  id="room_location"
                  value={formData.room_location}
                  onChange={(e) => handleChange('room_location', e.target.value)}
                  placeholder="e.g., Living Room, Office"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Financial & Product Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="estimated_value" className="dark:text-slate-300">Estimated Value ($)</Label>
                <Input
                  id="estimated_value"
                  type="number"
                  step="0.01"
                  value={formData.estimated_value}
                  onChange={(e) => handleChange('estimated_value', e.target.value)}
                  placeholder="Current market value"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                />
              </div>

              <div>
                <Label htmlFor="purchase_price" className="dark:text-slate-300">Purchase Price ($)</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => handleChange('purchase_price', e.target.value)}
                  placeholder="Original purchase price"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                />
              </div>

              <div>
                <Label htmlFor="purchase_date" className="dark:text-slate-300">Purchase Date</Label>
                <Input
                  id="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => handleChange('purchase_date', e.target.value)}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:[color-scheme:dark]"
                />
              </div>

              <div>
                <Label htmlFor="brand" className="dark:text-slate-300">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  placeholder="Manufacturer or brand"
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="model" className="dark:text-slate-300">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="Model number or name"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>

            <div>
              <Label htmlFor="serial_number" className="dark:text-slate-300">Serial Number</Label>
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => handleChange('serial_number', e.target.value)}
                placeholder="Serial number (if applicable)"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>

            <div>
              <Label htmlFor="description" className="dark:text-slate-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Additional details about the item"
                rows={3}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
