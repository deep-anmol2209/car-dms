'use server';

import { createClient } from '@/lib/supabase/server';

export interface SystemHealthStatus {
  inventory: 'OK' | 'ERROR';
  crm: 'OK' | 'ERROR';
  finance: 'OK' | 'ERROR';
  latency: string;

  // Data integrity
  unassignedLeads: number;       // ⚠️ valid but incomplete
  orphanLeads: number;           // ❌ invalid user reference
  orphanTestDrives: number;      // ❌ invalid vehicle reference
  corruptedRecords: number;      // ❌ total critical issues

  errors?: {
    inventory?: string;
    crm?: string;
    finance?: string;
  };
}

export async function checkDatabaseIntegrity(): Promise<SystemHealthStatus> {
  const startTime = Date.now();
  const supabase = await createClient();

  const status: SystemHealthStatus = {
    inventory: 'OK',
    crm: 'OK',
    finance: 'OK',
    latency: '0ms',

    unassignedLeads: 0,
    orphanLeads: 0,
    orphanTestDrives: 0,
    corruptedRecords: 0,

    errors: {},
  };

  try {
    // -----------------------------
    // Basic health checks
    // -----------------------------

    const { error: inventoryError } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });

    if (inventoryError) {
      status.inventory = 'ERROR';
      status.errors!.inventory = inventoryError.message;
    }

    const { error: crmError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (crmError) {
      status.crm = 'ERROR';
      status.errors!.crm = crmError.message;
    }

    const { error: financeError } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });

    if (financeError) {
      status.finance = 'ERROR';
      status.errors!.finance = financeError.message;
    }

    // -----------------------------
    // Lead integrity checks
    // -----------------------------

    const { data: allLeads, error: leadsError } = await supabase
      .from('leads')
      .select('assigned_to');

    if (!leadsError && allLeads) {
      // ⚠️ Unassigned leads (valid but incomplete)
      const unassignedLeads = allLeads.filter(
        (lead) => !lead.assigned_to
      ).length;

      // Fetch users
      const { data: users } = await supabase
        .from('users')
        .select('id');

      const validUserIds = new Set(users?.map((u) => u.id) || []);

      // ❌ Leads with invalid user reference
      const invalidAssigned = allLeads.filter(
        (lead) =>
          lead.assigned_to && !validUserIds.has(lead.assigned_to)
      ).length;

      status.unassignedLeads = unassignedLeads;
      status.orphanLeads = invalidAssigned;
    }

    // -----------------------------
    // Test drive integrity checks
    // -----------------------------

    const { data: testDrives, error: testDrivesError } = await supabase
      .from('test_drives')
      .select('vehicle_id');

    if (!testDrivesError && testDrives) {
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id');

      const validVehicleIds = new Set(vehicles?.map((v) => v.id) || []);

      status.orphanTestDrives = testDrives.filter(
        (td) =>
          td.vehicle_id && !validVehicleIds.has(td.vehicle_id)
      ).length;
    }

    // -----------------------------
    // Final calculations
    // -----------------------------

    status.corruptedRecords =
      status.orphanLeads + status.orphanTestDrives;

    status.latency = `${Date.now() - startTime}ms`;

  } catch (error: any) {
    status.inventory = 'ERROR';
    status.crm = 'ERROR';
    status.finance = 'ERROR';

    status.errors = {
      inventory: error.message,
      crm: error.message,
      finance: error.message,
    };

    status.latency = 'N/A';
  }

  return status;
}

// --------------------------------
// Table counts
// --------------------------------

export async function getTableCounts() {
  const supabase = await createClient();

  const tables = [
    'vehicles',
    'leads',
    'invoices',
    'users',
    'test_drives',
    'sales_deals',
  ];

  const counts: Record<string, number> = {};

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    counts[table] = error ? -1 : count || 0;
  }

  return counts;
}