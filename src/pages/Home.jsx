
import React, { useState } from "react";
import { Upload, Camera, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

import ImageUploadZone from "../components/home/ImageUploadZone";
import ProcessingModal from "../components/home/ProcessingModal";
import HowItWorks from "../components/home/HowItWorks";
import { InventoryItem } from "@/api/entities";
import { UploadFile, InvokeLLM } from "@/api/integrations";

export default function HomePage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFilesSelected = (newFiles) => {
    setFiles(prev => [...prev, ...newFiles]);
    setError("");
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeImages = async () => {
    if (files.length === 0) {
      setError("Please upload at least one image to analyze");
      return;
    }

    setIsProcessing(true);
    setError("");
    setSuccess("");

    try {
      setProcessingStep("Uploading images...");
      
      const uploadPromises = files.map(file => UploadFile({ file }));
      const uploadResults = await Promise.all(uploadPromises);
      
      setProcessingStep("Analyzing items with AI...");
      
      const fileUrls = uploadResults.map(result => result.file_url);
      
      const analysisResult = await InvokeLLM({
        prompt: `Analyze these images of personal belongings and identify all items visible. For each item, provide detailed information including:
        - Name and description
        - Estimated category (electronics, furniture, clothing, jewelry, appliances, books, artwork, tools, sports, other)
        - Estimated current market value in USD
        - Condition assessment (excellent, good, fair, poor)
        - Brand/manufacturer if visible
        - Model if identifiable
        - Any serial numbers visible
        
        Be thorough and identify even small items. Focus on items that would be important for insurance purposes.`,
        file_urls: fileUrls,
        response_json_schema: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  category: { 
                    type: "string",
                    enum: ["electronics", "furniture", "clothing", "jewelry", "appliances", "books", "artwork", "tools", "sports", "other"]
                  },
                  estimated_value: { type: "number" },
                  condition: { 
                    type: "string", 
                    enum: ["excellent", "good", "fair", "poor"]
                  },
                  brand: { type: "string" },
                  model: { type: "string" },
                  serial_number: { type: "string" }
                }
              }
            }
          }
        }
      });

      setProcessingStep("Saving inventory items...");

      if (analysisResult.items && analysisResult.items.length > 0) {
        const newItems = analysisResult.items.map((item, index) => ({
          ...item,
          image_url: fileUrls[Math.floor(index / (analysisResult.items.length / fileUrls.length))],
          // Ensure default values for fields not returned by AI
          room_location: item.room_location || "",
          purchase_date: item.purchase_date || null,
          purchase_price: item.purchase_price || null,
        }));

        await InventoryItem.bulkCreate(newItems);

        setSuccess(`Successfully analyzed and added ${newItems.length} items to your inventory!`);
        window.dispatchEvent(new CustomEvent('inventoryUpdated'));
      } else {
        setSuccess("Analysis complete, but no new items were identified.");
      }
      
      setFiles([]);
      
      setTimeout(() => {
        navigate(createPageUrl("Inventory"));
      }, 2000);

    } catch (error) {
      console.error("Analysis error:", error);
      setError("Failed to analyze images. Please try again with clearer photos.");
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  return (
    <div>
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100/60 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Inventory Management
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6 leading-tight">
              Onix Chat
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Smart asset analysis</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Upload photos of your belongings and let our AI create a comprehensive inventory 
              with valuations, perfect for insurance claims and personal records.
            </p>
          </motion.div>

          {/* Status Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <Alert variant="destructive" className="border-red-500/50 bg-red-900/20 text-red-200">
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <Alert className="border-emerald-500/50 bg-emerald-900/20 text-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <AlertDescription className="font-medium">{success}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <ImageUploadZone 
                  files={files}
                  onFilesSelected={handleFilesSelected}
                  onRemoveFile={removeFile}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Button */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-8 text-center"
            >
              <Button
                onClick={analyzeImages}
                disabled={isProcessing}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-3" />
                Analyze My Items
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      
      <HowItWorks />

      <ProcessingModal 
        isOpen={isProcessing}
        currentStep={processingStep}
      />
    </div>
  );
}
