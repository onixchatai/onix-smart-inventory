import { useCallback } from 'react';
import { useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Package, Upload, FileText, Settings } from "lucide-react";

const navigationItems = [
  {
    title: "Upload & Scan",
    url: createPageUrl("Home"),
    icon: Upload,
    permissions: ['user', 'admin']
  },
  {
    title: "My Inventory",
    url: createPageUrl("Inventory"),
    icon: Package,
    permissions: ['user', 'admin']
  },
  {
    title: "Generate Report",
    url: createPageUrl("Reports"),
    icon: FileText,
    permissions: ['user', 'admin']
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
    permissions: ['admin']
  },
];

export function useNavigation() {
  const location = useLocation();
  
  const isActive = useCallback((url) => location.pathname === url, [location.pathname]);
  
  const getFilteredNavigation = useCallback((userRole = 'admin') => {
    return navigationItems.filter(item => 
      item.permissions.includes(userRole)
    );
  }, []);
  
  return { 
    navigationItems, 
    isActive,
    getFilteredNavigation 
  };
}