

import React, { useEffect, useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Leaf, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeProvider as ShadcnThemeProvider, useTheme } from './components/ThemeProvider';
import AIAssistant from './components/ai/AIAssistant';
import ErrorBoundary from './components/ErrorBoundary';
import { useInventory } from './components/hooks/useInventory';
import { useNavigation } from './components/hooks/useNavigation';
import { User } from '@/api/entities';

// Memoized Stats Component
const InventoryStats = React.memo(({ itemCount, totalValue }) => (
  <div className="px-3 py-4 space-y-4">
    <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
      <div className="flex items-center gap-3 text-sm">
        <div className="w-4 h-4 rounded-full bg-emerald-600 dark:bg-emerald-400" />
        <span className="text-slate-600 dark:text-slate-300 font-medium">Total Items</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
        {itemCount}
      </div>
    </div>
    
    <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:to-emerald-950/50 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
      <div className="flex items-center gap-3 text-sm">
        <div className="w-4 h-4 rounded-full bg-emerald-600 dark:bg-emerald-400" />
        <span className="text-emerald-700 dark:text-emerald-300 font-medium">Est. Value</span>
      </div>
      <div className="mt-2 text-xl font-bold text-emerald-800 dark:text-emerald-200">
        ${totalValue.toLocaleString()}
      </div>
    </div>
  </div>
));

// Memoized Theme Toggle Component
const ThemeToggle = React.memo(() => {
  const { setTheme, theme } = useTheme();
  
  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
});

// Add Sign Out Component
const SignOutButton = React.memo(() => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await User.logout();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
      title="Sign Out"
    >
      <LogOut className="h-5 w-5" />
      <span className="sr-only">Sign out</span>
    </Button>
  );
});

function LayoutComponent({ children, currentPageName }) {
  const location = useLocation();
  const { itemCount, totalValue } = useInventory(); 
  const { navigationItems, isActive } = useNavigation();
  const { open: isSidebarOpen, setOpen: setSidebarOpen } = useSidebar();

  // Force sidebar to stay open on desktop, close on mobile route changes
  useEffect(() => {
    // Only close sidebar on mobile when route changes
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  // Handle sidebar overlay click
  const handleOverlayClick = useCallback(() => {
    setSidebarOpen(false); 
  }, [setSidebarOpen]);

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-900/50">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar - Force visibility on desktop */}
      <Sidebar className="border-r border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm bg-white/80 dark:bg-slate-950/80">
        <SidebarHeader className="border-b border-slate-200/60 dark:border-slate-800/60 p-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
                <Camera className="w-2 h-2 text-amber-900" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-50 text-lg">Green Planet</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inventory Platform</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 py-2">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`group hover:bg-emerald-50 dark:hover:bg-emerald-900/50 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300 rounded-xl px-3 py-3 ${
                        isActive(item.url) 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25' 
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                      tooltip={item.title}
                    >
                      <Link to={item.url} className="flex items-center gap-3 w-full">
                        <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                          isActive(item.url) ? 'text-white' : ''
                        }`} />
                        <span className="font-semibold text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div>
            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <InventoryStats itemCount={itemCount} totalValue={totalValue} />
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </SidebarContent>

        <SidebarFooter className="border-t border-slate-200/60 dark:border-slate-800/60 p-4 flex justify-between items-center">
          <SignOutButton />
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 flex flex-col">
        <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/60 px-6 py-4 md:hidden">
          <div className="flex items-center gap-4">
            <SidebarTrigger 
              className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors duration-200"
            />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Green Planet</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>
      
      <AIAssistant />
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <ShadcnThemeProvider storageKey="inventory-ai-theme">
      <ErrorBoundary>
        <SidebarProvider>
          <LayoutComponent currentPageName={currentPageName}>
            {children}
          </LayoutComponent>
        </SidebarProvider>
      </ErrorBoundary>
    </ShadcnThemeProvider>
  );
}

