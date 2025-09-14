import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Activity, TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { agentSDK } from '@/agents';

export default function AutonomousAgentDashboard() {
  const [agentStatus, setAgentStatus] = useState({
    inventory_manager: { status: 'active', lastAction: 'Updated 12 item values', confidence: 94 },
    market_analyst: { status: 'active', lastAction: 'Market scan completed', confidence: 89 },
    insurance_liaison: { status: 'active', lastAction: 'Policy review scheduled', confidence: 92 }
  });

  const [autonomyLevel, setAutonomyLevel] = useState(95);
  const [humanInterventions, setHumanInterventions] = useState(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          AI Autonomous Control Center
        </h2>
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-4 py-2">
          {autonomyLevel}% AI Managed
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inventory Manager Agent */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              Inventory Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {agentStatus.inventory_manager.lastAction}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Confidence</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {agentStatus.inventory_manager.confidence}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Market Analyst Agent */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              Market Analyst
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {agentStatus.market_analyst.lastAction}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Confidence</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {agentStatus.market_analyst.confidence}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Liaison Agent */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              Insurance Liaison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {agentStatus.insurance_liaison.lastAction}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Confidence</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {agentStatus.insurance_liaison.confidence}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Autonomous Operations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Human interventions this month: {humanInterventions}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="dark:border-slate-700 dark:text-slate-200">
                View Activity Log
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                Agent Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}