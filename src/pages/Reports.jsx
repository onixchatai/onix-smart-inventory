
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Calendar, DollarSign, Package, Printer, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { InventoryItem } from "@/api/entities";
import { User } from "@/api/entities";

import ReportPreview from "../components/reports/ReportPreview";
import PrintableReport from "../components/reports/PrintableReport";
import InsuranceEmailAgent from "../components/reports/InsuranceEmailAgent";

export default function ReportsPage() {
  const [items, setItems] = useState([]);
  const [reportData, setReportData] = useState({
    title: "Personal Property Inventory Report",
    owner_name: "",
    owner_address: "",
    report_date: format(new Date(), 'yyyy-MM-dd'),
    purpose: "Insurance Claim Documentation",
    additional_notes: "",
    iicrc_certification_number: ""
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showEmailAgent, setShowEmailAgent] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [savedItems, user] = await Promise.all([
        InventoryItem.list('-created_date'),
        User.me().catch(() => null)
      ]);
      setItems(savedItems);
      if (user) {
        setReportData(prev => ({
          ...prev,
          owner_name: user.company_name || prev.owner_name,
          owner_address: user.company_address || prev.owner_address,
          iicrc_certification_number: user.iicrc_certification_number || ""
        }));
      }
    };
    loadData();
  }, []);

  const handleInputChange = (field, value) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const generateReport = () => {
    setShowPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalValue = items.reduce((sum, item) => sum + (item.estimated_value || 0), 0);

  return (
    <>
      <div className="p-4 md:p-8 no-print">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100/60 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <FileText className="w-4 h-4" />
              Professional Insurance Reports
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-6">
              Generate
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600"> Claim Report</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Create professional documentation of your inventory for insurance claims, 
              estate planning, or personal records.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm dark:shadow-slate-950/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{items.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Items</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm dark:shadow-slate-950/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">${totalValue.toLocaleString()}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Value</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm dark:shadow-slate-950/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {format(new Date(), 'MMM d')}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Report Date</div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Report Configuration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm dark:shadow-slate-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 dark:text-slate-50">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    Report Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="dark:text-slate-300">Report Title</Label>
                    <Input
                      id="title"
                      value={reportData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="owner_name" className="dark:text-slate-300">Client / Property Owner Name</Label>
                    <Input
                      id="owner_name"
                      value={reportData.owner_name}
                      onChange={(e) => handleInputChange('owner_name', e.target.value)}
                      placeholder="Client's full name"
                      className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="owner_address" className="dark:text-slate-300">Property Address</Label>
                    <Textarea
                      id="owner_address"
                      value={reportData.owner_address}
                      onChange={(e) => handleInputChange('owner_address', e.target.value)}
                      placeholder="Full address of the property"
                      rows={3}
                      className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="purpose" className="dark:text-slate-300">Report Purpose</Label>
                    <Input
                      id="purpose"
                      value={reportData.purpose}
                      onChange={(e) => handleInputChange('purpose', e.target.value)}
                      placeholder="e.g., Insurance Claim, Estate Planning"
                      className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="report_date" className="dark:text-slate-300">Report Date</Label>
                    <Input
                      id="report_date"
                      type="date"
                      value={reportData.report_date}
                      onChange={(e) => handleInputChange('report_date', e.target.value)}
                      className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:[color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="additional_notes" className="dark:text-slate-300">Additional Notes</Label>
                    <Textarea
                      id="additional_notes"
                      value={reportData.additional_notes}
                      onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                      placeholder="Any additional information for the report"
                      rows={4}
                      className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      onClick={generateReport}
                      disabled={items.length === 0}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Report
                    </Button>
                    
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      disabled={items.length === 0}
                      className="w-full border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print / Save as PDF
                    </Button>

                    <Button
                      onClick={() => setShowEmailAgent(!showEmailAgent)}
                      disabled={items.length === 0}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email to Insurance
                    </Button>
                  </div>

                  {items.length === 0 && (
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        You need to add items to your inventory before generating a report.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Report Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ReportPreview
                reportData={reportData}
                items={items}
                isVisible={showPreview}
              />
            </motion.div>
          </div>

          {/* Insurance Email Agent */}
          <InsuranceEmailAgent
            reportData={reportData}
            items={items}
            isVisible={showEmailAgent}
          />
        </div>
      </div>
      <PrintableReport reportData={reportData} items={items} />
    </>
  );
}
