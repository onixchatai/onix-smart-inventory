import { useState, useEffect, useCallback } from 'react';
import { InventoryItem } from '@/api/entities';

export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  
  const refreshInventory = useCallback(async () => {
    const items = await InventoryItem.list('-created_date');
    setInventory(items);
    setTotalValue(items.reduce((sum, item) => sum + (item.estimated_value || 0), 0));
  }, []);

  useEffect(() => {
    refreshInventory();

    const handleInventoryUpdate = () => refreshInventory();
    window.addEventListener('inventoryUpdated', handleInventoryUpdate);

    return () => {
      window.removeEventListener('inventoryUpdated', handleInventoryUpdate);
    };
  }, [refreshInventory]);
  
  return { 
    inventory, 
    totalValue, 
    itemCount: inventory.length,
    refreshInventory 
  };
}