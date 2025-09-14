import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Bot, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InvokeLLM, SendEmail } from '@/api/integrations';

export default function InsuranceEmailAgent({ reportData, items, isVisible }) {
  const [emailData, setEmailData] = useState({
    insurance_email: '',
    policy_number: '',
    claim_number: '',
    incident_description: '',
    custom_message: ''
  });
  
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
  };

  const generateEmail = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const totalValue = items.reduce((sum, item) => sum + (item.estimated_value || 0), 0);
      const itemsByCategory = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});
      
      const prompt = `Generate a professional insurance claim email with the following details:
      
      Owner: ${reportData.owner_name}
      Address: ${reportData.owner_address}
      Policy Number: ${emailData.policy_number}
      Claim Number: ${emailData.claim_number}
      Incident Description: ${emailData.incident_description}
      Custom Message: ${emailData.custom_message}
      
      Inventory Summary:
      - Total Items: ${items.length}
      - Total Estimated Value: $${totalValue.toLocaleString()}
      - Items by Category: ${Object.entries(itemsByCategory).map(([cat, count]) => `${cat}: ${count}`).join(', ')}
      
      The email should be professional, concise, and include:
      1. A proper greeting
      2. Reference to the claim/policy numbers
      3. Brief description of the incident
      4. A statement mentioning that a detailed inventory is attached below.
      5. Request for claim processing
      6. Professional closing
      
      Keep it business-appropriate and around 150-250 words. Do not include the inventory list in your response, just the email text.`;
      
      const response = await InvokeLLM({ prompt });
      setGeneratedEmail(response);
      
    } catch (error) {
      console.error('Email generation error:', error);
      setError('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!emailData.insurance_email) {
      setError('Please enter the insurance company email address.');
      return;
    }
    
    setIsSending(true);
    setError('');
    
    try {
      const totalValue = items.reduce((sum, item) => sum + (item.estimated_value || 0), 0);
      
      const llmMessageHtml = generatedEmail.replace(/\n/g, '<br />');

      const inventoryTableHtml = `
        <br/><br/>
        <hr/>
        <h2 style="font-family: sans-serif; color: #333;">Detailed Inventory Report</h2>
        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
          <thead>
            <tr style="background-color: #f2f2f2; text-align: left;">
              <th style="padding: 8px; border: 1px solid #ddd;">Item Name</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Category</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Condition</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Est. Value</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; border: 1px solid #ddd;">${item.name || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.category || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.condition || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">$${(item.estimated_value || 0).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background-color: #f2f2f2; font-weight: bold;">
              <td colSpan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Estimated Value</td>
              <td style="padding: 8px; border: 1px solid #ddd;">$${totalValue.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <br/>
        <p style="font-family: sans-serif; font-size: 12px; color: #777;">
          This report was generated using Onix Chat AI asset analysis system on ${new Date().toLocaleDateString()}.
        </p>
      `;
      
      const emailBody = `
        <html>
          <body style="font-family: sans-serif; line-height: 1.6;">
            ${llmMessageHtml}
            ${inventoryTableHtml}
          </body>
        </html>
      `;
      
      await SendEmail({
        to: emailData.insurance_email,
        subject: `Insurance Claim Documentation - Policy: ${emailData.policy_number || 'N/A'}`,
        body: emailBody,
        from_name: reportData.owner_name || 'Onix Chat User'
      });
      
      setEmailSent(true);
      
    } catch (err) {
      console.error('Email sending error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'An unknown error occurred.';
      setError(`Failed to send email. Server responded with: "${errorMessage}". Please check the details and try again.`);
    } finally {
      setIsSending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm dark:shadow-slate-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 dark:text-slate-50">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            AI Insurance Email Agent
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {emailSent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Email Sent Successfully!
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your insurance claim documentation has been sent to {emailData.insurance_email}
              </p>
            </div>
          ) : (
            <>
              {error && (
                <Alert variant="destructive" className="border-red-500/50 bg-red-50 dark:bg-red-900/20">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="insurance_email" className="dark:text-slate-300">Insurance Company Email *</Label>
                  <Input
                    id="insurance_email"
                    type="email"
                    value={emailData.insurance_email}
                    onChange={(e) => handleInputChange('insurance_email', e.target.value)}
                    placeholder="claims@insurance-company.com"
                    className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  />
                </div>

                <div>
                  <Label htmlFor="policy_number" className="dark:text-slate-300">Policy Number</Label>
                  <Input
                    id="policy_number"
                    value={emailData.policy_number}
                    onChange={(e) => handleInputChange('policy_number', e.target.value)}
                    placeholder="Your policy number"
                    className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="claim_number" className="dark:text-slate-300">Claim Number (if available)</Label>
                <Input
                  id="claim_number"
                  value={emailData.claim_number}
                  onChange={(e) => handleInputChange('claim_number', e.target.value)}
                  placeholder="Your claim reference number"
                  className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                />
              </div>

              <div>
                <Label htmlFor="incident_description" className="dark:text-slate-300">Brief Incident Description *</Label>
                <Textarea
                  id="incident_description"
                  value={emailData.incident_description}
                  onChange={(e) => handleInputChange('incident_description', e.target.value)}
                  placeholder="e.g., Fire damage at home on [Date], Water damage from burst pipe."
                  rows={3}
                  className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <Label htmlFor="custom_message" className="dark:text-slate-300">Additional Message (Optional)</Label>
                <Textarea
                  id="custom_message"
                  value={emailData.custom_message}
                  onChange={(e) => handleInputChange('custom_message', e.target.value)}
                  placeholder="Any additional information you'd like to include"
                  rows={2}
                  className="mt-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={generateEmail}
                  disabled={isGenerating || !emailData.incident_description}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Bot className="w-4 h-4 mr-2" />
                  )}
                  Generate Email
                </Button>

                <Button
                  onClick={sendEmail}
                  disabled={isSending || !generatedEmail || !emailData.insurance_email}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Email
                </Button>
              </div>

              {generatedEmail && (
                <div>
                  <Label className="dark:text-slate-300">Generated Email Preview</Label>
                  <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
                    <div className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap font-sans" dangerouslySetInnerHTML={{ __html: generatedEmail.replace(/\n/g, '<br />') }} />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}