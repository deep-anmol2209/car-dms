import { PageHeader } from '@/components/page-header';
import { LedgerTable } from '@/components/financials/ledger-table';
import { getFinancialTransactions } from '@/lib/actions/financials';

export default async function FinancialsPage() {
  const transactions = await getFinancialTransactions();
  
  return (
    <div className="p-6">
      <PageHeader 
        title="Financial Ledger" 
        action={{ 
          label: 'Add Transaction', 
          onClick: () => console.log('Add transaction')
        }}
      />
      
      <div className="mt-6">
        <LedgerTable transactions={transactions} />
      </div>
    </div>
  );
}
