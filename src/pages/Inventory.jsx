
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid, List, Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { InventoryItem } from "@/api/entities";
import { useInventory } from "../components/hooks/useInventory";

import InventoryFilters from "../components/inventory/InventoryFilters";
import ItemCard from "../components/inventory/ItemCard";
import ItemEditModal from "../components/inventory/ItemEditModal";
import ItemListView from "../components/inventory/ItemListView";

export default function InventoryPage() {
  const { inventory, refreshInventory, itemCount, totalValue } = useInventory();
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const filterItems = useCallback(() => {
    let filtered = inventory;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [inventory, searchTerm, selectedCategory]);

  useEffect(() => {
    filterItems();
  }, [inventory, filterItems]);

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleSaveItem = async (updatedItem) => {
    const { id, ...dataToUpdate } = updatedItem;
    await InventoryItem.update(id, dataToUpdate);
    refreshInventory();
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = async (itemId) => {
    await InventoryItem.delete(itemId);
    refreshInventory();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              My Inventory
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  {itemCount} items
                </Badge>
              </span>
              <span className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                  ${totalValue.toLocaleString()} total value
                </Badge>
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <Link to={createPageUrl("Home")} className="flex-1 lg:flex-none">
              <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Items
              </Button>
            </Link>
            <Link to={createPageUrl("Reports")} className="flex-1 lg:flex-none">
              <Button variant="outline" className="w-full lg:w-auto border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200">
                Generate Report
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search your inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                
                <Tabs value={viewMode} onValueChange={setViewMode}>
                  <TabsList className="bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger value="grid" className="px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 dark:text-slate-300 dark:data-[state=active]:text-white">
                      <Grid className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="list" className="px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 dark:text-slate-300 dark:data-[state=active]:text-white">
                      <List className="w-4 h-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <InventoryFilters 
                    items={inventory}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Items Display */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center">
              <Package className="w-12 h-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              {inventory.length === 0 ? "No Items Yet" : "No Items Found"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {inventory.length === 0 
                ? "Upload some photos to get started with your inventory"
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {inventory.length === 0 && (
              <Link to={createPageUrl("Home")}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Items
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </motion.div>
            ) : (
              <ItemListView
                items={filteredItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Edit Modal */}
      <ItemEditModal
        isOpen={showEditModal}
        item={selectedItem}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveItem}
      />
    </div>
  );
}
