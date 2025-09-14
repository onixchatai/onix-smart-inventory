import React from 'react';

export default function CompanyBranding({ companyName = "Your Restoration Company", companyLogo = null }) {
  return (
    <div className="flex items-center gap-3">
      {companyLogo ? (
        <img src={companyLogo} alt={companyName} className="w-10 h-10 rounded-xl object-cover" />
      ) : (
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">{companyName.charAt(0)}</span>
        </div>
      )}
      <div>
        <h2 className="font-bold text-slate-900 dark:text-slate-50 text-lg">{companyName}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Smart asset analysis</p>
      </div>
    </div>
  );
}