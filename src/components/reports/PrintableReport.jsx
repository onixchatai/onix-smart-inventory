import React from 'react';
import { format } from 'date-fns';
import { Image, Award } from 'lucide-react';

export default function PrintableReport({ reportData, items }) {
  const totalValue = items.reduce((sum, item) => sum + (item.estimated_value || 0), 0);

  return (
    <div className="hidden print:block font-sans p-8 bg-white text-gray-900">
        <style jsx global>{`
            @media print {
                body, html {
                    background: white !important;
                    color: black !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .no-print {
                    display: none !important;
                }
                @page {
                    size: A4;
                    margin: 20mm;
                }
                .printable-report-container {
                    break-inside: avoid;
                }
            }
        `}</style>

        {/* Report Header */}
        <div className="text-center mb-10 printable-report-container">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{reportData.title}</h1>
            <div className="text-lg text-emerald-700 font-semibold mb-2">Green Planet Restoration</div>
            <p className="text-sm text-gray-500">
                Generated for {reportData.owner_name || 'N/A'}
            </p>
        </div>

        {/* Owner Information */}
        <div className="mb-8 p-4 border rounded-lg printable-report-container">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Report Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Client:</strong> {reportData.owner_name || 'N/A'}</div>
                <div><strong>Property Address:</strong> {reportData.owner_address || 'N/A'}</div>
                <div><strong>Report Date:</strong> {format(new Date(reportData.report_date), 'MMMM d, yyyy')}</div>
                <div><strong>Purpose:</strong> {reportData.purpose || 'N/A'}</div>
            </div>
        </div>
        
        {/* Summary */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg printable-report-container">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Inventory Summary</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{items.length}</div>
                    <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">${totalValue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Estimated Value</div>
                </div>
            </div>
        </div>

        {/* Detailed Inventory */}
        <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Detailed Inventory</h2>
            <div className="space-y-6">
                {items.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg break-inside-avoid flex gap-6 printable-report-container">
                        <div className="w-28 h-28 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                            {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <Image className="w-8 h-8 text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">{index + 1}. {item.name}</h3>
                            {item.description && <p className="text-sm text-gray-600 mb-3">{item.description}</p>}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                <div><strong>Category:</strong> {item.category?.replace('_', ' ') || 'N/A'}</div>
                                <div><strong>Condition:</strong> {item.condition || 'N/A'}</div>
                                <div><strong>Brand:</strong> {item.brand || 'N/A'}</div>
                                <div><strong>Model:</strong> {item.model || 'N/A'}</div>
                                <div><strong>Location:</strong> {item.room_location || 'N/A'}</div>
                                <div><strong>Serial #:</strong> {item.serial_number || 'N/A'}</div>
                                <div><strong>Purchased:</strong> {item.purchase_date ? format(new Date(item.purchase_date), 'MM/dd/yyyy') : 'N/A'}</div>
                                <div><strong>Cost:</strong> {item.purchase_price ? `$${item.purchase_price.toLocaleString()}` : 'N/A'}</div>
                                <div className="col-span-2 mt-2">
                                    <strong>Est. Value:</strong> 
                                    <span className="font-bold text-emerald-700 ml-2">${item.estimated_value ? item.estimated_value.toLocaleString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Additional Notes */}
        {reportData.additional_notes && (
            <div className="mt-8 pt-4 border-t break-before-page printable-report-container">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Additional Notes</h2>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{reportData.additional_notes}</p>
            </div>
        )}

        <footer className="mt-10 pt-4 border-t text-center text-xs text-gray-400 break-before-page printable-report-container">
            <div className="mb-4">
                <div className="text-lg font-bold text-emerald-700">Green Planet Restoration</div>
                <p className="text-gray-600">Professional Property Assessment & Documentation Services</p>
            </div>
            <p>Report generated by the Green Planet Inventory Platform.</p>
            {reportData.iicrc_certification_number && (
                <div className="flex items-center justify-center gap-2 mt-2 font-semibold text-gray-600">
                    <Award className="w-4 h-4 text-green-600" />
                    <span>IICRC Certified Firm | Certification #{reportData.iicrc_certification_number}</span>
                </div>
            )}
            <p className="mt-2">All values are estimates based on user input and AI analysis.</p>
        </footer>
    </div>
  );
}