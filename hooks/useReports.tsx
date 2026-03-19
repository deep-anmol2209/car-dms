export async function fetchSalesReport() {
    const res = await fetch('/api/reports/sales');
  
    if (!res.ok) {
      throw new Error('Failed to fetch sales report');
    }
  
    return res.json();
  }
  
  export async function fetchInventoryReport() {
    const res = await fetch('/api/reports/inventory');
  
    if (!res.ok) {
      throw new Error('Failed to fetch inventory report');
    }
  
    return res.json();
  }
  
  export async function fetchLeadsReport() {
    const res = await fetch('/api/reports/leads');
  
    if (!res.ok) {
      throw new Error('Failed to fetch leads report');
    }
  
    return res.json();
  }
  
  export async function fetchFinancialReport() {
    const res = await fetch('/api/reports/financial');
  
    if (!res.ok) {
      throw new Error('Failed to fetch financial report');
    }
  
    return res.json();
  }

  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';



import { queryKeys } from '../lib/query-keys/reports';

/* ======================
   SALES REPORT
====================== */

export function useSalesReport() {
  return useQuery({
    queryKey: queryKeys.reports.sales(),
    queryFn: fetchSalesReport,
  });
}

/* ======================
   INVENTORY REPORT
====================== */

export function useInventoryReport() {
  return useQuery({
    queryKey: queryKeys.reports.inventory(),
    queryFn: fetchInventoryReport,
  });
}

/* ======================
   LEADS REPORT
====================== */

export function useLeadsReport() {
  return useQuery({
    queryKey: queryKeys.reports.leads(),
    queryFn: fetchLeadsReport,
  });
}

/* ======================
   FINANCIAL REPORT
====================== */

export function useFinancialReport() {
  return useQuery({
    queryKey: queryKeys.reports.financial(),
    queryFn: fetchFinancialReport,
  });
}