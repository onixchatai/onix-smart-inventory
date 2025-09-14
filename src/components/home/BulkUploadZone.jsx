import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Upload, Zap, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function BulkUploadZone({ files, onFilesSelected, onRemoveFile }) {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    onFilesSelected(imageFiles);
  };

  const totalItems = files.length;
  const estimatedProcessingTime = Math.ceil(totalItems / 10) * 2; // 2 minutes per 10 images

  return (
    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 dark:text-slate-50">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          Bulk Processing Mode
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
            Enterprise
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <Alert className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-800">
          <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            <strong>Total Loss Mode:</strong> Upload all property photos at once. Our AI will process entire rooms and identify every item automatically.
          </AlertDescription>
        </Alert>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
            dragActive 
              ? "border-orange-400 dark:border-orange-600 bg-orange-50/50 dark:bg-orange-900/30" 
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
        >
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">
              Bulk Property Upload
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
              Perfect for total loss claims. Upload 50+ photos and let AI identify every item.
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-sm">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                <div className="font-semibold text-slate-900 dark:text-slate-50">{totalItems}</div>
                <div className="text-slate-600 dark:text-slate-400">Photos Ready</div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                <div className="font-semibold text-slate-900 dark:text-slate-50">~{estimatedProcessingTime}min</div>
                <div className="text-slate-600 dark:text-slate-400">Est. Processing</div>
              </div>
            </div>

            <Button
              onClick={() => document.getElementById('bulk-file-input').click()}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Select Multiple Photos
            </Button>
            
            <input
              id="bulk-file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => onFilesSelected(Array.from(e.target.files))}
              className="hidden"
            />
          </div>
        </div>

        {files.length > 10 && (
          <Alert className="mt-6 border-green-200 bg-green-50 dark:bg-green-900/30 dark:border-green-800">
            <AlertCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              <strong>Bulk Processing Ready:</strong> {files.length} photos uploaded. This will generate a comprehensive property inventory perfect for total loss claims.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}