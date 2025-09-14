
import React from 'react';
import { motion } from "framer-motion";
import { Sparkles, Upload, Brain, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const processingSteps = [
  { key: "Uploading images", icon: Upload, label: "Uploading Images" },
  { key: "Analyzing items with AI", icon: Brain, label: "AI Analysis" },
  { key: "Saving inventory items", icon: Save, label: "Saving Items" }
];

export default function ProcessingModal({ isOpen, currentStep }) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Processing Your Items
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Our AI is analyzing your photos...
          </p>

          <div className="space-y-4">
            {processingSteps.map((step, index) => {
              const isActive = currentStep.includes(step.key);
              const isCompleted = processingSteps.slice(0, index).some(s => 
                currentStep.includes(s.key) && currentStep !== step.key
              );
              
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0.5, x: -20 }}
                  animate={{ 
                    opacity: isActive ? 1 : (isCompleted ? 0.8 : 0.5),
                    x: isActive ? 0 : -20,
                    scale: isActive ? 1.02 : 1
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-300 ${
                    isActive ? 'bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                  }`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className={`font-medium ${
                    isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="ml-auto w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
