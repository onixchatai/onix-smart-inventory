import React from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Building, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CompanySettings from "../components/settings/CompanySettings";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100/60 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <SettingsIcon className="w-4 h-4" />
            Platform Configuration
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            Settings
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600"> & Configuration</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Configure your Green Planet Inventory Platform to match your company branding and workflow preferences.
          </p>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="company" className="space-y-8">
            <TabsList className="grid w-full lg:w-auto grid-cols-1 lg:grid-cols-3 gap-2 bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl shadow-lg">
              <TabsTrigger value="company" className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <Building className="w-4 h-4" />
                Company Profile
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-emerald-500 data-[state=active]:text-white" disabled>
                <Users className="w-4 h-4" />
                Team Management
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-emerald-500 data-[state=active]:text-white" disabled>
                <Zap className="w-4 h-4" />
                Integrations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="company">
              <CompanySettings />
            </TabsContent>

            <TabsContent value="users">
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Team Management Coming Soon
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Advanced user management and role-based access controls will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Zap className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Integrations Coming Soon
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Direct integrations with insurance systems and property management platforms will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}