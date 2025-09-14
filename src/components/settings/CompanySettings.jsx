import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Save, Building, Award, Phone, Mail, MapPin } from 'lucide-react';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';

export default function CompanySettings() {
  const [companyData, setCompanyData] = useState({
    company_name: 'Green Planet Restoration',
    company_address: '',
    company_phone: '',
    company_email: '',
    company_logo_url: '',
    license_number: '',
    contact_person: '',
    iicrc_certification_number: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const user = await User.me();
        setCompanyData({
          company_name: user.company_name || 'Green Planet Restoration',
          company_address: user.company_address || '',
          company_phone: user.company_phone || '',
          company_email: user.company_email || '',
          company_logo_url: user.company_logo_url || '',
          license_number: user.license_number || '',
          contact_person: user.contact_person || user.full_name || '',
          iicrc_certification_number: user.iicrc_certification_number || ''
        });
      } catch (error) {
        console.error('Failed to load company data:', error);
      }
    };
    loadCompanyData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await User.updateMyUserData(companyData);
      alert('Company settings saved successfully!');
    } catch (error) {
      console.error('Failed to save company data:', error);
      alert('Failed to save company settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await UploadFile({ file });
      handleInputChange('company_logo_url', result.file_url);
    } catch (error) {
      console.error('Failed to upload logo:', error);
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Company Identity */}
      <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 dark:text-slate-50">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-white" />
            </div>
            Company Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label className="dark:text-slate-300">Company Logo</Label>
              <div className="mt-2 flex items-center gap-4">
                {companyData.company_logo_url && (
                  <img 
                    src={companyData.company_logo_url} 
                    alt="Company Logo" 
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload').click()}
                    disabled={uploading}
                    className="dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="company_name" className="dark:text-slate-300 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Name *
              </Label>
              <Input
                id="company_name"
                value={companyData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Green Planet Restoration"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>

            <div>
              <Label htmlFor="contact_person" className="dark:text-slate-300">Primary Contact *</Label>
              <Input
                id="contact_person"
                value={companyData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
                placeholder="Contact person name"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>

            <div>
              <Label htmlFor="company_email" className="dark:text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Company Email *
              </Label>
              <Input
                id="company_email"
                type="email"
                value={companyData.company_email}
                onChange={(e) => handleInputChange('company_email', e.target.value)}
                placeholder="contact@greenplanetrestoration.com"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>

            <div>
              <Label htmlFor="company_phone" className="dark:text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Company Phone *
              </Label>
              <Input
                id="company_phone"
                type="tel"
                value={companyData.company_phone}
                onChange={(e) => handleInputChange('company_phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="company_address" className="dark:text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Company Address *
              </Label>
              <Textarea
                id="company_address"
                value={companyData.company_address}
                onChange={(e) => handleInputChange('company_address', e.target.value)}
                placeholder="Full company address"
                rows={3}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Certifications */}
      <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 dark:text-slate-50">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            Professional Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="iicrc_certification_number" className="dark:text-slate-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                IICRC Certification Number
              </Label>
              <Input
                id="iicrc_certification_number"
                value={companyData.iicrc_certification_number}
                onChange={(e) => handleInputChange('iicrc_certification_number', e.target.value)}
                placeholder="IICRC-12345678"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will appear on all reports to establish credibility with insurance adjusters
              </p>
            </div>

            <div>
              <Label htmlFor="license_number" className="dark:text-slate-300">Business License Number</Label>
              <Input
                id="license_number"
                value={companyData.license_number}
                onChange={(e) => handleInputChange('license_number', e.target.value)}
                placeholder="Business license number"
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 mb-2">
              <Award className="w-4 h-4" />
              <span className="font-semibold">IICRC Certification Benefits</span>
            </div>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Adding your IICRC certification number increases insurance adjuster trust and accelerates claim approvals. 
              This certification will be prominently displayed on all generated reports.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-2"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Company Settings'}
        </Button>
      </div>
    </div>
  );
}