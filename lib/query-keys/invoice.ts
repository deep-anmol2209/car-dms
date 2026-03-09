export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...invoiceKeys.lists(), { filters }] as const,
  detail: (id: string) => [...invoiceKeys.all, 'detail', id] as const,
};
