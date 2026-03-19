export const queryKeys = {
    reports: {
      all: ['reports'],
  
      sales: () => [...queryKeys.reports.all, 'sales'],
  
      inventory: () => [...queryKeys.reports.all, 'inventory'],
  
      leads: () => [...queryKeys.reports.all, 'leads'],
  
      financial: () => [...queryKeys.reports.all, 'financial'],
    },
  };