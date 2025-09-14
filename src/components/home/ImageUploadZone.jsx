import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, X, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export default function ImageUploadZone({ files, onFilesSelected, onRemoveFile }) {
  const [dragActive, setDragActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);

  const isFileSupported = (file) => {
    return SUPPORTED_FILE_TYPES.includes(file.type.toLowerCase());
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (fileList) => {
    setUploadError('');
    
    const supportedFiles = [];
    const unsupportedFiles = [];
    
    fileList.forEach(file => {
      if (isFileSupported(file)) {
        supportedFiles.push(file);
      } else {
        unsupportedFiles.push(file);
      }
    });
    
    if (unsupportedFiles.length > 0) {
      const unsupportedNames = unsupportedFiles.map(f => f.name).join(', ');
      setUploadError(`Unsupported file format(s): ${unsupportedNames}. Please use JPG, PNG, or WebP files only. iPhone users: Please convert HEIC files to JPG first.`);
    }
    
    if (supportedFiles.length > 0) {
      onFilesSelected(supportedFiles);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !cameraReady) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onFilesSelected([file]);
      setShowCamera(false);
    }, 'image/jpeg', 0.8);
  };

  React.useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera]);

  return (
    <>
      <div className="p-8">
        {/* Error Alert */}
        {uploadError && (
          <div className="mb-6">
            <Alert variant="destructive" className="border-red-500/50 bg-red-50 dark:bg-red-900/20">
              <AlertDescription className="text-red-700 dark:text-red-300">
                {uploadError}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
            dragActive 
              ? "border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 scale-[1.02]" 
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={SUPPORTED_EXTENSIONS.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Upload className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">
              Upload Your Photos
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
              Drag & drop images here or choose from your device
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="px-6 py-3 text-base font-semibold rounded-xl border-2 dark:border-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose Files
              </Button>
              
              <Button
                onClick={() => setShowCamera(true)}
                className="px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photos
              </Button>
            </div>
            
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-6">
              Supports JPG, PNG, WebP • Max 10MB per file
              <br />
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                iPhone users: Convert HEIC files to JPG first
              </span>
            </p>
          </div>
        </div>

        {/* File Preview Grid */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Ready to Analyze ({files.length} {files.length === 1 ? 'image' : 'images'})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <AnimatePresence>
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    <Card className="overflow-hidden border-2 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-200 bg-slate-100 dark:bg-slate-800/50">
                      <CardContent className="p-0 aspect-square">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          onClick={() => onRemoveFile(index)}
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </CardContent>
                    </Card>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                      {file.name}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="sm:max-w-2xl dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-slate-50">
              <Camera className="w-5 h-5" />
              Take a Photo
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-3 mx-auto" />
                  <p>Loading camera...</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCamera(false)}
              className="dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={capturePhoto}
              disabled={!cameraReady}
              className="bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              Capture
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}