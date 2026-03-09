/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Car, 
  FileText, 
  AlertTriangle, 
  Phone, 
  Calculator,
  Search,
  DollarSign,
  Users
} from 'lucide-react';

export const metadata = {
  title: "Help Center",
};

export default function HelpPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
        <p className="text-slate-600">
          Welcome to the Adaptus DMS Help Center. Find guides and instructions for common tasks.
        </p>
      </div>

      <div className="space-y-6">
        {/* Adding Stock Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle>Adding Stock (Vehicles)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Using the VIN Decoder
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-6">
                <li>Navigate to <strong>Inventory</strong> from the sidebar</li>
                <li>Click the <strong>&quot;Add Vehicle&quot;</strong> button</li>
                <li>Enter the 17-character VIN in the VIN field</li>
                <li>The system will automatically validate the VIN format</li>
                <li>If the VIN is invalid, you&apos;ll see an error message</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Profit Calculator
              </h3>
              <p className="text-sm text-slate-700 mb-2">
                The Profit Calculator automatically calculates your projected profit as you enter pricing information:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 ml-6">
                <li><strong>Purchase Price:</strong> What you paid for the vehicle</li>
                <li><strong>Reconditioning Cost:</strong> Any repairs or prep work</li>
                <li><strong>Retail Price:</strong> Your asking price</li>
                <li><strong>Projected Profit:</strong> Automatically calculated (Retail - Purchase - Recon)</li>
              </ul>
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600">
                  <strong>Tip:</strong> The profit indicator turns <span className="text-green-600 font-semibold">green</span> for positive profit and <span className="text-red-600 font-semibold">red</span> for negative profit.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Adding Vehicle Images</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-6">
                <li>In the vehicle form, find the &quot;Vehicle Images&quot; section</li>
                <li>Click &quot;Choose File&quot; or drag and drop images</li>
                <li>Images will upload to Supabase Storage automatically</li>
                <li>You can add multiple images per vehicle</li>
                <li>First image will be used as the thumbnail in the inventory list</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Invoicing Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle>Invoicing & Bill of Sale</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Creating an Invoice</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-6">
                <li>Go to <strong>Invoices</strong> from the sidebar</li>
                <li>Click <strong>&quot;Create Invoice&quot;</strong></li>
                <li>Select a customer from the dropdown (or create one in Leads first)</li>
                <li>Select the vehicle being sold</li>
                <li>Enter invoice details:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Invoice Number (e.g., INV-0001)</li>
                    <li>Invoice Date</li>
                    <li>Due Date</li>
                  </ul>
                </li>
                <li>Add pricing:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Base Price (auto-filled from vehicle retail price)</li>
                    <li>Package Name (e.g., &quot;Libra Package&quot;)</li>
                    <li>Package Fee</li>
                    <li>Any discounts</li>
                  </ul>
                </li>
                <li>Select tax mode (GST+PST or HST)</li>
                <li>Add any additional line items if needed</li>
                <li>Review the preview on the right side</li>
                <li>Click <strong>&quot;Create Invoice&quot;</strong></li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Printing a Bill of Sale</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-6">
                <li>Navigate to the <strong>Invoices</strong> page</li>
                <li>Find the invoice you want to print</li>
                <li>Click the <strong>Print icon</strong> (printer icon) in the Actions column</li>
                <li>The browser print dialog will open</li>
                <li>Select your printer and click &quot;Print&quot;</li>
                <li>The invoice will print with professional formatting including:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Dealership letterhead</li>
                    <li>Customer information</li>
                    <li>Vehicle details</li>
                    <li>Itemized pricing</li>
                    <li>Tax breakdown</li>
                    <li>Signature lines</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The invoice preview updates in real-time as you make changes. All calculations are automatic and precise to 2 decimal places.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Duplicates Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <CardTitle>Handling Duplicate Leads</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Understanding Duplicate Detection</h3>
              <p className="text-sm text-slate-700 mb-3">
                Adaptus DMS automatically detects potential duplicate leads as you type. This helps prevent duplicate customer records.
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      i
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800 text-sm mb-1">Blue Badge: Phone Match</p>
                      <p className="text-xs text-blue-700">
                        This phone number already exists in the system. The badge shows the existing customer&apos;s name and assigned staff member.
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        <strong>Action:</strong> Click &quot;View Existing Record&quot; to see the existing lead instead of creating a duplicate.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      !
                    </div>
                    <div>
                      <p className="font-semibold text-red-800 text-sm mb-1">Red Badge: Name Match</p>
                      <p className="text-xs text-red-700">
                        A similar name was found in the system. This might be the same person with a different phone number.
                      </p>
                      <p className="text-xs text-red-600 mt-2">
                        <strong>Action:</strong> Review the existing record to confirm if it&apos;s the same person before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What to Do When Duplicates Appear</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-6">
                <li><strong>If it&apos;s the same customer:</strong> Click &quot;View Existing Record&quot; and update that record instead</li>
                <li><strong>If it&apos;s a different customer:</strong> Verify the phone number is correct, then proceed with creating the new lead</li>
                <li><strong>If unsure:</strong> Contact the assigned staff member shown in the duplicate alert</li>
                <li><strong>For name matches:</strong> Check the existing lead&apos;s details to confirm it&apos;s a different person</li>
              </ol>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Best Practice:</strong> Always check for duplicates before creating a new lead. This keeps your customer database clean and prevents confusion.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-teal-600" />
              </div>
              <CardTitle>Support & Contact</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-sm mb-2">IT Administrator</p>
                  <p className="text-sm text-slate-600">
                    For technical issues, system errors, or access problems, contact your IT administrator.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Contact information should be provided by your dealership management.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-sm mb-2">System Health Check</p>
                  <p className="text-sm text-slate-600 mb-2">
                    If you&apos;re experiencing slow performance or errors, check the system health:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600 ml-4">
                    <li>Go to <strong>Settings</strong></li>
                    <li>Click <strong>&quot;System Health&quot;</strong></li>
                    <li>Review the status of all modules</li>
                    <li>Report any errors to IT support</li>
                  </ol>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-sm mb-2">Common Issues</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 ml-4">
                    <li><strong>Can&apos;t save a vehicle:</strong> Check that the VIN is exactly 17 characters</li>
                    <li><strong>Invoice won&apos;t print:</strong> Make sure pop-ups are enabled in your browser</li>
                    <li><strong>Duplicate detection not working:</strong> Check your internet connection</li>
                    <li><strong>Slow loading:</strong> Check System Health for database latency</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Adding a Lead
                </p>
                <p className="text-xs text-slate-600">
                  Leads → Add Lead → Fill form → Watch for duplicates → Save
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Marking Invoice Paid
                </p>
                <p className="text-xs text-slate-600">
                  Invoices → Find invoice → Click checkmark → Confirmed
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Filtering Inventory
                </p>
                <p className="text-xs text-slate-600">
                  Inventory → Use search bar → Apply status filters → View results
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Viewing Reports
                </p>
                <p className="text-xs text-slate-600">
                  Dashboard → View KPI cards → Check charts → Review recent activity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
